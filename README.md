# Raseen Monorepo

This repository is now structured as a monorepo:

- `frontend/` React + TypeScript + Vite client
- `backend/` Node.js + Express + Prisma + SQLite API
- `production/backend/` production backend environment templates
- `staging/backend/` staging backend environment templates

## Quick Start

1. Install dependencies for all workspaces:

```bash
npm install
```

2. Configure backend environment:

```bash
cp backend/.env.example backend/.env
```

3. Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Seed admin account:

```bash
npm run seed
```

5. Run apps:

```bash
npm run dev:frontend
npm run dev:backend
```

## Backend Domains

- Auth (JWT)
- KYC workflow
- Listings lifecycle
- RFQ and responses
- Metrics overview
- Health checks
