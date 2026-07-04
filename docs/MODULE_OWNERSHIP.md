# Module Ownership

## Project Overview

WorkZen HRMS is built as a modular monorepo. Each feature is self-contained with its own page, service, and backend route.

## Module Map

| Module | Frontend | Backend | Status |
|--------|----------|---------|--------|
| Auth | `pages/auth/LoginPage.tsx` | `routes/auth.routes.ts` | ✅ Complete |
| Dashboard | `pages/dashboard/DashboardPage.tsx` | Multiple services | ✅ Complete |
| Employees | `pages/employees/` (3 pages) | `routes/employee.routes.ts` | ✅ Complete |
| Attendance | `pages/attendance/AttendancePage.tsx` | `routes/attendance.routes.ts` | ✅ Complete |
| Leave | `pages/leave/LeavePage.tsx` | `routes/leave.routes.ts` | ✅ Complete |
| Performance | `pages/performance/PerformancePage.tsx` | `routes/performance.routes.ts` | ✅ Complete |
| Payslip | `pages/payslip/PayslipPage.tsx` | `routes/payslip.routes.ts` | ✅ Complete |
| Skills | `pages/skills/SkillsPage.tsx` | `routes/skills.routes.ts` | ✅ Complete |
| Analytics | `pages/analytics/AnalyticsPage.tsx` | `routes/analytics.routes.ts` | ✅ Complete |
| AI Insights | `pages/ai-insights/AIInsightsPage.tsx` | `routes/insights.routes.ts` | ✅ Complete |
| Settings | `pages/settings/SettingsPage.tsx` | — (client-only) | ✅ Complete |
| Export | Settings > Export tab | `routes/export.routes.ts` | ✅ Complete |

## File Ownership

### Shared / Core
| File | Purpose |
|------|---------|
| `client/src/components/ui/` | Design system components |
| `client/src/components/layout/` | AppLayout, Sidebar, Topbar |
| `client/src/context/AuthContext.tsx` | JWT auth state |
| `client/src/config/api.ts` | API fetch wrapper |
| `client/src/types/index.ts` | Shared TypeScript types |
| `client/src/index.css` | Neobrutalism design system |
| `client/src/App.tsx` | Route definitions |
| `server/src/index.ts` | Express app setup |
| `server/src/middleware/` | Auth, error handler, logger |
| `server/src/config/` | Env, Prisma, Firebase |
| `server/prisma/schema.prisma` | Database schema |

### Feature Modules
Each module follows the pattern:
```
Client:
  pages/<module>/Page.tsx     → UI component
  services/<module>.service.ts → API calls

Server:
  routes/<module>.routes.ts    → Route definitions
  controllers/<module>.controller.ts → Request handling
  services/<module>.service.ts → Business logic
```

## Adding a New Module

1. Create page in `client/src/pages/<module>/`
2. Create service in `client/src/services/<module>.service.ts`
3. Add route in `client/src/App.tsx`
4. Add sidebar nav item in `client/src/components/layout/Sidebar.tsx`
5. Create server route in `server/src/routes/<module>.routes.ts`
6. Create controller in `server/src/controllers/<module>.controller.ts`
7. Create service in `server/src/services/<module>.service.ts`
8. Register route in `server/src/index.ts`
9. Update types in `client/src/types/index.ts`

## Role-Based Navigation

Sidebar items are filtered by role:
```typescript
const allNavItems = [
  { to: '/', label: 'Dashboard', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { to: '/employees', label: 'Employees', roles: ['ADMIN', 'HR'] },
  { to: '/attendance', label: 'Attendance', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { to: '/leave', label: 'Leave', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { to: '/payslip', label: 'Payslip', roles: ['EMPLOYEE'] },
  { to: '/performance', label: 'Performance', roles: ['ADMIN', 'HR', 'MANAGER'] },
  { to: '/skills', label: 'Skills', roles: ['ADMIN', 'HR', 'MANAGER'] },
  { to: '/analytics', label: 'Analytics', roles: ['ADMIN', 'HR'] },
  { to: '/ai-insights', label: 'AI Insights', roles: ['ADMIN', 'HR'] },
  { to: '/settings', label: 'Settings', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
];
```
