# DwaaDekho — 100-Task Development Roadmap

**Project Name:** DwaaDekho  
**Project Objective:** A premium healthcare technology platform connecting patients with nearby pharmacies, enabling medicine discovery, generic substitution comparison, prescription verification, and telemedicine consultations — all while ensuring regulatory compliance, data security, and clinical safety.  
**Current Development Phase:** Phase 3 — Backend foundation, database and authentication (database credentials and operational workflows remain blocked)
**Completed Task Count:** 20
**Pending Task Count:** 80
**Current Application Status:** The Next.js home page has no synthetic records or demo workspaces. It queries the read-only medicine API and can request nearby verified pharmacies after explicit browser location permission. It does not support sign-in, ordering, pharmacy operations, doctor workflows, or administration. The API test suite uses stubs; live database readiness has not passed, and migrations/RLS are absent. External pharmacies/doctors were not involved in local checks and are not marked verified.
**Last Updated Date:** 2026-11-16

---  

## Phase 1 — Repository inspection, planning and architecture (DD-001 to DD-010)

- [x] DD-001 — Audit existing repository structure, file inventory, git history
- [x] DD-002 — Analyze current technology stack (Vite/React/Tailwind, Express, static JSON)
- [x] DD-003 — Identify missing database, authentication, migrations, tests, CI/CD
- [x] DD-004 — Scan for security risks (secrets, CORS, rate limiting, input validation, error handling)
- [x] DD-005 — Document regulatory and medical compliance requirements (CDSCO, DPDP, NMC, Drugs & Cosmetics Act)
- [x] DD-006 — Establish technical architecture: Next.js 14 (App Router) + TypeScript + Supabase PostgreSQL + Prisma ORM
- [x] DD-007 — Define modular folder structure and file organization conventions
- [x] DD-008 — Define API design conventions (REST/GraphQL), state management (Zustand/TanStack), error handling (centralized), logging (pino/winston)
- [x] DD-009 — Create `decisions.md` with architectural, security, and UI/UX decisions
- [x] DD-010 — Create `architecture.md` with system overview, ER model, high-level diagrams

---  

## Phase 2 — Frontend foundation, design system and application shell (DD-011 to DD-020)

- [x] DD-011 — Finalize original DawaaDekho brand identity and design direction.
- [x] DD-012 — Implement reusable theme tokens and colour system.
- [x] DD-013 — Implement typography, spacing and visual foundations.
- [x] DD-014 — Build reusable accessible UI component system.
- [x] DD-015 — Establish motion and interaction conventions.
- [x] DD-016 — Implement responsive global application shell and navigation.
- [ ] DD-017 — Build buyer application shell.
- [ ] DD-018 — Build pharmacy and doctor application shells.
- [ ] DD-019 — Build admin application shell and initial public website pages.
- [ ] DD-020 — Verify responsive layouts, accessibility, metadata, page states and frontend code quality.

---  

## Phase 3 — Backend foundation, database and authentication (DD-021 to DD-030)

- [ ] DD-021 — Implement backend foundation and modular architecture.
- [ ] DD-022 — Configure Supabase PostgreSQL and Prisma.
- [x] DD-023 — Design and implement the core relational database schema.
- [ ] DD-024 — Implement authentication and account lifecycle management.
- [ ] DD-025 — Implement RBAC and permission enforcement.
- [ ] DD-026 — Enable RLS and implement verified database access policies.
- [x] DD-027 — Implement versioned API infrastructure and centralized error handling.
- [x] DD-028 — Implement input validation, rate limiting and baseline API security.
- [ ] DD-029 — Configure private document storage, audit logging and environment management.
- [ ] DD-030 — Connect frontend authentication and backend APIs; verify database and authorization functionality.

---  

## Phase 4 — Buyer medicine discovery, Rx validation and broadcasting (DD-031 to DD-040)

