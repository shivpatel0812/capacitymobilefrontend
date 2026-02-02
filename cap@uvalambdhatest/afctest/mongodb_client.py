from pymongo import MongoClient
from config import TEST_MODE, MONGO_URI, MONGO_DB

if not TEST_MODE:
    mongo = MongoClient(MONGO_URI)
    db = mongo[MONGO_DB]
    afctest = db["afctest"]
    afccapacity = db["afccapacity"]
else:
    mongo = None
    db = None
    afctest = {}
    afccapacity = []
