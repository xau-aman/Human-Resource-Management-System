# Development Guide

## Getting Started

See [README.md](../README.md) for setup instructions.

## Development Workflow

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Working on Your Module

1. Find your module folder: `client/src/features/<your-module>/`
2. Find your page: `client/src/pages/<your-module>/`
3. Find your service: `client/src/services/<your-module>.service.ts`
4. Search for your TODOs: `grep -r "TODO[YOUR-TAG]" .`

### Replacing Mock Data with Real API

Each service file has a comment like:
```typescript
// TODO[CORE]: Replace mock implementations with real API calls
```

To connect to the real backend:
```typescript
// Replace this:
return mockEmployees;

// With this:
const res = await fetch('/api/v1/employees');
const json = await res.json();
return json.data;
```

The Vite dev server proxies `/api` to `http://localhost:5000` automatically.

## Code Conventions

- Use `import type` for TypeScript type-only imports
- Use `async/await` over `.then()` chains
- Keep components under 150 lines
- Extract reusable logic into hooks (`hooks/`)
- Use the shared UI components from `components/ui/`

## Adding a New Feature

1. Add types to `client/src/types/index.ts`
2. Add mock data to `client/src/data/`
3. Create service in `client/src/services/`
4. Create page in `client/src/pages/<module>/`
5. Add route in `client/src/App.tsx`
6. Add nav item in `client/src/components/layout/Sidebar.tsx`

## Database Changes

```bash
# Edit prisma/schema.prisma
# Then run:
cd server
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
```

## Building for Production

```bash
# Frontend
cd client && npm run build

# Backend
cd server && npm run build && npm start
```
