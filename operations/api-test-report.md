# API Test Report

**Date:** 2026-11-16 · **Result:** 23 automated regression checks pass; database-backed workflows remain blocked.

## Executed checks

`npm test` in `backend/` builds the active TypeScript API and runs Node's test runner. **23 passed, 0 failed.**

- Active API: liveness response and request ID; invalid, repeated, and oversized search parameters rejected before database access; stubbed catalogue search/detail responses and not-found behavior; nearby pharmacy filters, verified-only query, deterministic Haversine sorting, and invalid location/filter rejection; generic database error response without leaking details; unknown route handling; unknown origin receives no CORS permission; production startup fails closed without database configuration.
- Unit checks: geospatial edge cases and radius validation; authorization uses server-managed role claims, and pharmacy/admin guards reject unauthorized roles.
- Legacy local-only API: filtered fixture response and response headers; unlisted origin receives no CORS grant; JSON body over 1 MB is rejected; production startup refuses the fixture API.
- `npm run type-check` and `npm run build` in `backend/`: passed for the active API entrypoint and imports.
- `node --check backend/legacy-server.cjs`: covered by the test load path; tests import and execute that CJS server.

A read-only `/health/ready` request returned not ready because PostgreSQL rejected authentication for the configured user. API tests stub database reads; no real catalogue/pharmacy result, database transaction, JWT signature, RLS policy, upload, webhook, reservation, payment, or end-to-end four-role workflow was tested. The test suite does not validate most disconnected `backend/src/services/` modules, which remain excluded from the active API build.

Live local API smoke check returned `/health/live` **200**, invalid `limit=51` **400**, and `/health/ready` **503**. The server process was stopped after the check.

**Outstanding:** provision a verified non-production database with valid credentials; complete migrations; implement auth and route-level ownership; add role/RLS and business-service unit tests; then test transactional concurrency, webhooks, storage, and failure handling in isolation. Do not point tests at production data.
