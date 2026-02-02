import os
from pathlib import Path

S3_BUCKET = os.environ.get("S3_BUCKET", "afcbucketuva")
MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable must be set")
MONGO_DB = os.environ.get("MONGO_DB", "CAPUVA")

ACTIVE_CAMERAS = ["hoopcamera", "enter", "exit", "basement", "secondfloorcam1", "secondfloorcam2"]

ENABLE_HOOP = "hoopcamera" in ACTIVE_CAMERAS
ENABLE_ENTER = "enter" in ACTIVE_CAMERAS
ENABLE_EXIT = "exit" in ACTIVE_CAMERAS
ENABLE_BASEMENT = "basement" in ACTIVE_CAMERAS
ENABLE_WEIGHTROOM = "weightroom" in ACTIVE_CAMERAS
ENABLE_SECONDFLOOR1 = "secondfloorcam1" in ACTIVE_CAMERAS
ENABLE_SECONDFLOOR2 = "secondfloorcam2" in ACTIVE_CAMERAS

ENABLE_FLOOR1 = ENABLE_ENTER
ENABLE_FLOOR2 = ENABLE_SECONDFLOOR1 or ENABLE_SECONDFLOOR2

TEST_MODE = os.environ.get("TEST_MODE", "false").lower() == "true"
TEST_DATA_DIR = Path(__file__).parent.parent / "test_data"