- [ ] DD-031 — Implement dual brand and generic salt medicine search.
- [ ] DD-032 — Implement medicine detail pages, verified catalogue information and safety drawer.
- [ ] DD-033 — Implement server-side prescription requirement classification and conditional Rx gates.
- [ ] DD-034 — Implement secure private prescription upload and document access.
- [ ] DD-035 — Implement configurable regulatory quantity validation.
- [ ] DD-036 — Implement browser geolocation, manual location selection and 1–10 km radius slider.
- [ ] DD-037 — Implement nearby pharmacy discovery, geographic filtering and Jan Aushadhi source integration where verified.
- [ ] DD-038 — Implement actual buyer broadcast creation and backend validation.
- [ ] DD-039 — Implement eligible pharmacy recipient selection and broadcast delivery tracking.
- [ ] DD-040 — Implement buyer request confirmation and request management, then verify the complete workflow.

---  

## Phase 5 — Buyer offer comparison, reservations and fulfilment (DD-041 to DD-050)

- [ ] DD-041 — Implement authenticated pharmacy request delivery and real-time communication.
- [ ] DD-042 — Implement full-stock, partial-stock and out-of-stock responses.
- [ ] DD-043 — Implement pharmacy price quotes and offer modification.
- [ ] DD-044 — Implement live buyer offer comparison, sorting and filters.
- [ ] DD-045 — Implement verified click-to-call and WhatsApp contact unlocking.
- [ ] DD-046 — Implement atomic 45-minute reservation creation and reservation lifecycle.
- [ ] DD-047 — Implement secure four-digit PIN generation, storage, buyer display and validation.
- [ ] DD-048 — Implement order fulfilment, store pickup and eligible local delivery.
- [ ] DD-049 — Implement transactional notifications, countdown and automatic reservation expiration.
- [ ] DD-050 — Implement PIN-gated verified reviews and complete end-to-end marketplace testing.

---  

## Phase 6 — Pharmacy interface, KYC, licence verification, live request inbox and pharmacy operations (DD-051 to DD-060)

- [ ] DD-051 — Implement pharmacy registration, onboarding and complete business profile management.
- [ ] DD-052 — Implement secure Form 20/21 and applicable licence document submission.
- [ ] DD-053 — Implement pharmacist registration details and credential verification workflow.
- [ ] DD-054 — Implement pharmacy KYC status, correction, approval and backend activation restrictions.
- [ ] DD-055 — Build the pharmacy operational dashboard with real database-backed statistics.
- [ ] DD-056 — Implement authenticated real-time request inbox and browser audio notifications.
- [ ] DD-057 — Implement one-tap stock responses and complete price quotation integration.
- [ ] DD-058 — Implement reservation management, PIN validation and order fulfilment interface.
- [ ] DD-059 — Implement pharmacy staff management, notification preferences and PWA functionality.
- [ ] DD-060 — Implement verified pharmacy performance scorecard and run full pharmacy workflow testing.

---  

## Phase 7 — Doctor interface, NMC verification, secure triage chat, patient documents and clinic management (DD-061 to DD-070)

- [ ] DD-061 — Implement doctor registration, onboarding and professional profile management.
- [ ] DD-062 — Implement secure NMC registration submission and credential verification.
- [ ] DD-063 — Implement secure government identity document upload and verification workflow.
- [ ] DD-064 — Implement doctor account states and verified-account activation restrictions.
- [ ] DD-065 — Build the doctor operational dashboard and consultation request management.
- [ ] DD-066 — Implement informed consultation consent and secure consultation lifecycle.
- [ ] DD-067 — Implement authenticated real-time doctor-patient messaging.
- [ ] DD-068 — Implement secure medical document viewing and patient information access.
- [ ] DD-069 — Implement Share Clinic Info, clinic management and doctor availability.
- [ ] DD-070 — Implement consultation history, notifications, security controls and complete doctor-to-patient workflow testing.

---  

## Phase 8 — Admin interface (DD-071 to DD-080)

