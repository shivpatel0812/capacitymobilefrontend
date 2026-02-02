import json
from datetime import datetime, timezone, timedelta

from config import S3_BUCKET, TEST_MODE, ACTIVE_CAMERAS
from s3_client import get_s3_client


def fetch_camera_data():
    s3_client = get_s3_client()
    list_objects = s3_client["list_objects_v2"]
    get_object = s3_client["get_object"]
    
    cameras = list(ACTIVE_CAMERAS)
    camera_data = {}
    camera_keys = {}
    
    for camera in cameras:
        all_objects = []
        
        for days_ago in range(3):
            date = (datetime.now(timezone.utc) - timedelta(days=days_ago)).strftime("%Y-%m-%d")
            prefix = f"{camera}/{date}"
            
            print(f"Checking prefix: {prefix} {'[TEST MODE]' if TEST_MODE else ''}")
            
            response = list_objects(Bucket=S3_BUCKET, Prefix=prefix)
            
            if "Contents" in response:
                all_objects.extend(response["Contents"])
        
        if all_objects:
            latest_obj = sorted(all_objects, key=lambda x: x["Key"], reverse=True)[0]
            key = latest_obj["Key"]
            camera_keys[camera] = key
            
            if TEST_MODE:
                obj = get_object(Bucket=S3_BUCKET, Key=key)
                data = json.loads(obj["Body"].decode())
            else:
                obj = get_object(Bucket=S3_BUCKET, Key=key)
                data = json.loads(obj["Body"].read().decode())
            
            camera_data[camera] = data
            print(f"Found {camera}: {key}")
        else:
            print(f"No files found for {camera}")
    
    return camera_data, camera_keys
