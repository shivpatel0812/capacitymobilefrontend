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

def upload_to_s3(file_name, bucket, object_name, data):
    try:
        s3_client.put_object(Bucket=bucket, Key=object_name, Body=data)
        print(f"Successfully uploaded to S3: {object_name}")
    except Exception as e:
        print(f"Failed to upload to S3: {e}")

def test_s3_upload():
    # Generate test data
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    enter_count = 5  # Example value
    exit_count = 3  # Example value
    result_data = [{"time": current_time, "in": enter_count + 3, "out": exit_count}]

    # Convert dictionary to JSON string
    result_json = json.dumps(result_data)

    # Define file details
    file_name = "test_results.json"
    object_name = "test/test_results.json"

    # Upload to S3
    upload_to_s3(file_name, AWS_S3_BUCKET, object_name, result_json)

if __name__ == "__main__":
    test_s3_upload()
