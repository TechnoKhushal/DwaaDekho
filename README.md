# DwaaDekho

DwaaDekho is an early-stage healthcare marketplace project intended to connect medicine seekers with pharmacies and support pharmacy, doctor, and administrative workflows. The repository contains frontend scaffolding and partial service code; it is **not currently a functioning or production-ready healthcare service**. See [the final readiness assessment](operations/final-production-readiness.md) before running or deploying it.

## Repository structure

- `frontend/` — Next.js App Router scaffold, shared UI, legacy Vite assets and client components.
- `backend/` — active TypeScript/Express read-only catalogue API, Prisma schema, and a local-only legacy fixture server (`legacy-server.cjs`). Additional service modules remain disconnected and are not included in the active API build.
- `architecture.md`, `flow.md`, `decisions.md`, `tasks.md` — target design, runtime notes, decisions and 100-task roadmap.
- `legal/`, `integrations/`, `security/`, `operations/` — review registers and audit reports.
- `.github/workflows/ci.yml` — pull request/push checks; workflow has not yet run on GitHub.
- `test-artifacts/` — browser evidence notes; the demo is verified in a local browser, but no screenshot file is committed.

## Technology and current runtime

The frontend uses Next.js 15.5, React, and Tailwind CSS 4. The homepage now calls the configured API for medicine catalogue searches and, after explicit browser location permission, nearby verified pharmacy listings. It does not fabricate catalogue entries, stores, prices, reservations, or medical workflows. The backend uses Express, TypeScript, Prisma 7 with PostgreSQL, and rate limiting. Its active API currently exposes health checks and read-only medicine and nearby-pharmacy endpoints. Authentication is not wired to protected active routes; orders, prescriptions, pharmacy inventory updates, doctor workflows, storage, realtime, payments, email, AI, and maps are not available in the deployed runtime. The local fixture server is not for deployment.

## Prerequisites and local setup

Use a supported Node.js/npm version compatible with the lockfiles. Install dependencies separately:

```powershell
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to the backend base URL (for local API development, `http://localhost:5000`).

In another terminal, run the TypeScript API (configure a valid local `DATABASE_URL` first):

```powershell
cd backend
npm install
npm run dev
```

The backend API requires a reachable PostgreSQL database. `/health/live` checks the process; `/health/ready` checks database connectivity. The repository's current local database credentials fail PostgreSQL authentication, so catalogue queries cannot be verified. The API build type-checks only the active entry point; older service modules are disconnected and remain uncompiled.

## Environment configuration

Copy `backend/.env.example` to an ignored local `backend/.env` only when developing locally. Its keys include database/Supabase, server, optional Brevo, Razorpay, OpenRouter, maps, Redis, and `ALLOWED_ORIGINS` settings. Do not commit secrets or put credentials in issues, logs, screenshots, or this README. Production secrets belong in the authorized deployment secret manager. Credentials that may have appeared in Git history should be rotated. No production values or provider approvals are supplied here.

## Database and integrations

Prisma schema validation passes after the missing `Prescription` model and relation fields were added. No migration files or verified test database were found. Do not run migrations against production. The configured database failed authentication during a read-only readiness check. Supabase Auth/Storage/Realtime, email, payments, AI, mapping, and jobs are not connected; consult `integrations/service-register.md` before enabling data flows.

## Checks and test evidence

From `frontend/`: `npm run type-check`, `npm run lint`, `npm run build`, `npm audit`.
From `backend/`: `npx tsc --noEmit`, `npx prisma validate`, `npm test`, `npm audit`.

As of 2026-11-16, frontend lint, type-check, and production build pass; backend active-entrypoint type-check/build, Prisma schema validation, and `npm test` (23 local regressions) pass. The updated home screen was browser-checked and displays no synthetic listings. Both package audits previously reported zero vulnerabilities. API tests use a stubbed database; the local database still has not passed a live readiness check. These checks do not cover real accounts, role/ownership access on protected routes, RLS, clinician/store validation, or end-to-end workflows. Detailed evidence and blockers are in `operations/` and `security/`.

## Vercel and Render setup

The repository includes a Render Blueprint in `render.yaml`. Before deploying, provision PostgreSQL and apply a reviewed schema migration; there are currently no migration files, so database setup is a blocker. In Render, configure `DATABASE_URL`, `DIRECT_URL`, and `ALLOWED_ORIGINS` with the exact Vercel production URL, including `https://`. After Render is live, set Vercel's `NEXT_PUBLIC_API_URL` to the Render API URL and redeploy. Verify `/health/live`, then `/health/ready` and a catalogue search. Supabase auth variables are not required by the current public read-only API; protected user workflows must not be launched until auth/RLS are implemented and verified.

These steps deploy the current partial API, not a complete marketplace. The schema has no migration history, the configured local database previously failed authentication, and production authentication, protected workflows, policies, monitoring, backups, legal review, and external verification remain release blockers. Do not accept real patient data, prescriptions, reservations, orders, or payments until those gates are completed and independently verified.

## Deployment and security

There is no verified CI/CD, staging deployment, production deployment, backup restore drill, or rollback rehearsal. The project is **not approved for public or production deployment**. Review [deployment guide](operations/deployment-guide.md), [security assessment](security/security-assessment.md), and [final production readiness](operations/final-production-readiness.md); resolve legal, security, technical, provider, and operational gates first.

## Contributions

Keep changes scoped to the intended package, preserve user work, add tests for implemented behavior, and document commands and limitations. Use concise imperative commit subjects (optionally `feat:`/`fix:`). Pull requests should explain user/API impact, link relevant tasks, include UI screenshots when a functioning page exists, and list verification results. See [AGENTS.md](AGENTS.md) for repository conventions.
