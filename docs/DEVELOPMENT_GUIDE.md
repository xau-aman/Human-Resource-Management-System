# Development Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local via Homebrew or hosted via Neon)
- npm

## Local Setup

### 1. Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Database Setup

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb workzen_hrms

# Generate Prisma client
cd server
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed sample data
npx tsx prisma/seed.ts
```

### 3. Environment Variables

**Server** (`server/.env`):
```env
DATABASE_URL="postgresql://youruser@localhost:5432/workzen_hrms"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=workzen-super-secret-jwt-key-32chars-min
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

### 5. Test Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@workzen.com | admin123 |
| HR | hr@workzen.com | admin123 |
| Employee | priya.patel@workzen.com | emp123 |

---

## Development Workflow

### Adding a New API Endpoint

1. Create/update service in `server/src/services/`
2. Create/update controller in `server/src/controllers/`
3. Add route in `server/src/routes/`
4. Register route in `server/src/index.ts`
5. Add client service function in `client/src/services/`
6. Update types in `client/src/types/index.ts`

### Adding a New Page

1. Create page component in `client/src/pages/<module>/`
2. Add route in `client/src/App.tsx`
3. Add nav item in `client/src/components/layout/Sidebar.tsx` (with role array)
4. Create service functions if needed

### Database Changes

```bash
cd server

# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name description_of_change

# 3. Update seed if needed
# 4. Re-seed (optional)
npx tsx prisma/seed.ts
```

### Using Prisma Studio (GUI)

```bash
cd server && npx prisma studio
# Opens at http://localhost:5555
```

---

## Code Conventions

### TypeScript
- Use `import type` for type-only imports
- Use `async/await` over `.then()` chains
- All API responses wrapped in `createResponse()` / `createPaginatedResponse()`
- Use `AppError` for throwing HTTP errors with status codes

### React
- Functional components only
- Use `clsx` for conditional classNames
- Keep pages under 200 lines
- Use shared UI components from `components/ui/`
- Role-based rendering via `useAuth().hasRole()`

### Styling (Neobrutalism)
- Use utility classes from `index.css`: `.neo-card`, `.btn-neo`, `.input-neo`
- Colors: Mulberry `#C54B8C`, Lavender Pink `#fce4ec`, Black, White
- Borders: `border-2` or `border-3` with `border-black`
- Shadows: `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`
- Rounded: `rounded-xl` for cards, `rounded-full` for buttons
- Text: `uppercase font-black tracking-widest` for labels

### API Service Pattern
```typescript
// client/src/services/example.service.ts
import { api } from '../config/api';

export async function getData(): Promise<DataType[]> {
  const res = await api.get<{ data: DataType[] }>('/endpoint');
  return res.data;
}
```

---

## Building for Production

### Client
```bash
cd client && npm run build
# Output: client/dist/
```

### Server
```bash
cd server && npm run build
# Output: server/dist/
# Run: node dist/index.js
```

---

## Deployment

See [README.md](../README.md#-deployment-vercel) for Vercel deployment instructions.

### Quick Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

This script:
1. Reads env vars from `server/.env`
2. Sets them on Vercel via CLI
3. Deploys to production

---

## Troubleshooting

### "Unexpected token '<'" Error
The API is returning HTML instead of JSON. Causes:
- Server not running → start with `npm run dev`
- Wrong API URL → check `VITE_API_URL` in `client/.env`
- Route not found → server returns JSON 404 now (fixed)

### Prisma Client Not Generated
```bash
cd server && npx prisma generate
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Check connection
psql -d workzen_hrms -c "SELECT 1"
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```
