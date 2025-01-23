import boto3
import json
from datetime import datetime

# AWS configuration
CLEMONS_BUCKET_NAME = "clemonslibrary"  # Replace with your actual Clemons library S3 bucket name
AWS_ACCESS_KEY = "AKIAT7NSQPGGWNAMXWI2"
AWS_SECRET_KEY = "TC2NDX/L94Ds+Webi5qJyG7lXcupw+T+DC5DjCYe"

# Initialize S3 client
# If you are using credentials from environment variables or IAM roles, you can omit aws_access_key_id and aws_secret_access_key
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

# Camera configuration for Clemons Library
camera_ids = ["clemons_camera_1", "clemons_camera_2", "clemons_camera_3", "clemons_camera_4", "clemons_camera_5", "clemons_camera_6"]

def generate_camera_data(camera_id):
    # Simulate in/out counts
    # These values could be randomized or based on some logic. Here we'll keep them static for testing.
    in_count = 10  # Example: detected 5 people coming in
    out_count = 2 # Example: detected 2 people going out

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = {
        "camera_id": camera_id,
        "time": current_time,
        "in": in_count,
        "out": out_count
    }
    return data

def upload_camera_data_to_s3(camera_id, data):
    # We'll store each camera's data under its own prefix, for example:
    # clemons_camera_1/2024-12-17_10-15-30.json
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    object_key = f"{camera_id}/{timestamp}.json"
    
    json_data = json.dumps(data)
    response = s3_client.put_object(
        Bucket=CLEMONS_BUCKET_NAME,
        Key=object_key,
        Body=json_data,
        ContentType="application/json"
    )
    print(f"Uploaded data for {camera_id} to s3://{CLEMONS_BUCKET_NAME}/{object_key}")
    return response

if __name__ == "__main__":
    # Simulate one interval of data for each of the 6 Clemons library cameras
    for cam_id in camera_ids:
        cam_data = generate_camera_data(cam_id)
        upload_camera_data_to_s3(cam_id, cam_data)
