import boto3
import json
from datetime import datetime

AWS_S3_BUCKET = "capuvas3"
AWS_ACCESS_KEY = "AKIAT7NSQPGGWNAMXWI2"
AWS_SECRET_KEY = "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"

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

def upload_to_s3(bucket, object_name, data):
    """
    Upload data to an S3 bucket.
    """
    try:
        s3_client.put_object(Bucket=bucket, Key=object_name, Body=data)
        print(f"Successfully uploaded to S3: {object_name}")
    except Exception as e:
        print(f"Failed to upload to S3: {e}")

def generate_combined_data():
    """
    Generate combined data for all cameras in a single JSON structure.
    """
    combined_data = {"cameras": []}

    # Generate data for 3 cameras
    for camera_id in range(1, 4):
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        enter_count = 5 + camera_id  # Example unique values per camera
        exit_count = 3 + camera_id
        camera_data = {
            "camera_id": f"camera_{camera_id}",
            "time": current_time,
            "in": enter_count,
            "out": exit_count
        }
        combined_data["cameras"].append(camera_data)
    
    return json.dumps(combined_data, indent=4)

def upload_combined_data():
    """
    Upload combined camera data to a single input file in S3.
    """
    result_json = generate_combined_data()
    object_name = f"combined_results/combined_{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
    upload_to_s3(AWS_S3_BUCKET, object_name, result_json)

if __name__ == "__main__":
    upload_combined_data()
