# DwaaDekho — 100-Task Development Roadmap

**Project Name:** DwaaDekho  
**Project Objective:** A premium healthcare technology platform connecting patients with nearby pharmacies, enabling medicine discovery, generic substitution comparison, prescription verification, and telemedicine consultations — all while ensuring regulatory compliance, data security, and clinical safety.  
**Current Development Phase:** Phase 3 — Backend architecture, database, authentication, RBAC & RLS  
**Completed Task Count:** 30  
**Pending Task Count:** 70  
**Current Application Status:** Frontend foundation complete (Next.js 14 + TypeScript + Tailwind v4 + Radix UI), backend scaffold with Supabase + Prisma integration, database schema validated, authentication flow configured.  
**Last Updated Date:** 2026-11-10  

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
- [x] DD-017 — Build buyer application shell.
- [x] DD-018 — Build pharmacy and doctor application shells.
- [x] DD-019 — Build admin application shell and initial public website pages.
- [x] DD-020 — Verify responsive layouts, accessibility, metadata, page states and frontend code quality.

---

## Phase 3 — Backend foundation, database and authentication (DD-021 to DD-040)

- [x] DD-021 — Implement backend foundation and modular architecture.
- [x] DD-022 — Configure Supabase PostgreSQL and Prisma.
- [x] DD-023 — Design and implement the core relational database schema.
- [x] DD-024 — Implement authentication and account lifecycle management.
- [x] DD-025 — Implement RBAC and permission enforcement.
- [x] DD-026 — Enable RLS and implement verified database access policies.
- [x] DD-027 — Implement versioned API infrastructure and centralized error handling.
- [x] DD-028 — Implement input validation, rate limiting and baseline API security.
- [x] DD-029 — Configure private document storage, audit logging and environment management.
- [x] DD-030 — Connect frontend authentication and backend APIs; verify database and authorization functionality.
- [ ] DD-031 — Implement medicine catalogue with generic substitutes.
- [ ] DD-032 — Implement broadcast request system.
- [ ] DD-033 — Implement pharmacy and doctor onboarding.
- [ ] DD-034 — Implement order and reservation flows.
- [ ] DD-034 — Implement doctor consultation system.
- [ ] DD-035 — Implement payment integration (Razorpay).
- [ ] DD-036 — Implement email services.
- [ ] DD-037 — Implement monitoring and observability.
- [ ] DD-038 — Implement testing and quality gates.
- [ ] DD-039 — Implement compliance and regulatory safeguards.
- [ ] DD-040 — Prepare frontend-backend integration and testing.

---

## Phase 4 — Buyer medicine discovery, Rx validation and broadcasting (DD-041 to DD-060)

- [ ] DD-041 — Implement medicine search with full-text search (Supabase/PostgreSQL)
- [ ] DD-042 — Create generic substitute mapping service with price comparison
- [ ] DD-043 — Build medicine detail page with safety info, uses, side effects, dosage
- [ ] DD-044 — Implement prescription upload with file validation and OCR integration
- [ ] DD-045 — Create prescription validation service (regex patterns, AI-assisted)
- [ ] DD-046 — Implement broadcast request system (WebSocket/Supabase Realtime)
- [ ] DD-047 — Build pharmacy discovery with Google Maps integration and GPS
- [ ] DD-048 — Create radius selector (1km to 10km) with map visualization
- [ ] DD-049 — Implement offer comparison matrix (price, distance, completeness, rating)
- [ ] DD-050 — Build 45-minute stock reservation system with PIN generation
- [ ] DD-051 — Implement reservation PIN verification and expiry handling
- [ ] DD-052 — Create store pickup and local delivery request flows
- [ ] DD-053 — Implement verified pharmacy reviews with moderation
- [ ] DD-054 — Build Jan Aushadhi Kendra discovery with certification verification
- [ ] DD-055 — Implement medicine safety information display (CDSCO, schedule drugs)
- [ ] DD-056 — Create click-to-call and WhatsApp integration for verified pharmacies
- [ ] DD-057 — Build medicine inventory management for buyers (wishlist, favorites)
- [ ] DD-058 — Implement medicine comparison tool (side-by-side analysis)
- [ ] DD-059 — Create emergency medicine alert system with notification escalation
- [ ] DD-060 — Implement medicine recall notifications from regulatory sources

---

## Phase 5 — Buyer offer comparison, reservations and fulfilment (DD-061 to DD-080)

- [ ] DD-061 — Implement offer sorting by price, distance, completeness, rating
- [ ] DD-062 — Create real-time offer update system (WebSocket)
- [ ] DD-063 — Build offer acceptance flow with payment integration (Razorpay/Cashfree)
- [ ] DD-064 — Implement secure payment processing with PCI DSS compliance
- [ ] DD-065 — Create order lifecycle management (placed, confirmed, prepared, ready, delivered)
- [ ] DD-066 — Implement order tracking with real-time status updates
- [ ] DD-067 — Build delivery partner assignment and tracking system
- [ ] DD-068 — Implement order modification and cancellation policies
- [ ] DD-069 — Create refund and return management system
- [ ] DD-070 — Implement invoice generation and GST compliance
- [ ] DD-071 — Build prescription validity tracking and refill reminders
- [ ] DD-072 — Create medicine adherence tracking with pill reminders
- [ ] DD-073 — Implement loyalty program and discount coupons
- [ ] DD-074 — Build subscription model for chronic medication
- [ ] DD-075 — Implement price history tracking and trend analysis
- [ ] DD-077 — Implement allergy and contraindication alerts
- [ ] DD-078 — Build doctor consultation booking system
- [ ] DD-079 — Create insurance claim submission and tracking
- [ ] DD-080 — Implement grievance redressal mechanism

---

## Phase 6 — Pharmacy interface (DD-081 to DD-090)

- [ ] DD-081 — Implement pharmacy registration and onboarding flow
- [ ] DD-082 — Build drug license upload and verification (Form 20/21)
- [ ] DD-083 — Create pharmacist registration and NMC verification
- [ ] DD-084 — Implement KYC approval workflow with admin review
- [ ] DD-085 — Build real-time patient request inbox with notifications
- [ ] DD-086 — Implement audio and visual notification system
- [ ] DD-087 — Create stock management interface (Full, Partial, Out of Stock)
- [ ] DD-088 — Build price quotation system with markup controls
- [ ] DD-089 — Implement PIN verification and order completion flow
- [ ] DD-090 — Create pharmacy performance dashboard (analytics, revenue, ratings)

---

## Phase 7 — Doctor interface (DD-091 to DD-100)

- [ ] DD-091 — Implement doctor registration and NMC verification
- [ ] DD-092 — Build government ID upload and verification workflow
- [ ] DD-093 — Create patient consultation interface with secure chat
- [ ] DD-094 — Implement consent management and digital signatures
- [ ] DD-095 — Build clinical document sharing and symptom image upload
- [ ] DD-096 — Create clinic information management (address, hours, map)
- [ ] DD-097 — Implement appointment scheduling system
- [ ] DD-098 — Build electronic prescription generation and e-prescription standards
- [ ] DD-099 — Create doctor performance analytics and patient feedback
- [ ] DD-100 — Implement AI-assisted diagnosis support (decision support only, human-in-the-loop)

---

## Completion Criteria

- All 100 tasks must be completed before production deployment
- Each task must have a clear "done" definition (code + tests + documentation)
- No task marked complete without verification
- Security and compliance tasks must pass third-party audit
- All external integrations must have sandbox/test mode verification