# Production Backend Configuration

This folder stores production-specific backend runtime configuration.

## Contents
- `.env.example`: production environment variables template
- `docker-compose.yml`: production compose definition

## Deploy Notes
- Use managed database instead of SQLite when moving to real production scale.
- Keep secrets in a secure secret manager.
- Run: `npm run prisma:deploy --workspace backend` during deployment.
- Start service: `docker compose up -d` from this folder.
