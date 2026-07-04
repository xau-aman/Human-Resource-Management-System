# Architecture

## Overview

WorkZen HRMS is a monorepo with a React frontend and Express backend, connected via REST API. Authentication is JWT-based, data is stored in PostgreSQL via Prisma ORM, and AI features use Google Gemini.

```
┌─────────────────────────────────────────────────────────────────┐
│                        WORKZEN HRMS                              │
│                                                                  │
│  ┌────────────────────┐         ┌─────────────────────────────┐ │
│  │  CLIENT (React 19) │         │   SERVER (Express 4)        │ │
│  │                    │         │                             │ │
│  │  pages/            │         │  routes/ → controllers/     │ │
│  │  ├─ dashboard      │         │  → services/ → Prisma      │ │
│  │  ├─ employees      │  HTTP   │                             │ │
│  │  ├─ attendance     │◄───────►│  middleware/                │ │
│  │  ├─ leave          │  JWT    │  ├─ auth (JWT + Firebase)   │ │
│  │  ├─ performance    │         │  ├─ errorHandler            │ │
│  │  ├─ payslip        │         │  └─ requestLogger           │ │
│  │  ├─ skills         │         │                             │ │
│  │  ├─ analytics      │         │  ┌───────────────────┐      │ │
│  │  ├─ ai-insights    │         │  │   Prisma ORM      │      │ │
│  │  └─ settings       │         │  └────────┬──────────┘      │ │
│  │                    │         │           │                 │ │
│  │  context/          │         │  ┌────────▼──────────┐      │ │
│  │  └─ AuthContext    │         │  │   PostgreSQL 16   │      │ │
│  │                    │         │  └───────────────────┘      │ │
│  │  services/         │         │                             │ │
│  │  └─ Real API calls │         │  ┌───────────────────┐      │ │
│  │                    │         │  │  Google Gemini AI  │      │ │
│  │  components/       │         │  └───────────────────┘      │ │
│  │  ├─ ui/ (design)   │         │                             │ │
│  │  └─ layout/        │         │                             │ │
│  └────────────────────┘         └─────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  VERCEL DEPLOYMENT                                        │    │
│  │  client/ → Static Build (Vite)                           │    │
│  │  api/    → Serverless Function (@vercel/node)            │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

- **React 19 + TypeScript 6 + Vite 8** — Fast HMR and builds
- **React Router v7** — Client-side routing with nested layouts
- **Tailwind CSS 4** — Utility-first with custom neobrutalism classes
- **Recharts** — Data visualization (bar, line, pie charts)
- **Context API** — Auth state management (JWT)
- **Lucide React** — Icon library

### Layer Structure
```
pages/              → Route-level components (one per page)
components/ui/      → Reusable design system (Button, Card, Badge, Table, etc.)
components/layout/  → AppLayout, Sidebar, Topbar
services/           → API abstraction layer (real API calls)
context/            → AuthContext (JWT auth, role management)
config/             → api.ts (fetch wrapper with auto-auth)
types/              → Shared TypeScript interfaces
index.css           → Neobrutalism design system classes
```

### Service Layer Pattern
All data access goes through service files that call the real API:

```typescript
import { api } from '../config/api';

export async function getEmployees(): Promise<Employee[]> {
  const res = await api.get<{ data: Employee[] }>('/employees');
  return res.data;
}
```

The `api` helper automatically:
- Prepends the base URL (`VITE_API_URL`)
- Attaches JWT token from localStorage
- Parses JSON response
- Throws on non-OK responses with server error message

## Backend Architecture

- **Express 4 + TypeScript 5** — REST API server
- **Prisma 6** — Type-safe database access with PostgreSQL
- **JWT** — Stateless authentication
- **Firebase Admin** — Optional token verification fallback
- **Google Gemini** — AI-powered workforce insights

### Layer Structure
```
routes/         → HTTP route definitions + middleware binding
controllers/    → Request parsing, response formatting
services/       → Business logic, validation, calculations
middleware/     → auth (JWT/Firebase), errorHandler, requestLogger
config/         → env, prisma, firebase
types/          → API response wrapper types
utils/          → AppError class
```

### Request Flow
```
HTTP Request
  → CORS check
  → JSON body parser
  → Request logger
  → Route matcher
  → Auth middleware (JWT verify → role check)
  → Controller (parse req, call service)
  → Service (business logic, Prisma queries)
  → Response wrapper (createResponse/createPaginatedResponse)
  → JSON Response
```

### Error Handling
All errors return consistent JSON:
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2024-12-20T10:00:00.000Z"
}
```

## Authentication Architecture

### JWT Flow
1. `POST /api/v1/auth/login` → verify bcrypt hash → sign JWT
2. JWT payload: `{ id, email, role, employeeId }`
3. Client stores as `workzen_token` in localStorage
4. Every request: `Authorization: Bearer <token>`
5. Middleware: verify JWT → attach `req.user` → check role

### Role Middleware
```typescript
export const onlyAdmin = authorize('ADMIN');
export const adminOrHR = authorize('ADMIN', 'HR');
export const adminHROrManager = authorize('ADMIN', 'HR', 'MANAGER');
export const allRoles = authorize('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE');
```

### Fallback: Firebase Token
If JWT verification fails, the middleware tries Firebase Admin token verification as fallback.

## Deployment Architecture (Vercel)

```
vercel.json
├── builds:
│   ├── client/package.json → @vercel/static-build → client/dist/
│   └── api/index.ts → @vercel/node → serverless function
├── routes:
│   ├── /api/* → api/index.ts (Express app)
│   └── /* → client/dist/ (SPA with fallback to index.html)
```

The `api/index.ts` file imports the entire Express app and exports it as a Vercel serverless function. All server dependencies are in the root `package.json`.

## AI Integration

The AI Insights module uses Google Gemini 2.5 Flash:
```
POST /api/v1/insights/ask { question }
  → Build context from DB (employees, attendance, performance)
  → Send to Gemini with system prompt
  → Return structured response
```

Insights are also auto-generated and stored in `WorkforceInsight` table for dashboard display.
