# WorkZen HRMS 🏢

> **Every workday, perfectly aligned.**

A production-grade Human Resource Management System with a **weighted performance scoring engine**, **configurable salary structures**, **real-time attendance tracking**, **AI-powered workforce insights**, and a **Neobrutalism UI**.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5/6-blue) ![Express](https://img.shields.io/badge/Express-4-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue) ![Prisma](https://img.shields.io/badge/Prisma-6-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan) ![Vite](https://img.shields.io/badge/Vite-8-yellow)

---

## 🧠 Core Workforce Flow

```
EMPLOYEE → SALARY CONFIGURATION → ATTENDANCE → TIME OFF
    ↓              ↓                    ↓           ↓
PAYABLE DAYS ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
    ↓
PERFORMANCE (weighted: Tasks 30% + Goals 25% + Rating 20% + Attendance 15% + Skills 10%)
    ↓
PAYROLL & BONUS RECOMMENDATION
```

Modules are **interconnected** — attendance affects payable days, unpaid leave reduces payable days, attendance consistency feeds into performance score, and performance rating drives bonus recommendations.

---

## ✨ Features

### 💰 Salary Engine
- Configurable salary components (Basic, HRA, Standard Allowance, Performance Bonus, LTA, Fixed Allowance)
- Calculation types: PERCENTAGE, FIXED_AMOUNT, REMAINDER
- Automatic yearly wage calculation
- Statutory deductions: Employee PF (12% of Basic), Employer PF, Professional Tax (₹200)
- Net salary estimation
- Validation: components cannot exceed monthly wage
- Indian Rupee formatting (₹1,20,000)

### 📊 Performance Scoring Engine
- **Weighted scoring model** with 5 measurable inputs
- **Explainable breakdown** — user sees exactly WHY they got their score
- Normalized inputs (0-100 scale) with division-by-zero protection
- Ratings: EXCEPTIONAL (90+), STRONG (75+), GOOD (60+), NEEDS_IMPROVEMENT (40+), CRITICAL (<40)
- Performance trend across review periods (Q1/Q2/Q3)
- Organization summary (avg score, top performer, needs attention count)
- **Performance bonus recommendation** based on rating multiplier

### ⏰ Attendance System
- Clock-in/out with automatic late detection (configurable grace period)
- Working hours calculation with break time deduction
- Extra hours tracking
- Status rules: PRESENT, LATE, HALF_DAY, ABSENT
- Monthly summary with attendance rate
- **Attendance consistency score** feeds into performance evaluation
- **Payable days calculation**: present + paid leave + (half days × 0.5)

### 🏖️ Time Off / Leave Management
- Leave types: Casual (12), Sick (10), Paid (15), Unpaid (unlimited)
- Overlap validation, balance checking, date validation
- Approval flow: PENDING → APPROVED/REJECTED (Admin/HR/Manager only)
- Duration calculation
- **Payroll connection**: approved paid leave = payable, unpaid = not payable

### 🔐 Centralized Permissions
- Permission-based access control (not just role checks)
- 13 granular permissions mapped to 4 roles
- Both frontend UI hiding AND backend authorization
- Salary info restricted to ADMIN/HR only (API-level enforcement)

### 🎨 Neobrutalism Design System
- Black background, white rounded content areas
- Pink sidebar with thick black borders and offset shadows
- Mulberry (#C54B8C) accent, uppercase bold typography
- Custom "W" logo component

---

## 👥 Role-Based Access Matrix

| Feature | Admin | HR | Manager | Employee |
|---------|:-----:|:--:|:-------:|:--------:|
| Dashboard (org stats) | ✅ | ✅ | ❌ | ❌ |
| Dashboard (personal) | ❌ | ❌ | ✅ | ✅ |
| Employee Management | ✅ | ✅ | ✅ (view) | ❌ |
| **Salary View/Edit** | ✅ | ✅ | ❌ | ❌ |
| **Payroll Management** | ✅ | ✅ | ❌ | ❌ |
| Payslip (own) | ✅ | ✅ | ✅ | ✅ |
| Attendance (all) | ✅ | ✅ | ✅ | ❌ |
| Attendance (own) | ✅ | ✅ | ✅ | ✅ |
| Leave Approve/Reject | ✅ | ✅ | ✅ | ❌ |
| Leave Apply | ✅ | ✅ | ✅ | ✅ |
| Performance (all) | ✅ | ✅ | ✅ | ❌ |
| Skills Matrix | ✅ | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ❌ | ❌ |
| AI Insights | ✅ | ✅ | ❌ | ❌ |
| CSV Export | ✅ | ✅ | ❌ | ❌ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Styling | Tailwind CSS 4, Neobrutalism Design System |
| Routing | React Router v7 |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express 4, TypeScript 5 |
| Database | PostgreSQL 16 |
| ORM | Prisma 6 |
| Auth | JWT (jsonwebtoken) + Firebase Admin (fallback) |
| AI | Google Gemini 2.5 Flash |
| Deployment | Vercel (static + serverless) |

---

## 🌐 Live Demo

**Production URL**: [https://workzen-hrms.vercel.app](https://workzen-hrms.vercel.app)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@workzen.com` | `admin123` |
| HR | `hr@workzen.com` | `admin123` |
| Employee | `priya.sharma@workzen.com` | `emp123` |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (local or [Neon](https://neon.tech) free tier)
- npm

### 1. Clone & Install

```bash
git clone https://github.com/xau-aman/Human-Resource-Management-System.git
cd Human-Resource-Management-System/workzen-hrms

# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Configure Environment

```bash
cd ../server
cp ../.env.example .env
# Edit .env with your PostgreSQL URL and API keys
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase admin service account |
| `FIREBASE_PRIVATE_KEY` | Firebase private key |

Client (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Database Setup

```bash
cd server
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### 4. Start Development

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

### 5. Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@workzen.com` | `admin123` |
| HR | `hr@workzen.com` | `admin123` |
| Employee | `priya.sharma@workzen.com` | `emp123` |

---

## 📁 Project Structure

```
workzen-hrms/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/ui/      # Design system (Button, Card, Badge, Table, Modal...)
│   │   ├── components/layout/  # AppLayout, Sidebar, Topbar
│   │   ├── pages/              # All page components
│   │   ├── services/           # API service layer (salary, performance, attendance...)
│   │   ├── utils/              # permissions.ts
│   │   ├── context/            # AuthContext (JWT)
│   │   ├── config/             # api.ts (fetch wrapper)
│   │   └── types/              # TypeScript interfaces
│   └── .env.production         # Production: VITE_API_URL=/api/v1
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── routes/             # salary, performance, attendance, leave, export, payslip...
│   │   ├── controllers/        # Request/response handlers
│   │   ├── services/           # Business logic (performance scoring, leave validation...)
│   │   ├── utils/              # salary.ts, performance.ts, attendance.ts, permissions.ts
│   │   ├── middleware/         # auth (JWT+Firebase), errorHandler, requestLogger
│   │   └── config/             # env, prisma, firebase
│   └── prisma/
│       ├── schema.prisma       # Full schema (18 models, 8 enums)
│       ├── seed.ts             # Comprehensive seed data
│       └── migrations/         # SQL migrations
│
├── api/index.ts                # Vercel serverless function (wraps Express)
├── vercel.json                 # Vercel deployment config
├── deploy.sh                   # Auto-deploy script (sets env vars + deploys)
├── docs/                       # Full documentation
│   ├── PERFORMANCE_SCORING.md  # Scoring weights, formula, ratings, bonus
│   ├── SALARY_CALCULATIONS.md  # Components, deductions, net salary
│   ├── ATTENDANCE_RULES.md     # Status rules, payable days, consistency
│   ├── TIME_OFF_POLICY.md      # Leave types, validation, approval flow
│   ├── ARCHITECTURE.md         # System architecture
│   ├── API_CONTRACTS.md        # All API endpoints
│   ├── DATABASE_SCHEMA.md      # Models, relations, enums
│   └── DEVELOPMENT_GUIDE.md    # Setup, workflow, conventions
└── package.json                # Root deps for Vercel serverless
```

---

## 🌐 API Endpoints

Base URL: `/api/v1`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login (returns JWT) |
| POST | `/auth/register` | Register new user |
| GET | `/auth/me` | Get current user |

### Employees
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/employees/departments` | List departments | All |
| GET | `/employees` | List employees | All |
| GET | `/employees/:id` | Get employee detail | All |
| POST | `/employees` | Create employee | Admin/HR |
| PUT | `/employees/:id` | Update employee | Admin/HR |
| DELETE | `/employees/:id` | Terminate employee | Admin/HR |

### Salary (Admin/HR only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees/:id/salary` | Get salary structure + breakdown |
| GET | `/employees/:id/salary/breakdown` | Get calculated breakdown |
| PUT | `/employees/:id/salary` | Update salary (auto-creates components) |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | All records |
| GET | `/attendance/me` | Own records |
| GET | `/attendance/summary` | Daily summary |
| POST | `/attendance/clock-in` | Clock in |
| POST | `/attendance/clock-out` | Clock out |

### Leave
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leaves` | All requests |
| GET | `/leaves/me` | Own requests |
| GET | `/leaves/balance` | Leave balance |
| POST | `/leaves` | Apply leave |
| PATCH | `/leaves/:id/approve` | Approve (Admin/HR/Manager) |
| PATCH | `/leaves/:id/reject` | Reject (Admin/HR/Manager) |

### Performance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/performance` | All reviews (with calculated scores) |
| GET | `/performance/summary` | Org summary (avg, top, needs attention) |
| GET | `/performance/trend` | Score trend over periods |
| GET | `/performance/top-performers` | Top N performers |
| GET | `/performance/employee/:id` | Employee review history |

### Export (CSV)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/export/employees` | Employees CSV |
| GET | `/export/attendance` | Attendance CSV |
| GET | `/export/leaves` | Leaves CSV |
| GET | `/export/performance` | Performance CSV |

### Payslip & AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payslip/me` | Own salary breakdown |
| GET | `/insights` | Workforce insights |
| POST | `/insights/ask` | Ask AI question |

---

## 🚢 Vercel Deployment

### One-Command Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

This script:
1. Reads env vars from `server/.env`
2. Pushes them to Vercel via CLI
3. Deploys to production

### Manual Steps

1. Create free PostgreSQL on [Neon](https://neon.tech)
2. Run migrations:
   ```bash
   DATABASE_URL="neon-url" npx prisma migrate deploy --schema=server/prisma/schema.prisma
   ```
3. Seed (optional):
   ```bash
   DATABASE_URL="neon-url" npx tsx server/prisma/seed.ts
   ```
4. Deploy:
   ```bash
   vercel --prod
   ```
5. Set env vars:
   ```bash
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   vercel env add GEMINI_API_KEY production
   ```

### Architecture on Vercel
- `client/` → Static build via `@vercel/static-build`
- `api/index.ts` → Serverless function via `@vercel/node`
- Routes: `/api/*` → serverless, `/*` → SPA

---

## 🗄️ Database Schema

### Key Models (18 total)

| Model | Purpose |
|-------|---------|
| User | Auth (email, passwordHash, role) |
| Employee | Core record (name, designation, salary, department) |
| Department | Org units (Engineering, Design, Marketing, HR) |
| SalaryStructure | Monthly/yearly wage, working config |
| SalaryComponent | Configurable salary parts (Basic, HRA, etc.) |
| Attendance | Daily records (checkIn, checkOut, workingMinutes, extraMinutes) |
| LeaveRequest | Leave applications (type, dates, status, duration) |
| LeaveBalance | Annual leave tracking per type |
| PerformanceReview | Reviews with all scoring fields + rating enum |
| Skill / EmployeeSkill | Skill catalog + proficiency levels |
| Project / ProjectAssignment | Project tracking |
| WorkforceInsight | AI-generated alerts |

### Enums (12)
UserRole, EmploymentStatus, AttendanceStatus, LeaveType, LeaveStatus, SkillLevel, InsightType, InsightSeverity, WageType, SalaryCalculationType, SalaryCalculationBase, PerformanceRating

---

## 📝 Seed Data

- **4 Departments** with descriptions
- **12 Employees** (Indian names, ₹70K–₹180K salaries)
- **12 Salary Structures** with 6 components each (72 salary component records)
- **~200 Attendance Records** (20 working days × 12 employees)
- **6 Leave Requests** (mix of types and statuses)
- **36 Performance Reviews** (3 quarters × 12 employees) for trend data
- **10 Skills** across 6 categories
- **1 Project** with 4 assignments
- **4 Workforce Insights**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PERFORMANCE_SCORING.md](docs/PERFORMANCE_SCORING.md) | Weights, formula, normalization, ratings, bonus |
| [SALARY_CALCULATIONS.md](docs/SALARY_CALCULATIONS.md) | Components, deductions, net salary, validation |
| [ATTENDANCE_RULES.md](docs/ATTENDANCE_RULES.md) | Status rules, working hours, payable days |
| [TIME_OFF_POLICY.md](docs/TIME_OFF_POLICY.md) | Leave types, balances, validation, approval |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, layers, deployment |
| [API_CONTRACTS.md](docs/API_CONTRACTS.md) | All endpoints with request/response examples |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Models, relations, enums, seed data |
| [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) | Setup, workflow, conventions, troubleshooting |

---

## 🔧 Commands Reference

```bash
# Development
cd server && npm run dev          # Start backend (port 5000)
cd client && npm run dev          # Start frontend (port 5173)

# Database
npx prisma generate               # Generate Prisma client
npx prisma migrate dev             # Run migrations
npx tsx prisma/seed.ts             # Seed database
npx prisma studio                  # Open DB GUI (port 5555)

# Build
cd client && npm run build         # Production build → dist/
cd server && npx tsc               # Compile TypeScript → dist/

# Deploy
./deploy.sh                        # Auto-deploy to Vercel
```

---

## 📄 License

MIT

---

Built with ❤️ by **Team Paradox**
