# Architecture

## Overview

WorkZen HRMS is a monorepo with a React frontend and Express backend, connected via REST API.

```
┌─────────────────────────────────────────────────────────┐
│                    WORKZEN HRMS                         │
│                                                         │
│  ┌──────────────────┐      ┌──────────────────────────┐ │
│  │   CLIENT (React) │      │   SERVER (Express)       │ │
│  │                  │      │                          │ │
│  │  pages/          │      │  routes/                 │ │
│  │  ├─ dashboard    │      │  controllers/            │ │
│  │  ├─ employees    │ HTTP │  services/               │ │
│  │  ├─ attendance   │◄────►│  repositories/           │ │
│  │  ├─ leave        │      │                          │ │
│  │  ├─ performance  │      │  ┌──────────────────┐    │ │
│  │  ├─ skills       │      │  │   Prisma ORM     │    │ │
│  │  ├─ analytics    │      │  └────────┬─────────┘    │ │
│  │  └─ ai-insights  │      │           │              │ │
│  │                  │      │  ┌────────▼─────────┐    │ │
│  │  services/       │      │  │   PostgreSQL     │    │ │
│  │  (mock → API)    │      │  └──────────────────┘    │ │
│  └──────────────────┘      └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

- **React + TypeScript + Vite** — Fast development and build
- **React Router v6** — Client-side routing with nested layouts
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Data visualization
- **Context API** — Auth state management

### Layer Structure
```
pages/          → Route-level components (one per page)
features/       → Feature-specific components and logic
components/ui/  → Reusable design system components
services/       → API abstraction layer (mock → real)
data/           → Mock data for development
types/          → Shared TypeScript interfaces
context/        → React context providers
```

### Service Layer Pattern
All data access goes through service files. Services currently use mock data but are designed to be swapped for real API calls:

```typescript
// Current (mock)
export async function getEmployees() {
  return mockEmployees;
}

// Future (real API)
export async function getEmployees() {
  const res = await fetch('/api/v1/employees');
  return res.json();
}
```

## Backend Architecture

- **Express + TypeScript** — REST API server
- **Prisma ORM** — Type-safe database access
- **PostgreSQL** — Relational database

### Layer Structure
```
routes/         → HTTP route definitions
controllers/    → Request/response handling
services/       → Business logic
repositories/   → (future) Data access abstraction
middleware/     → Auth, logging, error handling
```

### Request Flow
```
HTTP Request
    → Route
    → Middleware (auth, logging)
    → Controller
    → Service
    → Prisma
    → PostgreSQL
    → Response
```

## Authentication Architecture

Currently uses mock authentication for hackathon development. The auth system is isolated in:
- `context/AuthContext.tsx` — Frontend auth state
- `middleware/auth.middleware.ts` — Backend auth middleware

To replace with real JWT auth:
1. Update `AuthContext.tsx` login function to call `/api/v1/auth/login`
2. Update `auth.middleware.ts` to verify real JWT tokens
3. No other files need to change

## Module Isolation

Each feature module is self-contained:
```
features/attendance/
├── components/    → Attendance-specific UI
├── hooks/         → Attendance-specific hooks
└── index.ts       → Barrel export
```

Modules communicate only through:
- Shared `types/` interfaces
- Shared `services/` functions
- Shared `components/ui/` components

## Future AI Integration

The AI Insights module is architected for future ML integration:
```
ai-insights.service.ts
└── askWorkforceQuestion(question)
    → Currently: keyword matching on mock data
    → Future: LLM API call (OpenAI, Bedrock, etc.)
```

The `WorkforceInsight` interface is designed to be populated by:
- Rule-based alerts (current)
- ML anomaly detection (future)
- LLM analysis (future)
