# API Contracts

Base URL: `/api/v1`

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "timestamp": "2024-12-20T10:00:00.000Z"
}
```

Paginated responses include:
```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "timestamp": "...",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "..."
}
```

## Authentication

All endpoints (except `/auth/login` and `/health`) require:
```
Authorization: Bearer <jwt_token>
```

---

## Health

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Server health check | No |

**Response:**
```json
{ "status": "ok", "timestamp": "...", "environment": "development" }
```

---

## Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login with email/password | No |

**Request Body:**
```json
{ "email": "admin@workzen.com", "password": "admin123" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "cuid",
      "email": "admin@workzen.com",
      "role": "ADMIN",
      "employee": {
        "id": "cuid",
        "firstName": "Arjun",
        "lastName": "Sharma",
        "employeeId": "WZ1001",
        "designation": "Engineering Manager",
        "department": { "name": "Engineering" }
      }
    }
  }
}
```

---

## Employees

| Method | Endpoint | Query Params | Description | Access |
|--------|----------|-------------|-------------|--------|
| GET | `/employees` | `page, limit, department, status, search` | List employees (paginated) | All roles |
| GET | `/employees/:id` | — | Get employee by ID (with skills, reviews) | All roles |
| POST | `/employees` | — | Create employee | Admin, HR |
| PUT | `/employees/:id` | — | Update employee | Admin, HR |
| DELETE | `/employees/:id` | — | Soft delete (set TERMINATED) | Admin, HR |

**Create/Update Body:**
```json
{
  "firstName": "Arjun",
  "lastName": "Sharma",
  "email": "arjun@workzen.com",
  "phone": "+91 9812345678",
  "designation": "Software Engineer",
  "departmentId": "dept-cuid",
  "joiningDate": "2024-01-15",
  "managerId": "emp-cuid"
}
```

**Employee Response:**
```json
{
  "id": "cuid",
  "employeeId": "WZ1001",
  "firstName": "Arjun",
  "lastName": "Sharma",
  "email": "arjun@workzen.com",
  "phone": "+91 9812345678",
  "designation": "Engineering Manager",
  "salary": 180000,
  "joiningDate": "2021-03-15T00:00:00.000Z",
  "employmentStatus": "ACTIVE",
  "department": { "id": "cuid", "name": "Engineering" },
  "manager": { "id": "cuid", "firstName": "...", "lastName": "..." }
}
```

---

## Attendance

| Method | Endpoint | Query Params | Description | Access |
|--------|----------|-------------|-------------|--------|
| GET | `/attendance` | `date, employeeId` | Get all attendance records | All roles |
| GET | `/attendance/me` | — | Get own attendance history | All roles |
| GET | `/attendance/summary` | `date` | Get daily summary (present/absent/late counts) | All roles |
| POST | `/attendance/clock-in` | — | Clock in (marks LATE if after 10am) | All roles |
| POST | `/attendance/clock-out` | — | Clock out (calculates working hours) | All roles |
| POST | `/attendance` | — | Create attendance record manually | All roles |

**Clock-in Response:**
```json
{
  "success": true,
  "message": "Clocked in successfully",
  "data": {
    "id": "cuid",
    "employeeId": "emp-cuid",
    "date": "2024-12-20",
    "checkIn": "2024-12-20T09:30:00.000Z",
    "status": "PRESENT"
  }
}
```

---

## Leave

| Method | Endpoint | Query Params | Description | Access |
|--------|----------|-------------|-------------|--------|
| GET | `/leaves` | `status, employeeId` | Get all leave requests | All roles |
| GET | `/leaves/me` | — | Get own leave requests | All roles |
| GET | `/leaves/balance` | — | Get own leave balance | All roles |
| POST | `/leaves` | — | Apply for leave | All roles |
| PATCH | `/leaves/:id/approve` | — | Approve leave request | Admin, HR, Manager |
| PATCH | `/leaves/:id/reject` | — | Reject leave request | Admin, HR, Manager |

**Apply Leave Body:**
```json
{
  "leaveType": "CASUAL",
  "startDate": "2024-12-23",
  "endDate": "2024-12-24",
  "reason": "Family function"
}
```

**Leave Balance Response:**
```json
{
  "data": {
    "casualUsed": 2,
    "sickUsed": 1,
    "paidUsed": 0,
    "unpaidUsed": 0,
    "year": 2024,
    "limits": { "casual": 12, "sick": 10, "paid": 15, "unpaid": null }
  }
}
```

---

## Performance

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/performance` | Get all performance reviews | All roles |
| GET | `/performance/:employeeId` | Get reviews for specific employee | All roles |

