from datetime import datetime, timezone

from config import (
    TEST_MODE, ACTIVE_CAMERAS, ENABLE_HOOP, ENABLE_ENTER, ENABLE_EXIT,
    ENABLE_BASEMENT, ENABLE_WEIGHTROOM, ENABLE_SECONDFLOOR1, ENABLE_SECONDFLOOR2,
    ENABLE_FLOOR1, ENABLE_FLOOR2
)
from mongodb_client import afctest, afccapacity


def process_capacity_update(camera_data, camera_keys):
    if TEST_MODE:
        doc = afctest.get("capacity", {
            "_id": "capacity",
            "floor1": 0,
            "floor2": 0,
            "basketball_court": 0,
            "basement": 0,
            "weightroom": 0,
            "last_processed": {},
            "last_basketball_court_count": 0
        })
    else:
        doc = afctest.find_one({"_id": "capacity"}) or {
            "_id": "capacity",
            "floor1": 0,
            "floor2": 0,
            "basketball_court": 0,
            "basement": 0,
            "weightroom": 0,
            "last_processed": {},
            "last_basketball_court_count": 0
        }
    
    doc.setdefault("floor1", 0)
    doc.setdefault("floor2", 0)
    doc.setdefault("basketball_court", 0)
    doc.setdefault("basement", 0)
    doc.setdefault("weightroom", 0)
    doc.setdefault("last_processed", {})
    doc.setdefault("last_basketball_court_count", 0)

    def _filtered_last_processed() -> dict:
        allowed = set(ACTIVE_CAMERAS)
        return {k: v for k, v in (doc.get("last_processed") or {}).items() if k in allowed}

    def _doc_to_store() -> dict:
        out = {"_id": "capacity", "last_processed": _filtered_last_processed()}
        if ENABLE_HOOP:
            out["basketball_court"] = doc.get("basketball_court", 0)
            out["last_basketball_court_count"] = doc.get("last_basketball_court_count", 0)
        if ENABLE_FLOOR1:
            out["floor1"] = doc.get("floor1", 0)
        if ENABLE_FLOOR2:
            out["floor2"] = doc.get("floor2", 0)
        if ENABLE_BASEMENT:
            out["basement"] = doc.get("basement", 0)
        if ENABLE_WEIGHTROOM:
            out["weightroom"] = doc.get("weightroom", 0)
        return out
    
    basketball_court_delta = 0
    if ENABLE_HOOP and "hoopcamera" in camera_data:
        hoop_data = camera_data["hoopcamera"]
        hoop_key = camera_keys.get("hoopcamera")
        
        if hoop_key and doc.get("last_processed", {}).get("hoopcamera") == hoop_key:
            print(f"Already processed hoopcamera: {hoop_key}")
        elif hoop_key:
            last_basketball_count = doc.get("last_basketball_court_count", 0)
            
            new_basketball_count = int(
                hoop_data.get("total_capacity")
                or hoop_data.get("unique_count")
                or hoop_data.get("detections")
                or hoop_data.get("count")
                or 0
            )
            
            basketball_court_delta = new_basketball_count - last_basketball_count
            doc["basketball_court"] = doc.get("basketball_court", 0) + basketball_court_delta
            doc["last_basketball_court_count"] = new_basketball_count
            doc["last_processed"]["hoopcamera"] = hoop_key
            
            print(f"Basketball court: {new_basketball_count} (delta: {basketball_court_delta})")
    
    enter_in = 0
    enter_out = 0
    exit_out = 0

    if ENABLE_ENTER and "enter" in camera_data:
        enter_data = camera_data["enter"]
        enter_key = camera_keys.get("enter")
        if enter_key and doc.get("last_processed", {}).get("enter") != enter_key:
            enter_in = int(
                enter_data.get("in")
                or enter_data.get("enter")
                or enter_data.get("unique_count")
                or enter_data.get("count")
                or 0
            )
            enter_out = int(
                enter_data.get("out")
                or enter_data.get("exit")
                or 0
            )
            doc["last_processed"]["enter"] = enter_key
            if ENABLE_EXIT:
                print(f"Enter (in only): {enter_in}")
            else:
                print(f"Enter cam (in/out): in={enter_in}, out={enter_out}")

    if ENABLE_EXIT and "exit" in camera_data:
        exit_data = camera_data["exit"]
        exit_key = camera_keys.get("exit")
        if exit_key and doc.get("last_processed", {}).get("exit") != exit_key:
            exit_out = int(
                exit_data.get("out")
                or exit_data.get("exit")
                or exit_data.get("count")
                or 0
            )
            doc["last_processed"]["exit"] = exit_key
            print(f"Exit: {exit_out}")
    
    basement_enter = 0
    basement_exit = 0
    
    if ENABLE_BASEMENT and "basement" in camera_data:
        basement_data = camera_data["basement"]
        basement_key = camera_keys.get("basement")
        
        if basement_key and doc.get("last_processed", {}).get("basement") != basement_key:
            basement_enter = int(
                basement_data.get("in")
                or basement_data.get("enter")
                or basement_data.get("count")
                or 0
            )
            basement_exit = int(
                basement_data.get("out")
                or basement_data.get("exit")
                or 0
            )
            doc["last_processed"]["basement"] = basement_key
            print(f"Basement - Enter: {basement_enter}, Exit: {basement_exit}")
    
    weightroom_enter = 0
    weightroom_exit = 0
    
    if ENABLE_WEIGHTROOM and "weightroom" in camera_data:
        weightroom_data = camera_data["weightroom"]
        weightroom_key = camera_keys.get("weightroom")
        
        if weightroom_key and doc.get("last_processed", {}).get("weightroom") != weightroom_key:
            weightroom_enter = int(
                weightroom_data.get("in")
                or weightroom_data.get("enter")
                or weightroom_data.get("count")
                or 0
            )
            weightroom_exit = int(
                weightroom_data.get("out")
                or weightroom_data.get("exit")
                or 0
            )
            doc["last_processed"]["weightroom"] = weightroom_key
            print(f"Weightroom - Enter: {weightroom_enter}, Exit: {weightroom_exit}")
    
    secondfloor1_in = 0
    secondfloor1_out = 0
    
    if ENABLE_SECONDFLOOR1 and "secondfloorcam1" in camera_data:
        secondfloor1_data = camera_data["secondfloorcam1"]
        secondfloor1_key = camera_keys.get("secondfloorcam1")
        
        if secondfloor1_key and doc.get("last_processed", {}).get("secondfloorcam1") != secondfloor1_key:
            secondfloor1_in = int(
                secondfloor1_data.get("in")
                or secondfloor1_data.get("up")
                or secondfloor1_data.get("count")
                or 0
            )
            secondfloor1_out = int(
                secondfloor1_data.get("out")
                or secondfloor1_data.get("down")
                or 0
            )
            doc["last_processed"]["secondfloorcam1"] = secondfloor1_key
            print(f"SecondFloor1 - In (up): {secondfloor1_in}, Out (down): {secondfloor1_out}")
    
    secondfloor2_in = 0
    secondfloor2_out = 0
    secondfloor2_in2 = 0
    secondfloor2_out2 = 0
    
    if ENABLE_SECONDFLOOR2 and "secondfloorcam2" in camera_data:
        secondfloor2_data = camera_data["secondfloorcam2"]
        secondfloor2_key = camera_keys.get("secondfloorcam2")
        
        if secondfloor2_key and doc.get("last_processed", {}).get("secondfloorcam2") != secondfloor2_key:
            secondfloor2_in = int(
                secondfloor2_data.get("in")
                or secondfloor2_data.get("enter")
                or secondfloor2_data.get("in1")
                or 0
            )
            secondfloor2_out = int(
                secondfloor2_data.get("out")
                or secondfloor2_data.get("exit")
                or secondfloor2_data.get("out1")
                or 0
            )
            secondfloor2_in2 = int(
                secondfloor2_data.get("in2")
                or secondfloor2_data.get("enter2")
                or 0
            )
            secondfloor2_out2 = int(
                secondfloor2_data.get("out2")
                or secondfloor2_data.get("exit2")
                or 0
            )
            doc["last_processed"]["secondfloorcam2"] = secondfloor2_key
            print(f"SecondFloor2 - In: {secondfloor2_in}, Out: {secondfloor2_out}, In2: {secondfloor2_in2}, Out2: {secondfloor2_out2}")
    
    weightroom_delta = 0
    if ENABLE_WEIGHTROOM:
        weightroom_delta = weightroom_enter - weightroom_exit
        doc["weightroom"] = doc.get("weightroom", 0) + weightroom_delta
        if doc["weightroom"] < 0:
            doc["weightroom"] = 0
    
    floor1_delta = 0
    if ENABLE_FLOOR1:
        floor1_net = (enter_in - exit_out) if ENABLE_EXIT else (enter_in - enter_out)
        subtract_rooms = 0
        if ENABLE_HOOP:
            subtract_rooms += basketball_court_delta
        if ENABLE_WEIGHTROOM:
            subtract_rooms += weightroom_delta
        if ENABLE_SECONDFLOOR1:
            floor1_net -= secondfloor1_in
            floor1_net += secondfloor1_out

        floor1_delta = floor1_net - subtract_rooms
        doc["floor1"] = doc.get("floor1", 0) + floor1_delta
        if doc["floor1"] < 0:
            doc["floor1"] = 0
    
    floor2_delta = 0
    if ENABLE_FLOOR2:
        floor2_from_cam1 = secondfloor1_in - secondfloor1_out if ENABLE_SECONDFLOOR1 else 0
        
        floor2_from_cam2 = 0
        if ENABLE_SECONDFLOOR2:
            floor2_from_cam2 = (secondfloor2_in + secondfloor2_in2) - (secondfloor2_out + secondfloor2_out2)
        
        floor2_delta = floor2_from_cam1 + floor2_from_cam2
        doc["floor2"] = doc.get("floor2", 0) + floor2_delta
        if doc["floor2"] < 0:
            doc["floor2"] = 0
    
    basement_delta = 0
    if ENABLE_BASEMENT:
        basement_delta = basement_enter - basement_exit
        doc["basement"] = doc.get("basement", 0) + basement_delta
        if doc["basement"] < 0:
            doc["basement"] = 0
    
    if TEST_MODE:
        afctest["capacity"] = _doc_to_store()
        rec = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "active_cameras": list(ACTIVE_CAMERAS),
            "camera_keys": camera_keys,
            "raw_camera_data": camera_data,
        }
        if ENABLE_HOOP:
            rec.update({
                "basketball_court": doc.get("basketball_court", 0),
                "basketball_court_delta": basketball_court_delta,
            })
        if ENABLE_FLOOR1:
            rec.update({
                "floor1": doc.get("floor1", 0),
                "floor1_delta": floor1_delta,
                "enter_in": enter_in,
                "enter_out": enter_out,
                "exit_out": exit_out,
            })
        if ENABLE_BASEMENT:
            rec.update({
                "basement": doc.get("basement", 0),
                "basement_delta": basement_delta,
                "basement_enter": basement_enter,
                "basement_exit": basement_exit,
            })
        if ENABLE_WEIGHTROOM:
            rec.update({
                "weightroom": doc.get("weightroom", 0),
                "weightroom_delta": weightroom_delta,
                "weightroom_enter": weightroom_enter,
                "weightroom_exit": weightroom_exit,
            })
        if ENABLE_FLOOR2:
            rec.update({
                "floor2": doc.get("floor2", 0),
                "floor2_delta": floor2_delta,
            })
        if ENABLE_SECONDFLOOR1:
            rec.update({
                "secondfloor1_in": secondfloor1_in,
                "secondfloor1_out": secondfloor1_out,
            })
        if ENABLE_SECONDFLOOR2:
            rec.update({
                "secondfloor2_in": secondfloor2_in,
                "secondfloor2_out": secondfloor2_out,
                "secondfloor2_in2": secondfloor2_in2,
                "secondfloor2_out2": secondfloor2_out2,
            })
        afccapacity.append(rec)

        if ENABLE_FLOOR1:
            print(f"[TEST MODE] Floor 1 capacity: {doc.get('floor1', 0)}")
        if ENABLE_FLOOR2:
            print(f"[TEST MODE] Floor 2 capacity: {doc.get('floor2', 0)}")
        if ENABLE_HOOP:
            print(f"[TEST MODE] Basketball court capacity: {doc.get('basketball_court', 0)}")
        if ENABLE_BASEMENT:
            print(f"[TEST MODE] Basement capacity: {doc.get('basement', 0)}")
        if ENABLE_WEIGHTROOM:
            print(f"[TEST MODE] Weightroom capacity: {doc.get('weightroom', 0)}")
    else:
        afctest.update_one({"_id": "capacity"}, {"$set": _doc_to_store()}, upsert=True)
        rec = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "active_cameras": list(ACTIVE_CAMERAS),
            "camera_keys": camera_keys,
            "raw_camera_data": camera_data,
        }
        if ENABLE_HOOP:
            rec.update({
                "basketball_court": doc.get("basketball_court", 0),
                "basketball_court_delta": basketball_court_delta,
            })
        if ENABLE_FLOOR1:
            rec.update({
                "floor1": doc.get("floor1", 0),
                "floor1_delta": floor1_delta,
                "enter_in": enter_in,
                "enter_out": enter_out,
                "exit_out": exit_out,
            })
        if ENABLE_BASEMENT:
            rec.update({
                "basement": doc.get("basement", 0),
                "basement_delta": basement_delta,
                "basement_enter": basement_enter,
                "basement_exit": basement_exit,
            })
        if ENABLE_WEIGHTROOM:
            rec.update({
                "weightroom": doc.get("weightroom", 0),
                "weightroom_delta": weightroom_delta,
                "weightroom_enter": weightroom_enter,
                "weightroom_exit": weightroom_exit,
            })
        if ENABLE_FLOOR2:
            rec.update({
                "floor2": doc.get("floor2", 0),
                "floor2_delta": floor2_delta,
            })
        if ENABLE_SECONDFLOOR1:
            rec.update({
                "secondfloor1_in": secondfloor1_in,
                "secondfloor1_out": secondfloor1_out,
            })
        if ENABLE_SECONDFLOOR2:
            rec.update({
                "secondfloor2_in": secondfloor2_in,
                "secondfloor2_out": secondfloor2_out,
                "secondfloor2_in2": secondfloor2_in2,
                "secondfloor2_out2": secondfloor2_out2,
            })
        afccapacity.insert_one(rec)

        if ENABLE_FLOOR1:
            print(f"Floor 1 capacity: {doc.get('floor1', 0)}")
        if ENABLE_FLOOR2:
            print(f"Floor 2 capacity: {doc.get('floor2', 0)}")
        if ENABLE_HOOP:
            print(f"Basketball court capacity: {doc.get('basketball_court', 0)}")
        if ENABLE_BASEMENT:
            print(f"Basement capacity: {doc.get('basement', 0)}")
        if ENABLE_WEIGHTROOM:
            print(f"Weightroom capacity: {doc.get('weightroom', 0)}")
