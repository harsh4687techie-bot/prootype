# Portfolio Backend

Production-grade backend for personal portfolio website.

## Features

- Express.js MVC + Service Layer
- Rate limiting, request throttling
- Redis caching and queue via BullMQ
- JWT auth with refresh token rotation
- RBAC and API key protected admin endpoints
- Helmet, CORS, CSRF, XSS protection
- Prisma + PostgreSQL; DB indexing + pooling
- Health endpoint and graceful shutdown
- Docker + docker-compose + NGINX reverse proxy
- Prometheus-friendly health checks
- GitHub Actions CI pipeline

## Quickstart

1. Copy example env

```bash
cp .env.example .env
```

2. Start local services

```bash
docker compose up -d
```

3. Apply migrations

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start
```

4. API:
- `GET /api/v1/projects`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register` etc.

## Production notes

Use AWS/GCP with:
- ECS/Fargate or Kubernetes
- RDS PostgreSQL
- ElastiCache Redis
- Load balancer + auto-scaling
- WAF and CloudFront
- Secrets Manager or parameter store