- [ ] DD-071 — Implement admin dashboard and user management.
- [ ] DD-072 — Implement pharmacy KYC review, decision tracking and required audit records.
- [ ] DD-073 — Implement doctor credential review and account activation controls.
- [ ] DD-074 — Implement medicine catalogue and brand/ingredient administration.
- [ ] DD-075 — Implement regulatory classification and quantity-rule administration with source provenance.
- [ ] DD-076 — Implement review moderation and verified-review controls.
- [ ] DD-077 — Implement dispute intake, assignment and resolution tracking.
- [ ] DD-078 — Implement administrative activity monitoring and audit-log access controls.
- [ ] DD-079 — Implement admin role provisioning and least-privilege permission management.
- [ ] DD-080 — Verify admin workflows, authorization boundaries and audit coverage.

---  

## Phase 9 — Integrations, security, legal compliance, SEO and accessibility (DD-081 to DD-090)

Prompt 9 audit registers are documented in `security/security-assessment.md`, `integrations/service-register.md`, `legal/`, and `operations/backup-recovery.md`. These documents record findings and requirements; they do not complete the implementation tasks below. DD-081–090 remain pending.

- [ ] DD-081 — Integrate transactional email behind a provider abstraction and verify delivery in test mode.
- [ ] DD-082 — Integrate payments only in sandbox mode and document transaction fees and webhook verification.
- [ ] DD-083 — Evaluate DigiLocker partner access and implement no simulated verification; retain manual KYC fallback.
- [ ] DD-084 — Review maps, AI and other external services for privacy, cost, limits and failure behavior.
- [ ] DD-085 — Complete threat modeling and security review of authentication, authorization and sensitive data paths.
- [ ] DD-086 — Verify private document storage, retention, access logging and deletion controls.
- [ ] DD-087 — Document regulatory sources and obtain qualified review for Indian healthcare, privacy and marketplace obligations.
- [ ] DD-088 — Implement public-page metadata, canonical URLs and search-engine indexing controls.
- [ ] DD-089 — Audit WCAG accessibility, keyboard flows, contrast and reduced-motion behavior; fix findings.
- [ ] DD-090 — Verify privacy notices, consent, emergency guidance and user-facing safety limitations.

---  

## Phase 10 — Testing, deployment and production readiness (DD-091 to DD-100)

- [ ] DD-091 — Add unit and integration tests for backend services, validation and error handling.
- [ ] DD-092 — Add API tests for authentication, role enforcement, ownership checks and IDOR rejection.
- [ ] DD-093 — Validate migrations, constraints, transactions and database connection isolation.
- [ ] DD-094 — Execute RLS tests for cross-user, cross-pharmacy, doctor and admin data boundaries.
- [ ] DD-095 — Test buyer, pharmacy, doctor and admin workflows in a real browser against configured services.
- [ ] DD-096 — Run frontend and backend type checks, lint, production builds and dependency review.
- [ ] DD-097 — Configure CI/CD, environment separation, health checks and production observability.
- [ ] DD-098 — Verify backups, recovery procedures, retention jobs and incident response contacts.
- [ ] DD-099 — Complete production deployment review, load testing and rollback rehearsal.
- [x] DD-100 — Complete launch readiness review; block release on unresolved critical security, clinical or compliance issues.

---  

## Phase 10 execution review — 2026-11-16

Final integration and release checks are recorded in `operations/final-integration-audit.md`, `operations/api-test-report.md`, `operations/database-integrity-report.md`, `operations/performance-report.md`, `operations/deployment-guide.md`, `operations/final-production-readiness.md`, `security/final-security-regression-report.md`, and `security/final-threat-review.md`. The repository contains 100 unique continuous task IDs; the current count is 20 checked and 80 pending. DD-100 is checked because the required no-go readiness assessment is complete. A newer local review checked DD-023 (schema validation), DD-027 (v1 API and centralized errors), and DD-028 (validation/rate limits/security headers). External provider/person checks were skipped; this does not pass or verify integration tasks. Operational workflows, database access, RLS, deployment, recovery and external verification remain incomplete. Do not treat checkboxes alone as proof of verification.
## Completion Criteria

- All 100 tasks must be completed before production deployment
- Each task must have a clear "done" definition (code + tests + documentation)
- No task marked complete without verification
- Security and compliance tasks must pass third-party audit
- All external integrations must have sandbox/test mode verification
