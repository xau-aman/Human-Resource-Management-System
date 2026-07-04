# WorkZen HRMS

> **Smarter People. Better Decisions.**

A modern Human Resource Management System built for team hackathon development. Modular, clean, and ready for parallel development.

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm

### Setup

**1. Clone the repository**
```bash
git clone <repo-url>
cd workzen-hrms
```

**2. Install client dependencies**
```bash
cd client && npm install
```

**3. Install server dependencies**
```bash
cd ../server && npm install
```

**4. Configure environment**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

**5. Generate Prisma client**
```bash
npm run prisma:generate
```

**6. Run database migrations**
```bash
npm run prisma:migrate
```

**7. Seed the database**
```bash
npm run prisma:seed
```

**8. Start the backend**
```bash
npm run dev
# Server runs on http://localhost:5000
```

**9. Start the frontend** (new terminal)
```bash
cd ../client && npm run dev
# App runs on http://localhost:5173
```

---

## Project Structure

```
workzen-hrms/
├── client/          # React + TypeScript + Vite frontend
├── server/          # Node.js + Express + TypeScript backend
└── docs/            # Architecture and team documentation
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |

## Team Module Ownership

See [docs/MODULE_OWNERSHIP.md](docs/MODULE_OWNERSHIP.md)

## API Documentation

See [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md)

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Skills Intelligence

The skills module now includes skill gap analysis, department coverage insights, and employee skill recommendations for better workforce planning.
