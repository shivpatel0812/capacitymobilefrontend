import json

from camera_processor import fetch_camera_data
from capacity import process_capacity_update


def lambda_handler(event, context):
    camera_data, camera_keys = fetch_camera_data()
    process_capacity_update(camera_data, camera_keys)
    return {"statusCode": 200, "body": json.dumps({"processed": True, "cameras": list(camera_keys.keys())})}
