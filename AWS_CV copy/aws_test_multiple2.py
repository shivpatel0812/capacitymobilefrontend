import boto3
import json
from datetime import datetime

AWS_S3_BUCKET = "capuvas3"
AWS_ACCESS_KEY = "AKIAT7NSQPGGWNAMXWI2"
AWS_SECRET_KEY = "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"

# # Initialize S3 client
# s3_client = boto3.client(
#     's3',
#     aws_access_key_id=AWS_ACCESS_KEY,
#     aws_secret_access_key=AWS_SECRET_KEY
# )

s3_client = boto3.client('s3')

# Bucket and camera configuration
bucket_name = "capuvas3"  # Replace with your actual bucket
camera_ids = ["camera_1", "camera_2", "camera_3"]  # Simulating multiple cameras

def generate_camera_data(camera_id):
    # In a real scenario, these counts would be actual counts of people entering and leaving.
    # Here we're just simulating some arbitrary numbers.
    in_count = 5  # Example: the camera detected 5 people coming in
    out_count = 2 # Example: the camera detected 2 people going out

    # Current timestamp as a string
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    data = {
        "camera_id": camera_id,
        "time": current_time,
        "in": in_count,
        "out": out_count
    }
    return data

def upload_camera_data_to_s3(camera_id, data):
    # We'll store files per camera in a prefix structure:
    # camera_1/2024-12-15_14-53-52.json
    # camera_2/2024-12-15_14-53-52.json
    # ...
    # This simulates each camera uploading its data independently.
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    object_key = f"{camera_id}/{timestamp}.json"
    
    # Convert data to JSON string
    json_data = json.dumps(data)

    # Upload to S3
    response = s3_client.put_object(
        Bucket=bucket_name,
        Key=object_key,
        Body=json_data,
        ContentType="application/json"
    )
    print(f"Uploaded data for {camera_id} to s3://{bucket_name}/{object_key}")
    return response

if __name__ == "__main__":
    # In a real scenario, this script might be called every 5 minutes,
    # or run continuously and send updates as they come in.
    # Here, we just simulate one "interval" of data for each camera.
    for cam_id in camera_ids:
        cam_data = generate_camera_data(cam_id)
        upload_camera_data_to_s3(cam_id, cam_data)