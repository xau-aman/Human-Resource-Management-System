# Time Off Policy

## Leave Types & Balances

| Type | Annual Balance | Payable |
|------|---------------|---------|
| Casual Leave | 12 days | Yes |
| Sick Leave | 10 days | Yes |
| Paid Leave | 15 days | Yes |
| Unpaid Leave | Unlimited | No |

## Validation Rules

1. Start date must not be after end date
2. Employee must exist and be ACTIVE
3. Leave must not overlap existing APPROVED or PENDING leave
4. Paid/Casual/Sick leave requires sufficient balance
5. Unpaid leave has no balance requirement
6. Duration must be > 0 days

## Duration Calculation

```
duration = (endDate - startDate) / 86400000 + 1
```
Currently uses calendar days (including weekends).

## Approval Flow

```
PENDING → APPROVED (by ADMIN/HR/MANAGER)
PENDING → REJECTED (by ADMIN/HR/MANAGER)
```

- Only PENDING requests can be approved/rejected
- EMPLOYEE cannot approve their own leave
- Already approved/rejected requests cannot be modified

## Payroll Impact

| Leave Status | Leave Type | Payable? |
|--------------|-----------|----------|
| APPROVED | Casual | Yes |
| APPROVED | Sick | Yes |
| APPROVED | Paid | Yes |
| APPROVED | Unpaid | No |
| PENDING | Any | No |
| REJECTED | Any | No |

## Role Access

| Role | Can View | Can Apply | Can Approve |
|------|----------|-----------|-------------|
| ADMIN | All | Yes | Yes |
| HR | All | Yes | Yes |
| MANAGER | All | Yes | Yes |
| EMPLOYEE | Own only | Yes | No |
