from datetime import datetime, timezone
from pathlib import Path
import json

from config import TEST_MODE, TEST_DATA_DIR

try:
    import boto3
except ModuleNotFoundError:
    boto3 = None

s3 = boto3.client("s3") if (boto3 is not None and not TEST_MODE) else None


def mock_list_objects_v2(Bucket, Prefix):
    parts = Prefix.split("/")
    if len(parts) < 2:
        return {"Contents": []}
    
    camera_folder = parts[0]
    date_part = parts[1] if len(parts) > 1 else ""
    
    camera_path = TEST_DATA_DIR / camera_folder
    if not camera_path.exists():
        return {"Contents": []}
    
    objects = []
    for file_path in camera_path.glob(f"{date_part}*.json"):
        stat = file_path.stat()
        key = f"{camera_folder}/{file_path.name}"
        objects.append({
            "Key": key,
            "LastModified": datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc),
            "Size": stat.st_size
        })
    
    return {"Contents": objects}


def mock_get_object(Bucket, Key):
    file_path = TEST_DATA_DIR / Key
    if not file_path.exists():
        raise FileNotFoundError(f"Test file not found: {Key}")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    class MockBody:
        def __init__(self, data):
            self.data = data.encode() if isinstance(data, str) else data
        def read(self):
            return self.data
        def decode(self):
            return self.data.decode() if isinstance(self.data, bytes) else self.data
    
    return {"Body": MockBody(content)}


def get_s3_client():
    if TEST_MODE:
        return {
            "list_objects_v2": mock_list_objects_v2,
            "get_object": mock_get_object
        }
    else:
        return {
            "list_objects_v2": s3.list_objects_v2,
            "get_object": s3.get_object
        }
