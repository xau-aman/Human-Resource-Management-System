# API Contracts

Base URL: `http://localhost:5000/api/v1`

All responses follow this format:
```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "timestamp": "2024-12-20T10:00:00.000Z"
}
```

---

## Health

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |

---

## Auth

| Endpoint | Method | Body | Description | Owner |
|----------|--------|------|-------------|-------|
| `/auth/login` | POST | `{ email, password }` | Login | CORE |
| `/auth/logout` | POST | — | Logout | CORE |

---

## Employees

| Endpoint | Method | Query Params | Description | Owner |
|----------|--------|-------------|-------------|-------|
| `/employees` | GET | `page, limit, department, status, search` | List employees | CORE |
| `/employees/:id` | GET | — | Get employee by ID | CORE |
| `/employees` | POST | — | Create employee | CORE |
| `/employees/:id` | PUT | — | Update employee | CORE |
| `/employees/:id` | DELETE | — | Soft delete employee | CORE |

**Employee Body:**
```json
{
  "firstName": "Arjun",
  "lastName": "Sharma",
  "email": "arjun@workzen.com",
  "phone": "+91 9812345678",
  "designation": "Software Engineer",
  "departmentId": "dept-id",
  "joiningDate": "2024-01-15"
}
```

---

## Attendance

| Endpoint | Method | Query Params | Description | Owner |
|----------|--------|-------------|-------------|-------|
| `/attendance` | GET | `date, employeeId` | Get attendance records | ATTENDANCE |
| `/attendance/summary` | GET | `date` | Get daily summary | ATTENDANCE |
| `/attendance` | POST | — | Record attendance | ATTENDANCE |

---

## Leave

| Endpoint | Method | Query Params | Description | Owner |
|----------|--------|-------------|-------------|-------|
| `/leaves` | GET | `status, employeeId` | Get leave requests | LEAVE |
| `/leaves` | POST | — | Submit leave request | LEAVE |
| `/leaves/:id/approve` | PATCH | — | Approve leave | LEAVE |
| `/leaves/:id/reject` | PATCH | — | Reject leave | LEAVE |

---

## Performance

| Endpoint | Method | Description | Owner |
|----------|--------|-------------|-------|
| `/performance` | GET | Get all reviews | PERFORMANCE |
| `/performance/:employeeId` | GET | Get employee review | PERFORMANCE |

---

## Skills

| Endpoint | Method | Description | Owner |
|----------|--------|-------------|-------|
| `/skills` | GET | Get all skills | SKILLS |
| `/skills/matrix` | GET | Get skills matrix | SKILLS |

---

## Analytics

| Endpoint | Method | Query Params | Description | Owner |
|----------|--------|-------------|-------------|-------|
| `/analytics/overview` | GET | — | Workforce overview | ANALYTICS |
| `/analytics/attendance-trend` | GET | `days` | Attendance trend | ANALYTICS |
| `/analytics/department-performance` | GET | — | Dept performance | ANALYTICS |

---

## AI Insights

| Endpoint | Method | Body | Description | Owner |
|----------|--------|------|-------------|-------|
| `/insights` | GET | — | Get active insights | AI-INSIGHTS |
| `/insights/ask` | POST | `{ question }` | Ask workforce question | AI-INSIGHTS |
