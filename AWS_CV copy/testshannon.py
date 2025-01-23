import boto3
import json
from datetime import datetime

# AWS configuration
SHANNON_BUCKET_NAME = "shannonlibrarybucket"  # Replace with your actual bucket name
AWS_ACCESS_KEY = "AKIAT7NSQPGGWNAMXWI2"
AWS_SECRET_KEY = "TC2NDX/L94Ds+Webi5qJyG7lXcupw+T+DC5DjCYe"

# Initialize S3 client
# If you are using credentials from environment variables or IAM roles, you can omit aws_access_key_id and aws_secret_access_key
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
)

# Camera configuration for Shannon (adjusted to only 4 cameras)
shannon_camera_ids = [
    "shannon_camera_1",
    "shannon_camera_2",
    "shannon_camera_3",
    "shannon_camera_4",
]

def generate_camera_data(camera_id):
    """
    Simulate in/out counts for a camera. You can adjust the logic as needed.
    """
    in_count = 10  # Example: 10 people came in
    out_count = 2  # Example: 2 people went out

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = {
        "camera_id": camera_id,
        "time": current_time,
        "in": in_count,
        "out": out_count,
    }
    return data

def upload_camera_data_to_s3(bucket_name, camera_id, data):
    """
    Upload JSON data for a specific camera to S3.
    """
    # Create a file name based on the current timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    object_key = f"{camera_id}/{timestamp}.json"

    # Convert the data to JSON and upload to S3
    json_data = json.dumps(data)
    response = s3_client.put_object(
        Bucket=bucket_name,
        Key=object_key,
        Body=json_data,
        ContentType="application/json",
    )
    print(f"Uploaded data for {camera_id} to s3://{bucket_name}/{object_key}")
    return response

if __name__ == "__main__":
    # Simulate one interval of data for each of the 4 Shannon cameras
    for cam_id in shannon_camera_ids:
        cam_data = generate_camera_data(cam_id)
        upload_camera_data_to_s3(SHANNON_BUCKET_NAME, cam_id, cam_data)
