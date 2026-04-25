# Backend Service

Enterprise-ready backend bootstrap for Raseen using:
- Node.js + Express
- Prisma ORM
- SQLite (initially)
- JWT Auth
- KYC, Listings, RFQ, Metrics, Health APIs

## Quick Start

1. Copy env file:
   - `cp .env.example .env`
2. Install dependencies from repository root:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate --workspace backend`
4. Run initial migration:
   - `npm run prisma:migrate --workspace backend`
5. Seed admin account:
   - `npm run seed --workspace backend`
6. Start backend dev server:
   - `npm run dev:backend`

## Main Endpoints

- `GET /health`
- `GET /health/ready`
- `POST /auth/register`
- `POST /auth/login`
- `POST /kyc/submit` (auth)
- `GET /kyc/me` (auth)
- `PATCH /kyc/:id/review` (admin)
- `GET /listings`
- `GET /listings/:id`
- `POST /listings` (auth)
- `PATCH /listings/:id/status` (auth/owner/admin)
- `GET /rfq`
- `POST /rfq` (auth)
- `POST /rfq/:id/respond` (auth)
- `GET /metrics/overview` (admin)

## Operational Log

### 2026-04-16

- Hardened auth validation for `POST /auth/register` and `POST /auth/login` to avoid process crash on invalid payloads.
- Validation now returns `400 Bad Request` with structured JSON errors instead of throwing an unhandled exception.
- Added regression coverage in root `e2e-test.mjs` for invalid register payload:
   - expects `400`
   - verifies backend remains healthy via `/health`
- Hardened payload validation for KYC, Listings, and RFQ routes to return `400` JSON on invalid input instead of crashing process:
   - `POST /kyc/submit`
   - `PATCH /kyc/:id/review`
   - `POST /listings`
   - `PATCH /listings/:id/status`
   - `POST /rfq`
   - `POST /rfq/:id/respond`
- Final pre-onboarding verification executed successfully:
   - invalid payload checks returned `400` for KYC/Listings/RFQ
   - backend health remained `200` after failed validations
   - beta E2E flow passed (`13/13`)
   - metrics snapshot script completed successfully
- Beta path remains focused on: open registration, admin KYC review/approval, onboarding flow.
