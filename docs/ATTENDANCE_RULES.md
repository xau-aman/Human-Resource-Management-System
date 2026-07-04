# Attendance Rules

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| Work Start Time | 09:30 | Expected check-in time |
| Late Grace Period | 15 minutes | Grace after start time |
| Half Day Minimum | 4 hours | Minimum for half-day credit |
| Full Day Minimum | 8 hours | Minimum for full-day credit |
| Break Time | 60 minutes | Deducted from total time |

## Working Hours Calculation

```
workingMinutes = (checkOut - checkIn) - breakTimeMinutes
workingHours = workingMinutes / 60
extraMinutes = max(0, workingMinutes - (configuredHours × 60))
```

## Status Determination Rules

| Condition | Status |
|-----------|--------|
| No check-in record | ABSENT |
| Working hours < 4 hours | ABSENT |
| Working hours ≥ 4 but < 8 hours | HALF_DAY |
| Check-in after 09:45 (start + grace) | LATE |
| Full hours completed, on time | PRESENT |

## Attendance Consistency Score

Used in performance calculations:

```
For each record:
  PRESENT → 1.0 point
  LATE → 0.85 point
  HALF_DAY → 0.5 point
  ABSENT → 0 point

consistency = (totalPoints / totalRecords) × 100
```

## Payable Days Calculation

```
payableDays = presentDays + paidLeaveDays + (halfDays × 0.5)
```

- Unpaid leave: NOT payable
- Absent days: NOT payable
- Approved paid/sick leave: Payable
- Pending leave: NOT counted

## Monthly Summary

The system tracks per employee per month:
- Days Present
- Days Absent
- Days Late
- Days Half-Day
- Total Working Hours
- Total Extra Hours
- Attendance Rate (%)

## Role-Based Access

| Role | Access |
|------|--------|
| ADMIN | All employee attendance |
| HR | All employee attendance |
| MANAGER | Team attendance |
| EMPLOYEE | Own attendance only |
