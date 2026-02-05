# Test Case Analysis Report

## Summary
The tests **run successfully** but have **critical validation gaps**. The tests don't actually verify that calculations are correct - they only check that the code executes without errors.

## Issues Found

### 1. **No Expected Results Validation** ⚠️ CRITICAL
**Problem:** None of the 12 tests have `expected_results` parameter set, so they don't validate correctness.

**Impact:** Tests pass even if calculations are wrong.

**Example:**
```python
# Current (no validation):
self.test("Test 2: Enter Camera Only", ["enter"])

# Should be:
self.test(
    "Test 2: Enter Camera Only", 
    ["enter"],
    expected_results={"floor1": 3}  # 5 (in) - 2 (out) = 3
)
```

### 2. **Calculation Discrepancy in Test 2** 🐛 BUG
**Test:** Enter Camera Only (no exit camera)
- Test data: `{"in": 5, "out": 2}`
- **Expected floor1:** 3 (5 - 2 = 3, per line 236 logic)
- **Actual test output:** floor1 = 5

**Root Cause:** According to `capacity.py` line 236:
```python
floor1_net = (enter_in - exit_out) if ENABLE_EXIT else (enter_in - enter_out)
```
When `ENABLE_EXIT = False`, it should use `enter_in - enter_out = 5 - 2 = 3`.

**Status:** Needs investigation - either bug in implementation or test setup issue.

### 3. **Print Statement Mismatch** ⚠️
**Issue:** Test output shows `"Enter (in only): 5"` but this message is only printed when `ENABLE_EXIT = True` (line 109). When `ENABLE_EXIT = False`, it should print `"Enter cam (in/out): in=5, out=2"` (line 111).

**Suggests:** Test configuration might not be setting flags correctly, OR there's a logic bug.

### 4. **Missing Edge Case Tests** 📋
Tests don't cover:
- Negative capacity scenarios (should clamp to 0)
- Multiple runs with same data (should not double-count)
- Missing camera data scenarios
- Basketball court delta calculations (when count decreases)
- Floor 1 calculations with basketball court subtraction

### 5. **Test Data Issues** 📊
- Test data uses fixed dates that may not match "today"
- No validation that test data matches expected calculations
- Test 8 (Weightroom only) shows all capacities as 0 - needs verification

## Recommendations

### Immediate Actions:
1. **Add expected_results to all tests** - This is the most critical fix
2. **Investigate Test 2 calculation bug** - Why is floor1 = 5 instead of 3?
3. **Fix print statement logic** - Ensure correct messages are displayed

### Test Improvements:
1. Add validation for:
   - Basketball court: `expected_results={"basketball_court": 15}`
   - Enter only: `expected_results={"floor1": 3}` (if bug is fixed)
   - Enter + Exit: `expected_results={"floor1": 3}`
   - Basement: `expected_results={"basement": 2}` (3 in - 1 out = 2)
   - Floor 2: Verify calculations match expected values

2. Add edge case tests:
   - Negative capacity clamping
   - Duplicate processing prevention
   - Missing data handling

3. Verify test data matches calculations:
   - Test 2: enter `{"in": 5, "out": 2}` → floor1 should be 3
   - Test 3: enter `{"in": 5, "out": 2}`, exit `{"out": 2}` → floor1 should be 3
   - Test 7: basement `{"in": 3, "out": 1}` → basement should be 2

## Test Accuracy Assessment

| Test | Status | Issue |
|------|--------|-------|
| Test 1: Basketball only | ✅ Logic correct | ⚠️ No validation |
| Test 2: Enter only | 🐛 **BUG** | floor1 = 5, should be 3 |
| Test 3: Enter + Exit | ✅ Logic correct | ⚠️ No validation |
| Test 4: Basketball + Floor 1 | ⚠️ Needs verification | Complex calculation |
| Test 5-12 | ⚠️ Needs validation | No expected results |

## Conclusion
**Tests are NOT accurate** - they pass but don't validate correctness. The Test 2 discrepancy suggests there may be a bug in the implementation that the tests are not catching.

**Priority:** Add `expected_results` to all tests immediately to catch calculation errors.

