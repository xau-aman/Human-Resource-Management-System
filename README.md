# WorkZen HRMS 🏢

> **Smarter People. Better Decisions.**

A full-stack Human Resource Management System with **Neobrutalism UI**, role-based access control, real-time attendance tracking, AI-powered workforce insights, and CSV data export.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Express](https://img.shields.io/badge/Express-4-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue) ![Prisma](https://img.shields.io/badge/Prisma-6-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

---

## ✨ Features

### 🎨 Neobrutalism Design System
- Black background with white rounded content areas
- Pink sidebar with thick black borders and offset shadows
- Mulberry (#C54B8C) accent color throughout
- Uppercase bold typography with wide tracking
- Custom "W" logo component

### 👥 Role-Based Access Control
| Feature | Admin | HR | Manager | Employee |
|---------|:-----:|:--:|:-------:|:--------:|
| Dashboard (full stats) | ✅ | ✅ | ❌ | ❌ |
| Dashboard (personal) | ❌ | ❌ | ✅ | ✅ |
| Employee Management | ✅ | ✅ | ❌ | ❌ |
| Attendance (all) | ✅ | ✅ | ✅ | ❌ |
| Attendance (own) | ✅ | ✅ | ✅ | ✅ |
| Leave Approve/Reject | ✅ | ✅ | ✅ | ❌ |
| Leave Apply | ✅ | ✅ | ✅ | ✅ |
| Performance Reviews | ✅ | ✅ | ✅ | ❌ |
| Skills Matrix | ✅ | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ❌ | ❌ |
| AI Insights | ✅ | ✅ | ❌ | ❌ |
| Payslip | ❌ | ❌ | ❌ | ✅ |
| CSV Export | ✅ | ✅ | ❌ | ❌ |
| Settings | ✅ | ✅ | ✅ | ✅ |

### 📊 Core Modules
- **Dashboard** — Role-based stats, charts, pending leaves, recent activity
- **Employees** — Full CRUD, search, filter by department/status
- **Attendance** — Clock-in/out, late detection (after 10am), daily summary
- **Leave Management** — Apply, approve/reject, balance tracking, validation
- **Performance** — Quarterly reviews, scoring algorithm, manager ratings
- **Skills Matrix** — Skill catalog, proficiency levels, gap analysis
- **Analytics** — Workforce overview, attendance trends, department performance
- **AI Insights** — Gemini-powered workforce analysis and Q&A
- **Payslip** — Salary breakdown (basic, HRA, DA, PF, tax deductions)
- **CSV Export** — Download employees, attendance, leaves, performance data
- **Settings** — Company info, notifications, security, data export

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
| Auth | JWT (jsonwebtoken) |
| AI | Google Gemini 2.5 Flash |
| Firebase | Admin SDK (optional token verification) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (local or hosted like [Neon](https://neon.tech))
- npm

### 1. Clone & Install

```bash
git clone https://github.com/xau-aman/Human-Resource-Management-System.git
cd Human-Resource-Management-System/workzen-hrms

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
# Server environment
cd ../server
cp ../.env.example .env
# Edit .env with your PostgreSQL URL and API keys
```

**Required environment variables:**
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/workzen_hrms` |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | `workzen-super-secret-jwt-key-32chars-min` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `hrms-3e302` |
| `FIREBASE_CLIENT_EMAIL` | Firebase admin email | `firebase-adminsdk-...` |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | `-----BEGIN PRIVATE KEY-----\n...` |

**Client environment** (`client/.env`):
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api/v1` |

### 3. Database Setup

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed with sample data (12 employees, 4 departments, attendance, leaves, etc.)
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
| Employee | `priya.patel@workzen.com` | `emp123` |
| Employee | `rahul.verma@workzen.com` | `emp123` |

---

## 📁 Project Structure

```
workzen-hrms/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Design system (Button, Card, Badge, etc.)
│   │   │   └── layout/        # AppLayout, Sidebar, Topbar
│   │   ├── pages/
│   │   │   ├── auth/          # LoginPage
│   │   │   ├── dashboard/     # DashboardPage (role-based)
│   │   │   ├── employees/     # List, Profile, Add
│   │   │   ├── attendance/    # Clock-in/out, history
│   │   │   ├── leave/         # Apply, approve/reject
│   │   │   ├── performance/   # Reviews, scores
│   │   │   ├── payslip/       # Salary breakdown
│   │   │   ├── skills/        # Skills matrix
│   │   │   ├── analytics/     # Charts, trends
│   │   │   ├── ai-insights/   # Gemini AI Q&A
│   │   │   └── settings/      # Config, export
│   │   ├── services/          # API service layer
│   │   ├── context/           # AuthContext (JWT)
│   │   ├── config/            # api.ts helper
│   │   ├── types/             # TypeScript interfaces
│   │   └── index.css          # Neobrutalism design system
│   ├── .env                   # Client env vars
│   └── .env.production        # Production env (VITE_API_URL=/api/v1)
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── routes/            # Express route definitions
│   │   ├── controllers/       # Request/response handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # auth, errorHandler, requestLogger
│   │   ├── config/            # env, prisma, firebase
│   │   ├── types/             # API response types
│   │   └── utils/             # AppError
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Sample data seeder
│   │   └── migrations/        # SQL migrations
│   └── .env                   # Server env vars
│
├── api/                       # Vercel serverless function
│   └── index.ts               # Express app wrapper
├── docs/                      # Documentation
├── vercel.json                # Vercel deployment config
├── deploy.sh                  # Auto-deploy script
└── package.json               # Root deps for Vercel
```

---

## 🌐 API Endpoints

Base URL: `/api/v1`

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Login with email/password | Public |

### Employees
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/employees` | List all employees | All roles |
| GET | `/employees/:id` | Get employee by ID | All roles |
| POST | `/employees` | Create employee | Admin, HR |
| PUT | `/employees/:id` | Update employee | Admin, HR |
| DELETE | `/employees/:id` | Soft delete (terminate) | Admin, HR |

### Attendance
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/attendance` | Get all attendance records | All roles |
| GET | `/attendance/me` | Get own attendance | All roles |
| GET | `/attendance/summary` | Daily summary stats | All roles |
| POST | `/attendance/clock-in` | Clock in | All roles |
| POST | `/attendance/clock-out` | Clock out | All roles |
| POST | `/attendance` | Create attendance record | All roles |

### Leave
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/leaves` | Get all leave requests | All roles |
| GET | `/leaves/me` | Get own leave requests | All roles |
| GET | `/leaves/balance` | Get leave balance | All roles |
| POST | `/leaves` | Apply for leave | All roles |
| PATCH | `/leaves/:id/approve` | Approve leave | Admin, HR, Manager |
| PATCH | `/leaves/:id/reject` | Reject leave | Admin, HR, Manager |

### Performance
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/performance` | Get all reviews | All roles |
| GET | `/performance/:employeeId` | Get employee reviews | All roles |

### Skills
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/skills` | Get all skills | All roles |
| GET | `/skills/matrix` | Get skills matrix | All roles |

### Analytics
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics/overview` | Workforce overview | All roles |
| GET | `/analytics/attendance-trend` | Attendance trend | All roles |
| GET | `/analytics/department-performance` | Department stats | All roles |

### AI Insights
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/insights` | Get active insights | All roles |
| POST | `/insights/ask` | Ask AI a question | All roles |

### Payslip
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payslip/me` | Get own salary breakdown | All roles |

### Export (CSV)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/export/employees` | Export employees CSV | Admin, HR |
| GET | `/export/attendance` | Export attendance CSV | Admin, HR |
| GET | `/export/leaves` | Export leaves CSV | Admin, HR |
| GET | `/export/performance` | Export performance CSV | Admin, HR |

---

## 🚢 Deployment (Vercel)

### Automatic Deployment

```bash
# Make sure you're logged into Vercel CLI
npm i -g vercel
vercel login

# Run the deploy script (sets env vars + deploys)
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

1. **Set up hosted PostgreSQL** (free tier):
   - [Neon](https://neon.tech) — recommended
   - [Supabase](https://supabase.com)
   
2. **Run migrations on production DB:**
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy --schema=server/prisma/schema.prisma
   ```

3. **Seed production DB (optional):**
   ```bash
   DATABASE_URL="your-production-url" npx tsx server/prisma/seed.ts
   ```

4. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

5. **Set environment variables on Vercel:**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   vercel env add GEMINI_API_KEY production
   vercel env add FIREBASE_PROJECT_ID production
   vercel env add FIREBASE_CLIENT_EMAIL production
   vercel env add FIREBASE_PRIVATE_KEY production
   ```

### Vercel Project Structure
- **Client** → Built as static site (Vite build → `client/dist/`)
- **Server** → Runs as serverless function (`api/index.ts`)
- **Routing** → `/api/*` → serverless function, `/*` → static SPA

---

## 🎨 Design System

### Neobrutalism Style
```css
/* Core classes */
.neo-card      → white bg, border-3 black, shadow-[6px_6px_0px_0px_rgba(0,0,0,1)], rounded-2xl
.btn-neo       → Mulberry bg, white text, rounded-full, uppercase, shadow offset
.btn-neo-secondary → white bg, black text, border-2 black
.input-neo     → white bg, border-2 black, rounded-xl, focus:shadow offset
.stat-neo      → stat card with icon, value, label
```

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Mulberry | `#C54B8C` | Primary accent, buttons, highlights |
| Lavender Pink | `#fce4ec` | Sidebar background, soft accents |
| Black | `#000000` | Borders, text, shadows |
| White | `#FFFFFF` | Content areas, cards |

### Typography
- Font: System default (bold, uppercase for headings)
- Tracking: `tracking-widest` for labels, `tracking-tight` for headings
- Weights: `font-black` (900) for headings, `font-bold` (700) for body

---

## 🗄️ Database Schema

### Models
| Model | Key Fields | Relations |
|-------|-----------|-----------|
| User | email, passwordHash, role | → Employee |
| Department | name, description | → Employees[] |
| Employee | employeeId, name, email, designation, salary | → Department, Manager, Attendance[], Leaves[] |
| Attendance | date, checkIn, checkOut, status, workingHours | → Employee |
| LeaveRequest | leaveType, startDate, endDate, status, reason | → Employee |
| LeaveBalance | casualUsed, sickUsed, paidUsed, unpaidUsed, year | → Employee |
| PerformanceReview | reviewPeriod, tasksCompleted, goalsAchieved, overallScore | → Employee |
| Skill | name, category | → EmployeeSkill[] |
| EmployeeSkill | level (BEGINNER→EXPERT) | → Employee, Skill |
| Project | name, startDate, status | → ProjectAssignment[] |
| WorkforceInsight | type, severity, title, description | — |

### Salary Breakdown (Payslip)
| Component | Calculation |
|-----------|-------------|
| Basic | 50% of gross |
| HRA | 20% of gross |
| DA | 10% of gross |
| Special Allowance | 20% of gross |
| PF (deduction) | 12% of basic |
| Income Tax (deduction) | 10% of gross |
| Professional Tax (deduction) | ₹200 fixed |

---

## 🔐 Authentication Flow

1. Client sends `POST /api/v1/auth/login` with `{ email, password }`
2. Server verifies password hash (bcrypt)
3. Server returns JWT token with `{ id, email, role, employeeId }`
4. Client stores token as `workzen_token` in localStorage
5. All subsequent requests include `Authorization: Bearer <token>`
6. Server middleware verifies JWT on every protected route
7. Fallback: Firebase token verification (if JWT fails)

---

## 📝 Seed Data

The seeder creates:
- **4 Departments**: Engineering, Design, Marketing, Human Resources
- **12 Employees** with realistic Indian names and salaries (₹70K–₹180K)
- **7 days** of attendance records (random present/late/absent)
- **4 leave requests** (mix of pending/approved)
- **12 performance reviews** (Q4 2024)
- **10 skills** across 6 categories
- **1 project** with 4 assignments
- **4 AI workforce insights**

---

## 📄 License

MIT

---

Built by Team Paradox
