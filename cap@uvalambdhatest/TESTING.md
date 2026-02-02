# Testing Commands

## Basic Testing

### Run Lambda function locally with default ACTIVE_CAMERAS
```bash
python3 run_lambda.py
```

### Run with a custom test event file
```bash
python3 run_lambda.py test_event.json
```

## Testing Different Camera Configurations

Edit `afctest/lambda_function.py` and change the `ACTIVE_CAMERAS` list, then run:

### Only Basketball Court (hoopcamera)
```python
ACTIVE_CAMERAS = ["hoopcamera"]
```
```bash
python3 run_lambda.py
```

### Basketball Court + Enter (no separate exit camera)
```python
ACTIVE_CAMERAS = ["hoopcamera", "enter"]
```
```bash
python3 run_lambda.py
```

### Floor 1 + Basketball Court (with separate exit)
```python
ACTIVE_CAMERAS = ["hoopcamera", "enter", "exit"]
```
```bash
python3 run_lambda.py
```

### Add Basement
```python
ACTIVE_CAMERAS = ["hoopcamera", "enter", "exit", "basement"]
```
```bash
python3 run_lambda.py
```

### Add Weightroom
```python
ACTIVE_CAMERAS = ["hoopcamera", "enter", "exit", "basement", "weightroom"]
```
```bash
python3 run_lambda.py
```

### Only Basement (independent tracking)
```python
ACTIVE_CAMERAS = ["basement"]
```
```bash
python3 run_lambda.py
```

### Only Weightroom (independent tracking)
```python
ACTIVE_CAMERAS = ["weightroom"]
```
```bash
python3 run_lambda.py
```

## View Test Data

### List all test data files
```bash
find test_data -name "*.json" -type f
```

### View specific test data
```bash
cat test_data/hoopcamera/2026-01-07_130000.json
cat test_data/enter/2026-01-07_120000.json
cat test_data/exit/2026-01-07_120000.json
cat test_data/basement/2026-01-07_120000.json
cat test_data/weightroom/2026-01-07_120000.json
```

### List files for a specific camera
```bash
ls -la test_data/hoopcamera/
ls -la test_data/enter/
ls -la test_data/exit/
ls -la test_data/basement/
ls -la test_data/weightroom/
```

## Modify Test Data

### Edit test data files (use any editor)
```bash
# Edit hoopcamera data
nano test_data/hoopcamera/2026-01-07_130000.json

# Edit enter data
nano test_data/enter/2026-01-07_120000.json

# Edit exit data
nano test_data/exit/2026-01-07_120000.json

# Edit basement data
nano test_data/basement/2026-01-07_120000.json

# Edit weightroom data
nano test_data/weightroom/2026-01-07_120000.json
```

### Create new test data files
```bash
# Create new hoopcamera file
echo '{"total_capacity": 15, "unique_count": 15, "timestamp": "2026-01-07T14:00:00Z"}' > test_data/hoopcamera/2026-01-07_140000.json

# Create new enter file
echo '{"in": 7, "out": 3, "timestamp": "2026-01-07T14:00:00Z"}' > test_data/enter/2026-01-07_140000.json
```

## Testing Scenarios

### Test with different dates
Create test files with today's date (use `date +%Y-%m-%d` to get current date):
```bash
# Check today's date
date +%Y-%m-%d

# Create files with today's date
echo '{"total_capacity": 10, "unique_count": 10, "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > test_data/hoopcamera/$(date +%Y-%m-%d)_140000.json
```

### Test multiple runs (to see capacity tracking over time)
```bash
# Run once
python3 run_lambda.py

# Modify test data, then run again to see how capacity changes
python3 run_lambda.py
```

## Deploy to AWS Lambda

### Deploy function code
```bash
./deploy_lambda.sh afctest us-east-2
```

### Deploy from specific directory
```bash
./deploy_lambda.sh afctest us-east-2 ./afctest
```

## Pull from AWS Lambda

### Pull latest code from Lambda
```bash
./pull_lambda.sh afctest us-east-2
```

## Virtual Environment

### Activate venv (if using one)
```bash
source .venv/bin/activate
```

### Deactivate venv
```bash
deactivate
```

### Install dependencies
```bash
pip install boto3 pymongo
```