**Review Response:**
```json
{
  "id": "cuid",
  "employeeId": "emp-cuid",
  "employee": { "firstName": "Priya", "lastName": "Patel", "department": { "name": "Engineering" } },
  "reviewPeriod": "Q4 2024",
  "tasksCompleted": 28,
  "goalsAchieved": 4,
  "totalGoals": 5,
  "managerRating": 4.2,
  "overallScore": 82.4,
  "comments": "Good performance this quarter."
}
```

---

## Skills

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/skills` | Get all skills catalog | All roles |
| GET | `/skills/matrix` | Get employee-skill matrix | All roles |

---

## Analytics

| Method | Endpoint | Query Params | Description | Access |
|--------|----------|-------------|-------------|--------|
| GET | `/analytics/overview` | — | Workforce overview stats | All roles |
| GET | `/analytics/attendance-trend` | `days` | Attendance trend data | All roles |
| GET | `/analytics/department-performance` | — | Department-wise performance | All roles |

---

## AI Insights

| Method | Endpoint | Body | Description | Access |
|--------|----------|------|-------------|--------|
| GET | `/insights` | — | Get active workforce insights | All roles |
| POST | `/insights/ask` | `{ question }` | Ask AI about workforce | All roles |

**Ask Body:**
```json
{ "question": "Which department has the highest attrition risk?" }
```

**Response:**
```json
{
  "data": {
    "answer": "Based on attendance patterns...",
    "confidence": 0.85,
    "relatedInsights": [...]
  }
}
```

---

## Payslip

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payslip/me` | Get own salary breakdown | All roles |

**Response:**
```json
{
  "data": {
    "employee": {
      "id": "cuid",
      "employeeId": "WZ1002",
      "firstName": "Priya",
      "lastName": "Patel",
      "designation": "Senior Frontend Developer",
      "department": "Engineering",
      "joiningDate": "2021-07-01T00:00:00.000Z"
    },
    "salary": {
      "gross": 120000,
      "net": 101800,
      "basic": 60000,
      "hra": 24000,
      "da": 12000,
      "special": 24000,
      "deductions": {
        "pf": 7200,
        "tax": 12000,
        "professionalTax": 200,
        "total": 19400
      },
      "month": "July 2026"
    }
  }
}
```

---

## Export (CSV Download)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/export/employees` | Download employees CSV | Admin, HR |
| GET | `/export/attendance` | Download attendance CSV | Admin, HR |
| GET | `/export/leaves` | Download leaves CSV | Admin, HR |
| GET | `/export/performance` | Download performance CSV | Admin, HR |

**Response:** `Content-Type: text/csv` with `Content-Disposition: attachment`

**Employees CSV columns:** Employee ID, First Name, Last Name, Email, Phone, Department, Designation, Salary, Status, Joining Date

**Attendance CSV columns:** Employee ID, Name, Department, Date, Check In, Check Out, Working Hours, Status

**Leaves CSV columns:** Employee ID, Name, Department, Leave Type, Start Date, End Date, Reason, Status

**Performance CSV columns:** Employee ID, Name, Department, Review Period, Tasks Completed, Goals Achieved, Total Goals, Manager Rating, Overall Score
