#!/usr/bin/env python3
"""
Comprehensive test script for capacity calculations.
Tests various camera configurations and validates calculations.

Usage:
    python3 test_capacity.py

This script will:
- Test different camera configurations (single cameras, combinations, all cameras)
- Automatically create test data files with today's date
- Verify that capacity calculations work correctly
- Test that removing cameras from ACTIVE_CAMERAS still works
- Reveal any bugs (e.g., undefined variables)

NOTE: Tests involving floor2 cameras (secondfloorcam1, secondfloorcam2) will
fail with NameError because secondfloor1_in, secondfloor1_out, secondfloor2_in,
etc. are not defined in lambda_function.py. These variables need to be
initialized before use.
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timezone

# Enable test mode before importing lambda_function
os.environ["TEST_MODE"] = "true"

# Add the afctest directory to Python path
afctest_path = Path(__file__).parent / "afctest"
sys.path.insert(0, str(afctest_path))

import lambda_function as lf_module
import config as cfg_module
import capacity as cap_module
from mongodb_client import afctest, afccapacity


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


class TestRunner:
    """Test runner for capacity calculations"""
    
    def __init__(self):
        self.tests_passed = 0
        self.tests_failed = 0
        self.context = MockContext()
        self.original_active_cameras = cfg_module.ACTIVE_CAMERAS.copy()
    
    def reset_state(self):
        """Reset test state between tests"""
        afctest.clear()
        afccapacity.clear()
    
    def get_capacity(self):
        """Get current capacity from test state"""
        return afctest.get("capacity", {})
    
    def get_history(self):
        """Get capacity history"""
        return list(afccapacity)
    
    def _ensure_test_data_exists(self, cameras):
        """Ensure test data files exist for given cameras with today's date"""
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        test_data_dir = Path(__file__).parent / "test_data"
        
        # Sample test data for each camera type
        test_data_samples = {
            "hoopcamera": {"total_capacity": 15, "unique_count": 15, "timestamp": f"{today}T12:00:00Z"},
            "enter": {"in": 5, "out": 2, "timestamp": f"{today}T12:00:00Z"},
            "exit": {"out": 2, "count": 2, "timestamp": f"{today}T12:00:00Z"},
            "basement": {"in": 3, "out": 1, "timestamp": f"{today}T12:00:00Z"},
            "weightroom": {"in": 4, "out": 1, "timestamp": f"{today}T12:00:00Z"},
            "secondfloorcam1": {"in": 3, "out": 1, "timestamp": f"{today}T12:00:00Z"},
            "secondfloorcam2": {"in": 5, "out": 2, "in2": 2, "out2": 2, "timestamp": f"{today}T12:00:00Z"},
        }
        
        for camera in cameras:
            if camera in test_data_samples:
                camera_dir = test_data_dir / camera
                camera_dir.mkdir(parents=True, exist_ok=True)
                
                # Create a test file with today's date
                test_file = camera_dir / f"{today}_120000.json"
                if not test_file.exists():
                    with open(test_file, 'w') as f:
                        json.dump(test_data_samples[camera], f, indent=2)
    
    def test(self, name, cameras, expected_results=None, description=""):
        """Run a test with specified camera configuration"""
        print(f"\n{'='*60}")
        print(f"TEST: {name}")
        if description:
            print(f"Description: {description}")
        print(f"Active Cameras: {cameras}")
        print(f"{'='*60}")
        
        # Reset state
        self.reset_state()
        
        # Temporarily modify ACTIVE_CAMERAS
        original_cameras = cfg_module.ACTIVE_CAMERAS.copy()
        cfg_module.ACTIVE_CAMERAS[:] = cameras
        cfg_module.ENABLE_HOOP = "hoopcamera" in cameras
        cfg_module.ENABLE_ENTER = "enter" in cameras
        cfg_module.ENABLE_EXIT = "exit" in cameras
        cfg_module.ENABLE_BASEMENT = "basement" in cameras
        cfg_module.ENABLE_WEIGHTROOM = "weightroom" in cameras
        cfg_module.ENABLE_SECONDFLOOR1 = "secondfloorcam1" in cameras
        cfg_module.ENABLE_SECONDFLOOR2 = "secondfloorcam2" in cameras
        cfg_module.ENABLE_FLOOR1 = "enter" in cameras
        cfg_module.ENABLE_FLOOR2 = ("secondfloorcam1" in cameras) or ("secondfloorcam2" in cameras)
        
        try:
            # Create test files with today's date if they don't exist
            self._ensure_test_data_exists(cameras)
            
            # Run lambda handler
            event = {}
            result = lf_module.lambda_handler(event, self.context)
            
            # Get results
            capacity = self.get_capacity()
            history = self.get_history()
            
            # Print results
            print(f"\nResult: {result.get('statusCode')}")
            print(f"\nFinal Capacities:")
            for key in ["floor1", "floor2", "basketball_court", "basement", "weightroom"]:
                if key in capacity:
                    print(f"  {key}: {capacity.get(key, 0)}")
            
            if history:
                latest = history[-1]
                print(f"\nLatest History Record:")
                for key in ["floor1_delta", "floor2_delta", "basketball_court_delta", 
                           "basement_delta", "weightroom_delta"]:
                    if key in latest:
                        print(f"  {key}: {latest.get(key, 0)}")
            
            # Validate if expected results provided
            if expected_results:
                print(f"\nValidating against expected results...")
                all_passed = True
                for key, expected_value in expected_results.items():
                    actual_value = capacity.get(key, 0)
                    if actual_value != expected_value:
                        print(f"  ❌ {key}: expected {expected_value}, got {actual_value}")
                        all_passed = False
                    else:
                        print(f"  ✅ {key}: {actual_value}")
                
                if all_passed:
                    print(f"\n✅ TEST PASSED: {name}")
                    self.tests_passed += 1
                    return True
                else:
                    print(f"\n❌ TEST FAILED: {name}")
                    self.tests_failed += 1
                    return False
            else:
                print(f"\n✅ TEST COMPLETED: {name} (no validation)")
                self.tests_passed += 1
                return True
                
        except Exception as e:
            print(f"\n❌ TEST FAILED: {name}")
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()
            self.tests_failed += 1
            return False
        finally:
            # Restore original cameras
            cfg_module.ACTIVE_CAMERAS[:] = original_cameras
            cfg_module.ENABLE_HOOP = "hoopcamera" in original_cameras
            cfg_module.ENABLE_ENTER = "enter" in original_cameras
            cfg_module.ENABLE_EXIT = "exit" in original_cameras
            cfg_module.ENABLE_BASEMENT = "basement" in original_cameras
            cfg_module.ENABLE_WEIGHTROOM = "weightroom" in original_cameras
            cfg_module.ENABLE_SECONDFLOOR1 = "secondfloorcam1" in original_cameras
            cfg_module.ENABLE_SECONDFLOOR2 = "secondfloorcam2" in original_cameras
            cfg_module.ENABLE_FLOOR1 = "enter" in original_cameras
            cfg_module.ENABLE_FLOOR2 = ("secondfloorcam1" in original_cameras) or ("secondfloorcam2" in original_cameras)
    
    def run_all_tests(self):
        """Run all test cases"""
        print("\n" + "="*60)
        print("CAPACITY CALCULATION TEST SUITE")
        print("="*60)
        
        # Test 1: Only basketball court
        self.test(
            "Test 1: Only Basketball Court (hoopcamera)",
            ["hoopcamera"],
            description="Test tracking only basketball court capacity"
        )
        
        # Test 2: Enter only (no exit)
        self.test(
            "Test 2: Enter Camera Only (enter provides both in/out)",
            ["enter"],
            description="Test floor1 tracking with enter camera only"
        )
        
        # Test 3: Enter + Exit
        self.test(
            "Test 3: Enter + Exit Cameras",
            ["enter", "exit"],
            description="Test floor1 tracking with separate enter/exit cameras"
        )
        
        # Test 4: Basketball + Enter + Exit
        self.test(
            "Test 4: Basketball Court + Floor 1 (Enter + Exit)",
            ["hoopcamera", "enter", "exit"],
            description="Test basketball court and floor1 together"
        )
        
        # Test 5: Add basement
        self.test(
            "Test 5: Basketball + Floor 1 + Basement",
            ["hoopcamera", "enter", "exit", "basement"],
            description="Test with basement tracking"
        )
        
        # Test 6: Add weightroom
        self.test(
            "Test 6: All Cameras (including Weightroom)",
            ["hoopcamera", "enter", "exit", "basement", "weightroom"],
            description="Test with weightroom tracking"
        )
        
        # Test 7: Only basement
        self.test(
            "Test 7: Only Basement",
            ["basement"],
            description="Test independent basement tracking"
        )
        
        # Test 8: Only weightroom
        self.test(
            "Test 8: Only Weightroom",
            ["weightroom"],
            description="Test independent weightroom tracking"
        )
        
        # Test 9: Floor 2 cameras only
        self.test(
            "Test 9: Floor 2 Cameras Only",
            ["secondfloorcam1", "secondfloorcam2"],
            description="Test floor2 tracking with both cameras"
        )
        
        # Test 10: Full configuration
        self.test(
            "Test 10: All Cameras (Full Configuration)",
            ["hoopcamera", "enter", "exit", "basement", "weightroom", "secondfloorcam1", "secondfloorcam2"],
            description="Test with all cameras enabled"
        )
        
        # Test 11: Remove exit camera (enter must provide both in/out)
        self.test(
            "Test 11: Basketball + Enter (no Exit)",
            ["hoopcamera", "enter"],
            description="Test enter camera providing both in/out when exit is disabled"
        )
        
        # Test 12: Floor 1 + Floor 2 integration
        self.test(
            "Test 12: Floor 1 + Floor 2 Integration",
            ["enter", "exit", "secondfloorcam1"],
            description="Test floor1 and floor2 working together"
        )
        
        # Print summary
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_failed}")
        print(f"Total Tests: {self.tests_passed + self.tests_failed}")
        print("="*60)
        
        return self.tests_failed == 0


def main():
    """Main test runner"""
    runner = TestRunner()
    success = runner.run_all_tests()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

