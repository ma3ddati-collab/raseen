# Staging Backend Configuration

This folder stores staging-specific backend runtime configuration.

## Contents
- `.env.example`: staging environment variables template
- `docker-compose.yml`: staging compose definition

## Deploy Notes
- Keep staging secrets isolated from production.
- Run migrations before smoke tests.
- Start service: `docker compose up -d` from this folder.
