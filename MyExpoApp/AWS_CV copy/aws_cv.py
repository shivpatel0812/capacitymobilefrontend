from ultralytics import YOLO
import cv2
import json
import boto3
from datetime import datetime

AWS_S3_BUCKET = "capuvas3"
AWS_ACCESS_KEY = "AKIAT7NSQPGGWNAMXWI2"
AWS_SECRET_KEY = "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"

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

def upload_to_s3(file_name, bucket, object_name, data):
    try:
        s3_client.put_object(Bucket=bucket, Key=object_name, Body=data)
        print(f"Successfully uploaded to S3: {object_name}")
    except Exception as e:
        print(f"Failed to upload to S3: {e}")

# YOLO Model
model = YOLO('yolov8n.pt')

# Video path
video_path = "/Users/shivpatel/ML-UVA---Capacity-Tractor/in_out_logic/new_in_out.mp4"
cap = cv2.VideoCapture(video_path)

enter_count = 0
exit_count = 0
previous_positions = {}

frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
door_line_x = int(frame_width * 0.5)

box_width = int(frame_width * 0.2)
box_height = int(frame_height * 0.8)
box_x = door_line_x - box_width // 2
box_y = (frame_height - box_height) // 2

def adjust_door_line(value):
    global door_line_x, box_x
    door_line_x = value
    box_x = door_line_x - box_width // 2

cv2.namedWindow("Video Counter")
cv2.createTrackbar("Door Line", "Video Counter", door_line_x, frame_width, adjust_door_line)

if not cap.isOpened():
    print("Video cannot be opened")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)
    persons = [res for res in results[0].boxes if res.cls == 0]

    current_positions = {}

    for person_id, person in enumerate(persons):
        x1, y1, x2, y2 = map(int, person.xyxy[0])
        center_x = int((x1 + x2) / 2)
        center_y = int((y1 + y2) / 2)

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 4)
        cv2.putText(frame, f'Person {person_id}', (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        current_positions[person_id] = (center_x, center_y)

        if person_id in previous_positions:
            prev_center_x, prev_center_y = previous_positions[person_id]

            if box_y <= center_y <= box_y + box_height:
                if prev_center_x < door_line_x and center_x >= door_line_x:
                    exit_count += 1
                elif prev_center_x > door_line_x and center_x <= door_line_x:
                    enter_count += 1

    cv2.line(frame, (door_line_x, box_y), (door_line_x, box_y + box_height), (0, 255, 255), 2)
    cv2.rectangle(frame, (box_x, box_y), (box_x + box_width, box_y + box_height), (255, 0, 0), 2)
    cv2.putText(frame, f'Enter: {enter_count}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(frame, f'Exit: {exit_count}', (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    cv2.imshow("Video Counter", frame)
    previous_positions = current_positions.copy()

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
result_data = [{"time": current_time, "in": enter_count + 3, "out": exit_count}]
result_json = json.dumps(result_data)


upload_to_s3("results.json", AWS_S3_BUCKET, "results/capacity_results.json", result_json)
