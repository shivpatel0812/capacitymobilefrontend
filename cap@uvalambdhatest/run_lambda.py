#!/usr/bin/env python3
"""Local test runner for Lambda function"""

import json
import os
import sys
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

os.environ["TEST_MODE"] = "true"

# Add the afctest directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "afctest"))

from lambda_function import lambda_handler

class MockContext:
    """Mock Lambda context object"""
    def __init__(self):
        self.function_name = "afctest"
        self.function_version = "$LATEST"
        self.invoked_function_arn = "arn:aws:lambda:us-east-2:273641666957:function:afctest"
        self.memory_limit_in_mb = 128
        self.aws_request_id = "test-request-id"
        self.log_group_name = "/aws/lambda/afctest"
        self.log_stream_name = "test-stream"
        self.remaining_time_in_millis = lambda: 30000

def main():
    """Run the Lambda function locally"""
    # Default empty event (for SQS-triggered functions, this would be SQS records)
    event = {}
    
    # If a test event file is provided, use it
    if len(sys.argv) > 1:
        event_file = sys.argv[1]
        with open(event_file, 'r') as f:
            event = json.load(f)
    else:
        # Create a simple test event
        event = {}
        print("Using empty event. Provide a JSON file as argument for custom event.")
        print("Example: python run_lambda.py test_event.json\n")
    
    context = MockContext()
    
    print("=" * 50)
    print("Running Lambda function locally [TEST MODE]...")
    print("=" * 50)
    print(f"Event: {json.dumps(event, indent=2)}")
    print("-" * 50)
    
    try:
        result = lambda_handler(event, context)
        print("\nResult:")
        print(json.dumps(result, indent=2))
        return 0
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())

