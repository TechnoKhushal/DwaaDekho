# DwaaDekho — Architectural and Technical Decisions

---

## Decision DD-DEC-001: Technology Stack Selection
**Date:** 2026-11-09
**Decision:** Use Next.js 14 (App Router) + TypeScript + Tailwind CSS for frontend, Node.js + Express + TypeScript for backend, Supabase PostgreSQL + Prisma ORM for database.
**Problem being solved:** Need a modern, scalable, type-safe full-stack architecture with good developer experience and production-ready features.
**Options considered:**
1. **React + Vite + Express** (current prototype) — Fast prototyping but lacks SSR, routing, file-based conventions
2. **Next.js 13 Pages Router + TypeScript** — Stable but older routing model, less efficient than App Router
3. **Next.js 14 App Router + TypeScript** — Server Components, Streaming, Parallel Routes, Route Groups, Server Actions
4. **NestJS + Prisma** — Opinionated, boilerplate-heavy, less flexible for custom middleware
5. **Express + TypeScript** — Familiar, minimal, but no built-in routing or validation
6. **MongoDB** — NoSQL, schema-flexible but no ACID transactions, poor for relational healthcare data
7. **PostgreSQL** — ACID compliant, relational, JSONB support, extensions (PostGIS, Full-text search)
8. **Supabase** — PostgreSQL + Auth + Realtime + Storage + Edge Functions, managed, free tier
9. **PlanetScale** — MySQL, serverless, branching, but less mature ecosystem for healthcare
10. **Supabase + Prisma** — Type-safe ORM with Supabase-specific optimizations
**Selected solution:** Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase PostgreSQL + Prisma ORM
**Reason for choosing it:**
- Next.js 14 App Router provides Server Components (zero-JS by default), Streaming SSR, and Parallel Routes for complex layouts
- TypeScript ensures type safety across frontend and backend
- Tailwind CSS enables rapid UI development with design system consistency
- Supabase provides managed PostgreSQL with Auth, Realtime, Storage, Edge Functions — reduces DevOps overhead
- Prisma ORM provides type-safe database access with migrations, validations, and connection pooling
- All tools have excellent documentation, community, and production readiness
**Advantages:**
- End-to-end type safety with Prisma-generated types
- Server Components reduce bundle size and improve performance
- Supabase Auth handles email/password, social, magic link, OTP
- Supabase Realtime enables live updates for offers, orders, notifications
- Supabase Storage for document uploads (prescriptions, licenses, IDs)
- Prisma migrations are version-controlled and reproducible
- Vercel integration for Next.js, Render for Node.js
**Disadvantages and trade-offs:**
- Next.js 14 App Router is newer, fewer tutorials available
- Supabase pricing scales with usage (but free tier generous)
- Prisma learning curve for complex queries
- Vercel edge functions have cold starts (mitigated by keeping backend on Render)
**Security implications:**
- Supabase Auth uses JWT with row-level security (RLS) policies
- Prisma prevents SQL injection via parameterized queries
- Next.js middleware enables authentication checks before page load
**Scalability implications:**
- Supabase scales vertically (upgrade plan) or horizontally (read replicas)
- Next.js CDN caching reduces origin load
- Prisma connection pooling via Supabase pooler
**Files affected:**
- `package.json` (root and frontend/backend)
- `next.config.js`
- `tsconfig.json`
- `prisma/schema.prisma`
- `supabase/` migration files
**Verification method:**
- Build and deploy to preview environments
- TypeScript type checking passes
- Unit and integration tests pass
- Security audit passes
**Status:** ✅ Implemented (pending actual setup in Phase 3)

---

## Decision DD-DEC-002: State Management Strategy
**Date:** 2026-11-09
**Decision:** Use TanStack Query (React Query) for server state and Zustand for client state.
**Problem being solved:** Need efficient data fetching, caching, invalidation, and offline support.
**Options considered:**
1. **Redux Toolkit** — Verbose, boilerplate, overkill for most cases
2. **Zustand** — Minimal, easy, but no built-in caching/invalidation
3. **TanStack Query** — Excellent caching, background refetching, pagination, infinite scroll, mutations
4. **React Query + Zustand** — Combination of both
5. **React Context + useReducer** — Manual caching, no background updates
**Selected solution:** TanStack Query for server state, Zustand for client state (UI state, auth state, modal state)
**Reason for choosing it:**
- TanStack Query handles stale-while-revalidate, background updates, deduplication, mutation rollback
- Zustand is lightweight for UI state (modal open/close, sidebar, notifications)
- Separation of concerns: server state vs client state
**Advantages:**
- Automatic cache invalidation on mutations
- Optimistic updates for better UX
- Background refetching on window focus
- Pagination and infinite scroll helpers
- Devtools integration
**Disadvantages and trade-offs:**
- Bundle size (~10KB gzipped)
- Learning curve for query keys and invalidation
**Security implications:** None
**Scalability implications:** Reduces API calls through caching
**Files affected:**
- `src/lib/query-client.ts`
- `src/lib/store.ts`
- `src/components/**/*.tsx`
**Verification method:**
- Test caching behavior in devtools
- Verify background refetch on window focus
- Test optimistic update rollback
**Status:** ⏳ Pending implementation (Phase 2)

---

## Decision DD-DEC-003: Authentication Strategy
**Date:** 2026-11-09
**Decision:** Use Supabase Auth with custom JWT validation middleware on backend.
**Problem being solved:** Secure authentication across frontend and backend with role-based access control.
**Options considered:**
1. **JWT with custom secret** — Manual implementation, error-prone
2. **Auth0** — Enterprise features, expensive, vendor lock-in
3. **Clerk** — Good DX, expensive at scale
4. **Supabase Auth** — Built-in with PostgreSQL, RLS, Realtime, free tier
5. **NextAuth.js** — Flexible, but more complex to integrate with Supabase DB
**Selected solution:** Supabase Auth with custom JWT validation middleware
**Reason for choosing it:**
- Supabase Auth integrates directly with PostgreSQL (RLS, Row Level Security)
- Realtime subscriptions work with auth context
- Storage permissions inherit from auth
- No additional auth database needed
- Supabase SDK handles refresh tokens, email confirmation, password reset
- Custom middleware validates JWT and attaches user context to requests
**Advantages:**
- Single source of truth for users
- Row Level Security enforces data access at database level
- Magic link, email/password, social login, OTP
- User metadata for roles
**Disadvantages and trade-offs:**
- Vendor lock-in (but open source alternatives exist)
- Supabase pricing at scale
- Custom middleware adds complexity
**Security implications:**
- JWT validation must verify signature, expiration, audience, issuer
- RLS policies must be defined for every table
- Storage bucket policies must restrict access
- Refresh token rotation must be implemented
**Scalability implications:**
- Supabase handles auth scaling
- Backend middleware is stateless
**Files affected:**
- `backend/middleware/auth.ts`
- `supabase/rls_policies.sql`
- `supabase/storage_policies.sql`
- `src/lib/auth.ts`
**Verification method:**
- Test login/logout flows
- Verify RLS blocks unauthorized access
- Test refresh token rotation
- Test storage access control
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-004: Real-time Communication
**Date:** 2026-11-09
**Decision:** Use Supabase Realtime for live updates (offers, orders, notifications, chat).
**Problem being solved:** Need real-time updates for pharmacy offers, order status, chat messages.
**Options considered:**
1. **WebSocket (Socket.IO)** — Full control, complex scaling, manual connection management
2. **Pusher** — Managed, expensive, vendor lock-in
3. **Firebase Realtime Database** — NoSQL, limited queries
4. **Supabase Realtime** — PostgreSQL logical replication, serverless, integrated with Auth
5. **AWS AppSync** — GraphQL, expensive, complex
**Selected solution:** Supabase Realtime
**Reason for choosing it:**
- Built-in with Supabase, no additional infrastructure
- Works with row-level security
- Automatic connection management
- PostgreSQL logical replication ensures consistency
- Serverless scaling
**Advantages:**
- Zero additional cost on Supabase
- Integrates with RLS (users only see what they're authorized to)
- Automatic reconnection
- TypeScript types generated from database schema
**Disadvantages and trade-offs:**
- Limited to PostgreSQL changes (no custom events)
- Connection limits on lower tiers
- Message payload size limits
**Security implications:**
- RLS policies apply to realtime channels
- Channel access must be validated
**Scalability implications:**
- Supabase handles connection scaling
- Fallback to polling for high-volume scenarios
**Files affected:**
- `src/lib/realtime.ts`
- `supabase/realtime_publications.sql`
- `backend/realtime.ts` (if using direct PostgreSQL logical replication)
**Verification method:**
- Test subscription to changes
- Verify RLS filters realtime data
- Test connection recovery
**Status:** ⏳ Pending implementation (Phase 4)

---

## Decision DD-DEC-005: File Upload and Storage
**Date:** 2026-11-09
**Decision:** Use Supabase Storage for all file uploads (prescriptions, licenses, documents, images).
**Problem being solved:** Secure storage of sensitive healthcare documents with access control.
**Options considered:**
1. **AWS S3** — Industry standard, complex setup, separate auth
2. **Google Cloud Storage** — Similar to S3
3. **Cloudinary** — Image-focused, expensive for documents
4. **Supabase Storage** — Integrated with Auth, RLS, signed URLs, CDN
5. **Local filesystem** — Not scalable, not serverless
**Selected solution:** Supabase Storage
**Reason for choosing it:**
- Integrated with Supabase Auth and RLS
- Signed URLs for time-limited access
- CDN edge caching
- No separate credentials to manage
- Serverless and scalable
**Advantages:**
- Bucket-level RLS policies
- Public/private/protected buckets
- Signed URL expiration
- File size limits
- MIME type validation
**Disadvantages and trade-offs:**
- Vendor lock-in
- Limited to Supabase region
- File type restrictions
**Security implications:**
- RLS policies must restrict access to owner
- Signed URLs must be short-lived
- Virus scanning integration required (ClamAV)
- PHI/PII data must be encrypted at rest (Supabase does this)
**Scalability implications:**
- Supabase handles CDN and scaling
- Large files use multipart upload
**Files affected:**
- `supabase/storage_policies.sql`
- `src/lib/storage.ts`
- `backend/storage.ts`
**Verification method:**
- Test upload/download with different roles
- Verify signed URL expiration
- Test virus scanning (mock)
- Test file size limits
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-006: Payment Processing
**Date:** 2026-11-09
**Decision:** Use Razorpay for Indian payments with test mode verification.
**Problem being solved:** Secure payment processing for medicine orders.
**Options considered:**
1. **Razorpay** — Indian market leader, UPI, cards, netbanking, wallets, test mode
2. **Cashfree** — Competitive, growing, good docs
3. **Paytm** — Dominant in wallet, less for cards
4. **Stripe** — Global, but Indian compliance complexity, higher fees
5. **PhonePe** — UPI focused
**Selected solution:** Razorpay
**Reason for choosing it:**
- Dominant in Indian market
- Supports all payment methods (UPI, cards, netbanking, wallets, EMI)
- Excellent test mode with mock responses
- RBI compliant, PCI DSS Level 1
- Webhook support for payment status
- Settlements to Indian banks
**Advantages:**
- Test mode with fake card numbers
- Webhook verification
- Payment links and subscription support
- Refunds and partial payments
- GST compliant invoices
**Disadvantages and trade-offs:**
- Transaction fees (1.5-2.5% + GST)
- Webhook security (signature verification)
- Refund processing time
**Security implications:**
- Webhook signature verification mandatory
- Never expose secret key in frontend
- PCI DSS compliance for card data
- Store only payment IDs, not card details
**Scalability implications:**
- Razorpay handles scaling
- Webhook retry mechanism required
**Files affected:**
- `backend/services/payment.ts`
- `src/lib/payment.ts`
- `backend/webhooks/razorpay.ts`
**Verification method:**
- Test mode transactions
- Webhook signature verification
- Refund flow testing
- GST invoice generation
**Status:** ⏳ Pending implementation (Phase 5)

---

## Decision DD-DEC-007: Email Service
**Date:** 2026-11-09
**Decision:** Use Brevo (formerly Sendinblue) for transactional emails.
**Problem being solved:** Reliable email delivery for OTP, password reset, order confirmations, notifications.
**Options considered:**
1. **SendGrid** — Industry standard, expensive, complex
2. **Mailgun** — Developer friendly, complex pricing
3. **Amazon SES** — Cheapest, complex setup, deliverability issues
4. **Brevo** — Indian presence, good free tier, transactional + marketing
5. **Postmark** — Transactional only, excellent deliverability
6. **Resend** — New, React-focused, limited features
**Selected solution:** Brevo
**Reason for choosing it:**
- Free tier (300 emails/day) sufficient for MVP
- Indian data centers available
- Transactional + Marketing in one platform
- SMTP and API options
- Good deliverability in India
- GDPR compliant
**Advantages:**
- Free tier for bootstrap
- Transactional templates
- Real-time analytics
- SMTP fallback
- Indian compliance
**Disadvantages and trade-offs:**
- Marketing features not needed for MVP
- Limited to 300/day free
- Less known than SendGrid
**Security implications:**
- API key must be server-only
- Never expose in frontend
- TLS encryption mandatory
**Scalability implications:**
- Scales with paid plans
- IP warming required for high volume
**Files affected:**
- `backend/services/email.ts`
- `src/lib/email.ts`
**Verification method:**
- Test email delivery
- Verify template rendering
- Test unsubscribe links
- Test bounce handling
**Status:** ⏳ Pending implementation (Phase 8)

---

## Decision DD-DEC-008: AI Integration (OpenRouter)
**Date:** 2026-11-09
**Decision:** Use OpenRouter for AI capabilities with human-in-the-loop requirement.
**Problem being solved:** AI for prescription OCR, drug interaction checking, clinical decision support.
**Options considered:**
1. **OpenAI GPT-4** — Expensive, rate limits, no India data residency
2. **Anthropic Claude** — Good, expensive, no India data residency
3. **Google Gemini** — Good, rate limits, privacy concerns
4. **OpenRouter** — Aggregator, multiple models, cost optimization, open models
5. **Hugging Face Inference** — Open models, self-hosted option
6. **Local LLMs (Llama, Mistral)** — Self-hosted, GPU cost, maintenance
**Selected solution:** OpenRouter
**Reason for choosing it:**
- Access to multiple models (GPT-4, Claude, Llama, Mistral, Gemini)
- Cost optimization (route to cheapest capable model)
- Open models available (Llama, Mistral) for sensitive data
- No vendor lock-in
- Standard OpenAI-compatible API
**Reason for human-in-the-loop:**
- Medical decisions must be made by qualified professionals
- AI can assist but never replace
- Prescription validation requires pharmacist/doctor verification
- Drug interactions require clinical judgment
**Advantages:**
- Model fallback on rate limits
- Cost optimization
- Open models for PHI processing
- Standard API
**Disadvantages and trade-offs:**
- Additional latency
- Model quality varies
- API key management
**Security implications:**
- PHI/PII must never be sent to closed models (GPT-4, Claude)
- Open models (Llama, Mistral) can be used for PHI if self-hosted
- Audit logs for all AI requests
- No AI output shown to user without human verification
**Scalability implications:**
- Rate limits per model
- Fallback mechanism required
**Files affected:**
- `backend/services/ai.ts`
- `src/lib/ai.ts`
- `backend/middleware/ai-audit.ts`
**Verification method:**
- Test with open models (Llama) for PHI
- Test fallback on rate limits
- Verify audit logs
- Verify human-in-the-loop enforcement
**Status:** ⏳ Pending implementation (Phase 9)

---

## Decision DD-DEC-009: Deployment Strategy
**Date:** 2026-11-09
**Decision:** Deploy frontend to Vercel, backend to Render, database to Supabase.
**Problem being solved:** Reliable, scalable deployment with zero-downtime updates.
**Options considered:**
1. **Vercel (frontend) + Vercel (backend)** — Vercel serverless functions cold start, limited duration
2. **Render (full stack)** — Good, but less mature Next.js support
3. **Fly.io** — Global distribution, complex setup
4. **AWS** — Enterprise, complex, expensive
5. **Vercel (frontend) + Render (backend)** — Best of both worlds
**Selected solution:** Vercel for Next.js frontend, Render for Node.js backend, Supabase for DB
**Reason for choosing it:**
- Vercel optimizes Next.js (ISR, Edge Middleware, Image Optimization)
- Render provides full Node.js environment (no cold starts, longer requests)
- Supabase is managed PostgreSQL
- Zero configuration deployments
- Preview deployments for every branch
**Advantages:**
- Vercel CDN caching
- Render persistent disks for uploads
- Supabase backups
- Preview URLs for PRs
- Rollbacks instant
**Disadvantages and trade-offs:**
- Two platforms to manage
- Different environment variable systems
- Vercel edge vs Render region latency
**Security implications:**
- Environment variables segregated
- CORS configured between platforms
- HTTPS enforced
- Secrets never in repo
**Scalability implications:**
- Vercel auto-scales edge
- Render auto-scales services
- Supabase auto-scales DB
**Files affected:**
- `vercel.json`
- `render.yaml`
- `supabase/migrations/`
- `.github/workflows/ci.yml`
**Verification method:**
- Deploy preview branch
- Test CORS between platforms
- Test environment variables
- Test rollback
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-010: Design System Principles
**Date:** 2026-11-09
**Decision:** Premium healthcare technology aesthetic with clean typography, whitespace, and restrained animations.
**Problem being solved:** Avoid generic SaaS look, create trustworthy medical brand.
**Options considered:**
1. **Material Design** — Too generic, Google-ish
2. **Ant Design** — Enterprise, dense, Chinese influence
3. **Chakra UI** — Accessible, but opinionated styling
4. **Shadcn/ui** — Customizable, but lacks healthcare aesthetic
5. **Custom Tailwind design system** — Full control, premium look
**Selected solution:** Custom Tailwind design system based on visual research (Watermelon, Manus, Cult UI, Motion Primitives)
**Reason for choosing it:**
- Healthcare requires trust, not "tech startup" vibe
- Clean typography hierarchy (Plus Jakarta Sans)
- Whitespace for readability
- Restrained animations (Motion Primitives)
- Accessible color contrast (WCAG AA)
- Mobile-first responsive
**Advantages:**
- Unique brand identity
- Performance optimized (no unused CSS)
- Accessible by default
- Extensible
**Disadvantages and trade-offs:**
- More initial setup time
- No pre-built components
- Design system maintenance
**Security implications:** None
**Scalability implications:** Design tokens scale across products
**Files affected:**
- `tailwind.config.ts`
- `src/styles/globals.css`
- `src/components/ui/**/*.tsx`
- `src/lib/theme.ts`
**Verification method:**
- Visual regression testing
- Accessibility audit (axe-core)
- Performance audit (Lighthouse)
- User testing
**Status:** ⏳ Pending implementation (Phase 2)

---

## Decision DD-DEC-011: Database Schema — Referential Integrity
**Date:** 2026-11-09
**Decision:** Use PostgreSQL with foreign keys, cascade constraints, and check constraints for data integrity.
**Problem being solved:** Healthcare data must be accurate, consistent, and audit-able.
**Options considered:**
1. **Application-level validation only** — Risk of inconsistent data
2. **Database constraints only** — Rigid, harder to migrate
3. **Hybrid (both)** — Best of both worlds
**Selected solution:** Hybrid — Database constraints for data integrity, application validation for UX
**Reason for choosing it:**
- Foreign keys prevent orphaned records
- Cascade deletes/updates maintain consistency
- Check constraints enforce business rules (e.g., price > 0)
- Application validation provides user-friendly errors
**Advantages:**
- Data integrity guaranteed at DB level
- Audit trails possible
- Migrations are safe
**Disadvantages and trade-offs:**
- Migration complexity
- Constraint violations must be handled
**Security implications:** None
**Scalability implications:** Indexes required for FK lookups
**Files affected:**
- `prisma/schema.prisma`
- `supabase/migrations/*.sql`
**Verification method:**
- Test constraint violations
- Test cascade deletes
- Test check constraint enforcement
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-012: Security — Row Level Security (RLS)
**Date:** 2026-11-09
**Decision:** Enable Row Level Security on all tables with policies for each role.
**Problem being solved:** Prevent unauthorized data access, especially PHI/PII.
**Options considered:**
1. **Application-level auth only** — Risk of bypass
2. **Database views with permissions** — Complex maintenance
3. **Row Level Security (PostgreSQL)** — Enforced at DB level
**Selected solution:** Row Level Security
**Reason for choosing it:**
- Enforced at database level, cannot be bypassed
- Works with Supabase Auth
- Policies can be complex (role-based, ownership-based)
- RLS applies to realtime as well
**Advantages:**
- Defense in depth
- PHI protection
- Compliance requirement (HIPAA/GDPR/DPDP)
**Disadvantages and trade-offs:**
- Policy complexity
- Performance impact (minimal with indexes)
- Debugging complexity
**Security implications:** Critical for HIPAA/GDPR/DPDP compliance
**Scalability implications:** Indexes on policy columns
**Files affected:**
- `supabase/rls_policies.sql`
- `prisma/schema.prisma` (RLS hints)
**Verification method:**
- Test each role's access
- Test cross-role access blocked
- Test RLS with realtime
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-013: Error Handling — Centralized
**Date:** 2026-11-09
**Decision:** Centralized error handling middleware with structured logging and error tracking.
**Problem being solved:** Consistent error responses, no stack traces leaked, proper logging.
**Options considered:**
1. **Per-route try/catch** — Repetitive, easy to miss
2. **Express error middleware** — Standard, but no structure
3. **Centralized middleware with error classes** — Best practice
**Selected solution:** Centralized middleware with custom error classes
**Reason for choosing it:**
- Consistent JSON error format
- HTTP status codes
- No stack traces in production
- Structured logging (JSON)
- Error tracking integration (Sentry)
**Advantages:**
- Consistent API contract
- Security (no info leakage)
- Observability
- Easy to test
**Disadvantages and trade-offs:**
- Boilerplate for error classes
- Must remember to use next(err)
**Security implications:** Prevents information disclosure
**Scalability implications:** Logging volume scales with traffic
**Files affected:**
- `backend/middleware/error-handler.ts`
- `backend/lib/errors.ts`
- `backend/lib/logger.ts`
**Verification method:**
- Test error responses
- Verify no stack traces in prod
- Verify structured logs
- Verify Sentry integration
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-014: API Versioning
**Date:** 2026-11-09
**Decision:** URL versioning (`/api/v1/...`) with backward compatibility policy.
**Problem being solved:** Breaking changes without breaking existing clients.
**Options considered:**
1. **Header versioning** — Hidden, hard to test
2. **URL versioning** — Visible, cacheable, testable
3. **Query param versioning** — Ugly, cache issues
4. **No versioning** — Risky
**Selected solution:** URL versioning
**Reason for choosing it:**
- Visible in browser/Postman
- Cache key includes version
- Easy to deprecate
- Clear contract
**Advantages:**
- Clear contract
- Cache friendly
- Deprecation headers possible
- Easy to test
**Disadvantages and trade-offs:**
- Longer URLs
- Duplication of code (can share logic)
**Security implications:** None
**Scalability implications:** Caching efficiency
**Files affected:**
- `backend/routes/v1/`
- `backend/server.ts` (version prefix)
**Verification method:**
- Test v1 and v2 coexistence
- Test deprecation headers
- Test cache behavior
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-015: Rate Limiting
**Date:** 2026-11-09
**Decision:** Per-IP and per-user rate limiting with Redis backend.
**Problem being solved:** Prevent abuse, DoS, brute force, scraping.
**Options considered:**
1. **In-memory store** — Not scalable across instances
2. **Redis store** — Distributed, scalable
3. **Cloudflare** — External, adds latency
4. **NGINX** — Infrastructure level
**Selected solution:** Redis-backed rate limiting (express-rate-limit-redis)
**Reason for choosing it:**
- Works across multiple backend instances
- Configurable limits per endpoint
- Sliding window algorithm
- Whitelisting (internal services)
**Advantages:**
- Distributed
- Configurable per route
- Sliding window (better than fixed window)
- Whitelisting
**Disadvantages and trade-offs:**
- Redis dependency
- Latency added
- Memory usage
**Security implications:** Prevents brute force, scraping, DoS
**Scalability implications:** Redis scales horizontally
**Files affected:**
- `backend/middleware/rate-limit.ts`
- `backend/config/redis.ts`
**Verification method:**
- Test rate limit headers
- Test burst vs sustained
- Test whitelist
- Test distributed across instances
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-016: Input Validation
**Date:** 2026-11-09
**Decision:** Use Zod for runtime validation with TypeScript inference.
**Problem being solved:** Prevent invalid data, injection, XSS, business rule violations.
**Options considered:**
1. **Joi** — Verbose, no TypeScript inference
2. **Yup** — Good, but Zod is faster
3. **Zod** — Fast, TypeScript-first, runtime validation
4. **Class-validator** — Decorator-based, less flexible
5. **No validation** — Risky
**Selected solution:** Zod
**Reason for choosing it:**
- TypeScript inference (schema -> type)
- Fast runtime validation
- Excellent error messages
- Composition and refinement
- OpenAPI generation
**Advantages:**
- Type safety end-to-end
- Reusable schemas
- Custom refinements (email, phone, INR, date ranges)
- OpenAPI spec generation
**Disadvantages and trade-offs:**
- Bundle size
- Learning curve for refinements
**Security implications:** Prevents injection, XSS, business logic bypass
**Scalability implications:** Minimal CPU overhead
**Files affected:**
- `backend/lib/validation.ts`
- `src/lib/validation.ts`
- `src/lib/zod-schemas.ts`
**Verification method:**
- Test invalid inputs
- Test TypeScript inference
- Test custom refinements
- Test OpenAPI generation
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-017: Logging — Structured JSON
**Date:** 2026-11-09
**Decision:** Structured JSON logging with request correlation IDs.
**Problem being solved:** Debugging, monitoring, alerting, compliance audit trails.
**Options considered:**
1. **Console.log** — Unstructured, hard to parse
2. **Winston** — Mature, transports, formats
3. **Pino** — Fast, JSON, low overhead
4. **Bunyan** — Deprecated
5. **No logging** — Impossible to debug
**Selected solution:** Pino
**Reason for choosing it:**
- Extremely fast (nanosecond logging)
- JSON output by default
- Child loggers with context
- Transport separation
- Request correlation ID injection
**Advantages:**
- Performance
- ELK stack compatible
- Correlation IDs
- Levels (trace, debug, info, warn, error, fatal)
- Redaction of sensitive fields
**Disadvantages and trade-offs:**
- Less human-readable in console
- Configuration complexity
**Security implications:** Redact PHI/PII/tokens from logs
**Scalability implications:** Log volume scales with traffic
**Files affected:**
- `backend/lib/logger.ts`
- `backend/middleware/logging.ts`
**Verification method:**
- Test JSON output
- Verify correlation ID propagation
- Verify redaction of sensitive fields
- Test log levels
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-018: Security Headers
**Date:** 2026-11-09
**Decision:** Use Helmet.js with custom CSP for XSS protection.
**Problem being solved:** Prevent XSS, clickjacking, MIME sniffing, referrer leakage.
**Options considered:**
1. **Helmet.js** — Standard Express middleware
2. **Manual headers** — Error-prone
3. **Cloudflare** — External
4. **No headers** — Vulnerable
**Selected solution:** Helmet.js with custom CSP
**Reason for choosing it:**
- Comprehensive security headers
- CSP prevents inline scripts/styles
- Referrer policy controls referrer leakage
- Permissions policy restricts APIs
**Advantages:**
- One middleware
- Configurable
- Industry standard
**Disadvantages and trade-offs:**
- CSP can break legitimate inline scripts
- Requires nonce/hash for dynamic content
**Security implications:** Critical for XSS protection
**Scalability implications:** Minimal overhead
**Files affected:**
- `backend/middleware/security.ts`
**Verification method:**
- Test security headers present
- Test CSP violation reporting
- Test XSS attempts blocked
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-019: CORS Configuration
**Date:** 2026-11-09
**Decision:** Strict CORS with allowlisted origins, no wildcards.
**Problem being solved:** Prevent CSRF, unauthorized cross-origin requests.
**Options considered:**
1. **CORS wildcard (*)** — Insecure
2. **Allowlist origins** — Secure
3. **Dynamic origin validation** — Flexible
4. **No CORS** — Same origin only
**Selected solution:** Allowlist origins with dynamic validation for preview deployments
**Reason for choosing it:**
- Prevents unauthorized origins
- Allows Vercel preview deployments
- Preflight caching
**Advantages:**
- Secure by default
- Preview deployments work
- Caching reduces overhead
**Disadvantages and trade-offs:**
- Maintenance of allowlist
- Dynamic validation adds complexity
**Security implications:** Prevents CSRF and data exfiltration
**Scalability implications:** Minimal
**Files affected:**
- `backend/middleware/cors.ts`
**Verification method:**
- Test blocked origins
- Test allowed origins
- Test preflight caching
- Test Vercel preview domains
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-020: Database Connection Pooling
**Date:** 2026-11-09
**Decision:** Use Supabase connection pooler (transaction mode) with Prisma.
**Problem being solved:** Connection limits, idle connections, scaling.
**Options considered:**
1. **Direct connections** — Limited by PostgreSQL max_connections
2. **PgBouncer (session mode)** — Transaction boundaries lost
3. **Supabase connection pooler (transaction mode)** — Optimized for serverless
4. **Prisma connection pool** — Application level
**Selected solution:** Supabase connection pooler (transaction mode)
**Reason for choosing it:**
- Supabase manages it
- Transaction mode works with Prisma
- No need to manage PgBouncer
- Scales with backend instances
**Advantages:**
- No max_connections limit
- Automatic scaling
- No maintenance
**Disadvantages and trade-offs:**
- Transaction mode limitations (prepared statements, temp tables, session variables)
- Slight latency
**Security implications:** None
**Scalability implications:** Enables horizontal scaling
**Files affected:**
- `prisma/schema.prisma` (connection pool config)
- `backend/lib/database.ts`
**Verification method:**
- Test concurrent connections
- Test transaction boundaries
- Test prepared statement compatibility
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-021: Cache Strategy
**Date:** 2026-11-09
**Decision:** Redis for API response caching, TanStack Query for client caching.
**Problem being solved:** Reduce database load, improve response times.
**Options considered:**
1. **In-memory cache** — Not distributed
2. **Redis** — Distributed, TTL, pub/sub
3. **CDN** — Static assets only
4. **No cache** — High DB load
**Selected solution:** Redis for server-side, TanStack Query for client-side
**Reason for choosing it:**
- Redis: distributed, TTL, atomic operations, pub/sub for invalidation
- TanStack Query: client-side stale-while-revalidate, background refetch
**Advantages:**
- Redis: pub/sub invalidation, TTL, Lua scripts
- TanStack Query: automatic background updates, deduplication
**Disadvantages and trade-offs:**
- Redis dependency
- Cache invalidation complexity
- Stale data window
**Security implications:** Don't cache PHI/PII
**Scalability implications:** Redis scales horizontally
**Files affected:**
- `backend/lib/cache.ts`
- `src/lib/query-client.ts`
**Verification method:**
- Test cache hit/miss
- Test TTL expiration
- Test invalidation
- Test client cache sync
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-022: Monitoring and Observability
**Date:** 2026-11-09
**Decision:** Prometheus metrics, Sentry error tracking, structured logging.
**Problem being solved:** Visibility into production, alerting, debugging.
**Options considered:**
1. **Datadog** — Expensive, agent required
2. **New Relic** — Expensive
3. **Prometheus + Grafana** — Open source, self-hosted
4. **Sentry** — Error tracking
5. **Logtail** — Log aggregation
6. **No monitoring** — Blind in production
**Selected solution:** Prometheus metrics + Sentry + Structured logging
**Reason for choosing it:**
- Prometheus: time-series, alerting, open source
- Sentry: error tracking, breadcrumbs, release tracking
- Structured logging: searchable, structured
**Advantages:**
- Free/open source
- Alerting on SLOs
- Error context
- Log correlation
**Disadvantages and trade-offs:**
- Infrastructure overhead
- Configuration complexity
- Data retention costs
**Security implications:** Don't log PHI/PII
**Scalability implications:** Scales with metrics volume
**Files affected:**
- `backend/lib/metrics.ts`
- `backend/lib/sentry.ts`
- `backend/lib/logger.ts`
**Verification method:**
- Test metric endpoints
- Test Sentry capture
- Test log forwarding
- Test alerts
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-023: Testing Strategy
**Date:** 2026-11-09
**Decision:** Jest + React Testing Library for frontend, Vitest for backend, Playwright for e2e.
**Problem being solved:** Confidence in refactors, regression prevention.
**Options considered:**
1. **Jest + RTL** — React standard
2. **Vitest** — Vite-native, faster, ESM
3. **Playwright** — Cross-browser e2e
4. **Cypress** — Flaky, Electron-based
5. **No tests** — Technical debt
**Selected solution:** Vitest (backend), Jest + RTL (frontend), Playwright (e2e)
**Reason for choosing it:**
- Vitest: Vite-native, ESM, fast, TypeScript
- Jest + RTL: React testing standard, mature
- Playwright: reliable, cross-browser, auto-wait
**Advantages:**
- Fast test runs
- TypeScript support
- Cross-browser e2e
- CI integration
**Disadvantages and trade-offs:**
- Test maintenance
- Flaky tests risk
**Security implications:** Security tests (OWASP)
**Scalability implications:** Test parallelization
**Files affected:**
- `jest.config.js`
- `vitest.config.ts`
- `playwright.config.ts`
- `src/tests/**`
- `backend/tests/**`
**Verification method:**
- Test coverage > 80%
- e2e flows pass
- Security tests pass
- CI pipeline passes
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-024: CI/CD Pipeline
**Date:** 2026-11-09
**Decision:** GitHub Actions with preview deployments, security scans, test coverage.
**Problem being solved:** Automated testing, deployment, security.
**Options considered:**
1. **GitHub Actions** — Native, free for public, matrix builds
2. **GitLab CI** — Self-hosted option
3. **CircleCI** — Expensive
4. **Jenkins** — Self-hosted, maintenance
5. **No CI** — Manual deployment
**Selected solution:** GitHub Actions
**Reason for choosing it:**
- Native to GitHub
- Free for public repos
- Matrix builds (Node versions, OS)
- Secrets management
- Preview deployments (Vercel/Render)
**Advantages:**
- Automated
- Parallel jobs
- Artifacts
- Security scanning (Dependabot, CodeQL)
- Deployment approvals
**Disadvantages and trade-offs:**
- YAML complexity
- Runner limitations
- Public repo exposure
**Security implications:** Secrets management, SBOM generation
**Scalability implications:** Concurrent job limits
**Files affected:**
- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`
- `.github/dependabot.yml`
**Verification method:**
- Test PR workflow
- Test deployment workflow
- Test security scanning
- Test rollback
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-025: Accessibility (WCAG AA)
**Date:** 2026-11-09
**Decision:** WCAG AA compliance with axe-core testing.
**Problem being solved:** Legal requirement (DPDP, Rights of Persons with Disabilities Act), inclusive design.
**Options considered:**
1. **WCAG A** — Minimum, not sufficient
2. **WCAG AA** — Standard for public services
3. **WCAG AAA** — Ideal, often impractical
4. **No accessibility** — Illegal, exclusionary
**Selected solution:** WCAG AA
**Reason for choosing it:**
- Legal requirement for public services in India
- Inclusive design
- Screen reader support
- Keyboard navigation
- Color contrast
**Advantages:**
- Legal compliance
- Inclusive
- Better UX for all
**Disadvantages and trade-offs:**
- Design constraints (contrast, focus)
- Testing overhead
**Security implications:** None
**Scalability implications:** None
**Files affected:**
- `tailwind.config.ts` (color palette)
- `src/lib/accessibility.ts`
- `src/components/ui/**/*.tsx`
**Verification method:**
- Axe-core automated tests
- Manual screen reader testing
- Keyboard navigation testing
- Color contrast verification
**Status:** ⏳ Pending implementation (Phase 9)

---

## Decision DD-DEC-026: Performance Budget
**Date:** 2026-11-09
**Decision:** Lighthouse performance budget: FCP < 1.5s, LCP < 2.5s, CLS < 0.1, TBT < 150ms.
**Problem being solved:** Ensure fast, responsive user experience on mobile.
**Options considered:**
1. **No budget** — Unpredictable performance
2. **Custom metrics** — Hard to track
3. **Lighthouse budgets** — Standard, CI-integrable
**Selected solution:** Lighthouse performance budgets
**Reason for choosing it:**
- Industry standard
- CI integration
- Real user monitoring correlation
**Advantages:**
- Performance regression prevention
- Mobile optimization
- SEO benefit
**Disadvantages and trade-offs:**
- Build time increase
- Design constraints
**Security implications:** None
**Scalability implications:** CDN caching reduces origin load
**Files affected:**
- `lighthouse-ci.config.js`
- `next.config.js` (image optimization)
- `tailwind.config.ts` (purge unused CSS)
**Verification method:**
- Lighthouse CI in PRs
- Real User Monitoring
- Core Web Vitals reporting
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-027: Environment Configuration
**Date:** 2026-11-09
**Decision:** Separate .env files for development, staging, production with .env.example.
**Problem being solved:** Configuration management, secret isolation.
**Options considered:**
1. **Single .env** — Risk of prod secrets in dev
2. **Per-environment .env files** — Best practice
3. **Vault/Secrets Manager** — Overkill for MVP
**Selected solution:** .env.development, .env.staging, .env.production, .env.example
**Reason for choosing it:**
- Clear separation
- .env.example for onboarding
- .gitignore protects secrets
- Vercel/Render import from .env
**Advantages:**
- Clear separation
- Onboarding easy
- Security
**Disadvantages and trade-offs:**
- File duplication
- Drift between environments
**Security implications:** Secrets never in repo
**Scalability implications:** Secret rotation process
**Files affected:**
- `.env.example`
- `.env.development`
- `.env.staging`
- `.env.production` (not committed)
**Verification method:**
- Test env loading
- Test secret isolation
- Test .gitignore
- Test Vercel/Render import
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-028: Database Migration Strategy
**Date:** 2026-11-09
**Decision:** Prisma migrations with Supabase integration, backward compatible.
**Problem being solved:** Schema evolution without downtime.
**Options considered:**
1. **Manual SQL** — Error-prone, no versioning
2. **Prisma migrations** — Versioned, type-safe, but can be destructive
3. **Flyway** — SQL-based, mature
4. **No migrations** — Schema drift
**Selected solution:** Prisma migrations with Supabase, backward compatible changes only
**Reason for choosing it:**
- Versioned migrations
- Type-safe schema
- Supabase integration
- Backward compatible changes (add columns, tables)
**Advantages:**
- Version control
- Type safety
- Rollback support
- Supabase integration
**Disadvantages and trade-offs:**
- Destructive changes require downtime
- Migration time
**Security implications:** Migration scripts must not leak data
**Scalability implications:** Zero-downtime migrations
**Files affected:**
- `prisma/schema.prisma`
- `supabase/migrations/*.sql`
**Verification method:**
- Test migration apply
- Test rollback
- Test backward compatibility
- Test zero-downtime deployment
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-029: Real-time Subscription Strategy
**Date:** 2026-11-09
**Decision:** Subscribe to specific tables/columns with filters, not broad subscriptions.
**Problem being solved:** Bandwidth, performance, relevance.
**Options considered:**
1. **Subscribe to entire table** — Bandwidth waste, noise
2. **Subscribe to specific columns** — Efficient
3. **Subscribe with filters** — Most efficient
4. **Polling** — High latency, DB load
**Selected solution:** Column-specific subscriptions with filters
**Reason for choosing it:**
- Reduces payload size
- Reduces processing overhead
- Relevant data only
- Scales better
**Advantages:**
- Efficient bandwidth
- Lower latency
- Relevant data
**Disadvantages and trade-offs:**
- More subscription management
- Complexity in filtering
**Security implications:** RLS applies to subscriptions
**Scalability implications:** Scales with subscription count
**Files affected:**
- `src/lib/realtime.ts`
- `supabase/realtime_publications.sql`
**Verification method:**
- Test subscription payload size
- Test filter accuracy
- Test RLS enforcement
- Test connection recovery
**Status:** ⏳ Pending implementation (Phase 4)

---

## Decision DD-DEC-030: File Storage — Virus Scanning
**Date:** 2026-11-09
**Decision:** Integrate ClamAV for virus scanning on uploads.
**Problem being solved:** Prevent malware uploads (prescriptions, licenses, documents).
**Options considered:**
1. **No scanning** — Risk of malware
2. **ClamAV** — Open source, mature, signature updates
3. **Cloud AV services** — Expensive, privacy concerns
4. **File type validation only** — Insufficient
**Selected solution:** ClamAV integration
**Reason for choosing it:**
- Open source
- Regular signature updates
- CLI interface
- Can run in container
**Advantages:**
- Malware prevention
- Open source
- Configurable
**Disadvantages and trade-offs:**
- CPU overhead
- Signature update maintenance
- False positives
**Security implications:** Critical for document upload security
**Scalability implications:** Horizontal scaling of scanners
**Files affected:**
- `backend/services/virus-scan.ts`
- `backend/webhooks/upload.ts`
**Verification method:**
- Test clean file passes
- Test infected file blocked
- Test signature updates
- Test performance impact
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-031: Audit Logging
**Date:** 2026-11-09
**Decision:** Immutable audit log for all PHI/PII access and modifications.
**Problem being solved:** Regulatory compliance (HIPAA/GDPR/DPDP), forensic analysis.
**Options considered:**
1. **Application logs only** — Tamperable
2. **Database triggers** — Immutable but complex
3. **Append-only table with cryptographic hashes** — Best for compliance
**Selected solution:** Append-only audit log table with SHA-256 chaining
**Reason for choosing it:**
- Immutable by design
- Cryptographic chaining prevents tampering
- Queryable for compliance
- PHI/PII access tracking
**Advantages:**
- Regulatory compliance
- Forensic capability
- Tamper evidence
**Disadvantages and trade-offs:**
- Storage overhead
- Query complexity
- Maintenance
**Security implications:** Critical for compliance
**Scalability implications:** Partitioning by date
**Files affected:**
- `prisma/schema.prisma` (audit_log table)
- `backend/services/audit.ts`
- `backend/middleware/audit.ts`
**Verification method:**
- Test log immutability
- Test hash chaining
- Test query performance
- Test compliance reporting
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-032: Session Management
**Date:** 2026-11-09
**Decision:** Stateless JWT with refresh token rotation stored in Redis.
**Problem being solved:** Secure session management, logout revocation, refresh security.
**Options considered:**
1. **Server-side sessions** — Redis storage, stateful
2. **Stateless JWT** — No revocation, long-lived tokens
3. **Stateless JWT + Refresh tokens + Redis** — Best of both
4. **Cookies with SameSite** — CSRF protection needed
**Selected solution:** Stateless JWT + Refresh token rotation in Redis
**Reason for choosing it:**
- Stateless scaling
- Refresh token revocation
- Short-lived access tokens
- Refresh token rotation prevents replay
**Advantages:**
- Stateless backend
- Token revocation
- Short access token lifetime
- Refresh token rotation
**Disadvantages and trade-offs:**
- Redis dependency
- Refresh token storage
- Token theft window
**Security implications:** Prevents session hijacking, enables logout
**Scalability implications:** Redis scales horizontally
**Files affected:**
- `backend/lib/auth.ts`
- `backend/middleware/auth.ts`
- `backend/lib/redis.ts`
**Verification method:**
- Test token expiration
- Test refresh token rotation
- Test logout revocation
- Test concurrent sessions
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-033: Error Tracking — Sentry
**Date:** 2026-11-09
**Decision:** Sentry for frontend and backend error tracking with source maps.
**Problem being solved:** Production error visibility, breadcrumbs, release tracking.
**Options considered:**
1. **No tracking** — Blind in production
2. **Log aggregation** — Not error-specific
3. **Sentry** — Error-focused, breadcrumbs, releases
4. **LogRocket** — Session replay, expensive
**Selected solution:** Sentry
**Reason for choosing it:**
- Error grouping
- Breadcrumbs
- Release tracking
- Source maps
- Performance monitoring
**Advantages:**
- Error visibility
- Release correlation
- Performance insights
- Free tier
**Disadvantages and trade-offs:**
- Data volume costs
- PII leakage risk
- Configuration complexity
**Security implications:** PII must be scrubbed from breadcrumbs
**Scalability implications:** Event volume scales with errors
**Files affected:**
- `backend/lib/sentry.ts`
- `src/lib/sentry.ts`
- `next.config.js` (source maps)
**Verification method:**
- Test error capture
- Test breadcrumbs
- Test release tracking
- Test PII scrubbing
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-034: Backup Strategy
**Date:** 2026-11-09
**Decision:** Supabase automated backups + point-in-time recovery + manual exports.
**Problem being solved:** Data loss prevention, compliance retention.
**Options considered:**
1. **No backups** — Risk of data loss
2. **Manual dumps** — Error-prone, infrequent
3. **Supabase automated backups** — Managed, point-in-time recovery
4. **Third-party backup** — Additional cost
**Selected solution:** Supabase automated backups + point-in-time recovery
**Reason for choosing it:**
- Managed by Supabase
- Point-in-time recovery
- Retention period configurable
- No operational overhead
**Advantages:**
- Zero operational overhead
- Point-in-time recovery
- Retention compliance
- Encrypted at rest
**Disadvantages and trade-offs:**
- Vendor lock-in
- Retention cost
- Restore time
**Security implications:** Encryption at rest, access control
**Scalability implications:** Backup storage costs
**Files affected:**
- `supabase/backup-config.sql`
- `backend/services/backup.ts`
**Verification method:**
- Test backup schedule
- Test point-in-time recovery
- Test restore time
- Test encryption
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-035: CDN and Caching — Static Assets
**Date:** 2026-11-09
**Decision:** Vercel CDN for Next.js assets, Cloudflare for static assets, Cache-Control headers.
**Problem being solved:** Fast asset delivery, cache efficiency.
**Options considered:**
1. **No CDN** — Origin load
2. **Vercel CDN** — Next.js optimized
3. **Cloudflare** — Global, additional features
4. **AWS CloudFront** — Complex, expensive
**Selected solution:** Vercel CDN for Next.js, Cloudflare for static assets
**Reason for choosing it:**
- Vercel optimizes Next.js (ISR, image optimization)
- Cloudflare for static assets (images, fonts, icons)
- Cache-Control headers for browser caching
**Advantages:**
- Fast delivery
- Edge caching
- Image optimization
- DDoS protection
**Disadvantages and trade-offs:**
- Cache invalidation complexity
- Cost at scale
**Security implications:** HTTPS enforcement, HSTS
**Scalability implications:** Scales with traffic
**Files affected:**
- `next.config.js`
- `vercel.json`
- `cloudflare-config.json`
**Verification method:**
- Test cache headers
- Test edge caching
- Test image optimization
- Test DDoS protection
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-036: Internationalization (i18n)
**Date:** 2026-11-09
**Decision:** English (en-IN) and Hindi (hi-IN) with next-intl.
**Problem being solved:** Language accessibility for Indian users.
**Options considered:**
1. **English only** — Excludes non-English speakers
2. **English + Hindi** — Covers majority
3. **Multiple Indian languages** — High complexity
4. **No i18n** — Exclusionary
**Selected solution:** English (en-IN) and Hindi (hi-IN)
**Reason for choosing it:**
- English for urban, educated users
- Hindi for mass market
- next-intl integrates with Next.js 14
- RTL not needed (Hindi is LTR)
**Advantages:**
- Language accessibility
- next-intl integration
- SEO for both languages
**Disadvantages and trade-offs:**
- Translation maintenance
- UI layout differences
**Security implications:** None
**Scalability implications:** Translation file size
**Files affected:**
- `src/lib/i18n.ts`
- `src/locales/en.json`
- `src/locales/hi.json`
- `next.config.js` (locale routing)
**Verification method:**
- Test language switching
- Test SEO tags
- Test layout adaptation
- Test translation completeness
**Status:** ⏳ Pending implementation (Phase 2)

---

## Decision DD-DEC-037: Rate Limiting — Per-user
**Date:** 2026-11-09
**Decision:** Per-user rate limiting for sensitive endpoints (login, OTP, payment).
**Problem being solved:** Prevent brute force, credential stuffing, payment fraud.
**Options considered:**
1. **Per-IP only** — Shared IPs (NAT, corporate) get blocked
2. **Per-user only** — IP rotation bypass
3. **Both per-IP and per-user** — Defense in depth
**Selected solution:** Both per-IP and per-user rate limiting
**Reason for choosing it:**
- Per-IP prevents distributed attacks
- Per-user prevents credential stuffing on shared IPs
- Combined provides defense in depth
**Advantages:**
- Defense in depth
- Shared IP fairness
- Credential stuffing prevention
**Disadvantages and trade-offs:**
- Complexity
- Redis key management
**Security implications:** Critical for auth security
**Scalability implications:** Redis scales
**Files affected:**
- `backend/middleware/rate-limit.ts`
**Verification method:**
- Test per-IP limits
- Test per-user limits
- Test combined limits
- Test shared IP scenario
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-038: Database Indexing Strategy
**Date:** 2026-11-09
**Decision:** Composite indexes for query patterns, partial indexes for filtered data, GIN for JSONB.
**Problem being solved:** Query performance, index bloat, write performance.
**Options considered:**
1. **Single column indexes** — Insufficient for composite queries
2. **Composite indexes** — Best for query patterns
3. **Partial indexes** — For filtered data (active records)
4. **GIN indexes** — For JSONB search
5. **No indexes** — Slow queries
**Selected solution:** Composite + Partial + GIN indexes
**Reason for choosing it:**
- Composite indexes cover query patterns
- Partial indexes reduce size for active records
- GIN indexes for JSONB full-text search
**Advantages:**
- Query performance
- Index size optimization
- Full-text search
**Disadvantages and trade-offs:**
- Write performance impact
- Maintenance overhead
- Index selection complexity
**Security implications:** None
**Scalability implications:** Index size scales with data
**Files affected:**
- `prisma/schema.prisma` (indexes)
- `supabase/migrations/*.sql` (additional indexes)
**Verification method:**
- Test query plans (EXPLAIN ANALYZE)
- Test index size
- Test write performance
- Test full-text search
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-039: API Documentation
**Date:** 2026-11-09
**Decision:** OpenAPI 3.0 (Swagger) with Zod schema generation.
**Problem being solved:** API contract documentation, client generation, testing.
**Options considered:**
1. **Manual docs** — Out of sync
2. **Swagger annotations** — Verbose
3. **OpenAPI from Zod** — Type-safe, auto-generated
4. **GraphQL** — Overkill for REST
5. **No docs** — Hard to integrate
**Selected solution:** OpenAPI 3.0 generated from Zod schemas
**Reason for choosing it:**
- Type-safe (Zod -> OpenAPI)
- Auto-generated (no drift)
- Client SDK generation
- Interactive docs (Swagger UI)
**Advantages:**
- No drift between code and docs
- Client SDKs
- Interactive testing
- Versioned
**Disadvantages and trade-offs:**
- Build step required
- Zod to OpenAPI conversion complexity
**Security implications:** Don't expose sensitive endpoints in docs
**Scalability implications:** Docs size scales with endpoints
**Files affected:**
- `backend/lib/openapi.ts`
- `backend/routes/v1/openapi.ts`
- `src/lib/api-client.ts` (generated)
**Verification method:**
- Test schema generation
- Test client SDK generation
- Test Swagger UI
- Test sensitive endpoint exclusion
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-040: Default — No Fake Data
**Date:** 2026-11-09
**Decision:** No fake data, no placeholder statistics, no fake reviews, no nonfunctional UI elements.
**Problem being solved:** Trust, transparency, professional appearance.
**Options considered:**
1. **Fake data** — Common in demos, misleading
2. **Real data only** — Trustworthy
3. **Synthetic data** — Labeled as synthetic
**Selected solution:** Real data only, clearly labeled synthetic/test data
**Reason for choosing it:**
- Healthcare requires trust
- Misleading data is unethical
- Users can distinguish real vs test
**Advantages:**
- Trustworthy
- Transparent
- Professional
**Disadvantages and trade-offs:**
- Empty states during development
- No demo data for investors
**Security implications:** None
**Scalability implications:** None
**Files affected:**
- `src/components/**/*.tsx` (empty states)
- `backend/services/**/*.ts` (real data only)
**Verification method:**
- UI review for fake elements
- Data source verification
- Test data labeling
**Status:** ✅ Enforced in current prototype

---

## Decision DD-DEC-041: Default — Human-in-the-loop for Medical Decisions
**Date:** 2026-11-09
**Decision:** AI assists, never decides. All medical decisions require human verification.
**Problem being solved:** Regulatory compliance, patient safety, liability.
**Options considered:**
1. **AI autonomous decisions** — Illegal, unsafe
2. **AI decision support** — Assist, don't decide
3. **No AI** — Missed opportunity
**Selected solution:** AI decision support with human-in-the-loop
**Reason for choosing it:**
- Medical liability
- Regulatory requirements (NMC Telemedicine Guidelines)
- Patient safety
**Advantages:**
- Legal compliance
- Patient safety
- Liability protection
**Disadvantages and trade-offs:**
- Slower UX
- Human resource requirement
**Security implications:** PHI handling in AI
**Scalability implications:** Human throughput limits
**Files affected:**
- `backend/services/ai.ts` (validation)
- `src/components/ai-assist/**/*.tsx` (UI)
**Verification method:**
- Test human verification required
- Test AI output never shown without verification
- Test PHI handling
**Status:** ✅ Enforced in architecture

---

## Decision DD-DEC-042: Default — No Vendor Lock-in for Core
**Date:** 2026-11-09
**Decision:** Core business logic vendor-agnostic; only integrations vendor-specific.
**Problem being solved:** Portability, negotiation power, risk mitigation.
**Options considered:**
1. **Vendor-specific core** — Lock-in, migration impossible
2. **Vendor-agnostic core** — Portable, negotiable
3. **Hybrid** — Core portable, integrations specific
**Selected solution:** Vendor-agnostic core, vendor-specific integrations
**Reason for choosing it:**
- Migration possible
- Negotiation power
- Risk mitigation
**Advantages:**
- Portability
- Negotiation power
- Risk mitigation
**Disadvantages and trade-offs:**
- Abstraction overhead
- Integration complexity
**Security implications:** None
**Scalability implications:** None
**Files affected:**
- `backend/lib/abstractions.ts`
- `backend/services/**/*.ts` (adapter pattern)
**Verification method:**
- Test adapter pattern
- Test vendor swap
- Test core independence
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-043: Default — Privacy by Design
**Date:** 2026-11-09
**Decision:** Data minimization, purpose limitation, consent management.
**Problem being solved:** DPDP Act, GDPR, HIPAA compliance.
**Options considered:**
1. **Collect everything** — Risk, non-compliance
2. **Collect minimum necessary** — Compliant
3. **Consent for each purpose** — Granular control
**Selected solution:** Data minimization + Purpose limitation + Granular consent
**Reason for choosing it:**
- DPDP Act Section 8
- GDPR Article 5
- HIPAA Minimum Necessary
**Advantages:**
- Legal compliance
- User trust
- Reduced breach impact
**Disadvantages and trade-offs:**
- Feature limitations
- Consent fatigue management
**Security implications:** Critical for compliance
**Scalability implications:** Storage costs reduced
**Files affected:**
- `prisma/schema.prisma` (consent records)
- `backend/services/consent.ts`
- `src/components/consent/**/*.tsx`
**Verification method:**
- Test data minimization
- Test consent retrieval
- Test purpose limitation
- Test deletion on withdrawal
**Status:** ⏳ Pending implementation (Phase 9)

---

## Decision DD-DEC-044: Default — Security Headers Enforcement
**Date:** 2026-11-09
**Decision:** Enforce HTTPS, HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy.
**Problem being solved:** Transport security, clickjacking, XSS, referrer leakage, API restriction.
**Options considered:**
1. **None** — Vulnerable
2. **Some** — Partial protection
3. **All standard headers** — Defense in depth
**Selected solution:** All standard security headers
**Reason for choosing it:**
- HTTPS mandatory
- HSTS prevents downgrade
- CSP prevents XSS
- X-Frame-Options prevents clickjacking
- Referrer-Policy controls leakage
- Permissions-Policy restricts APIs
**Advantages:**
- Defense in depth
- Browser enforcement
- Standards compliant
**Disadvantages and trade-offs:**
- CSP breakage
- HSTS preload complexity
**Security implications:** Critical for transport and content security
**Scalability implications:** Minimal overhead
**Files affected:**
- `backend/middleware/security.ts`
**Verification method:**
- Test all headers present
- Test CSP violation reporting
- Test HSTS preload
- Test clickjacking protection
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-045: Default — Rate Limiting Enforcement
**Date:** 2026-11-09
**Decision:** Enforce rate limiting on all public endpoints with appropriate limits.
**Problem being solved:** Prevent abuse, DoS, brute force, scraping.
**Options considered:**
1. **None** — Vulnerable
2. **Some endpoints** — Inconsistent protection
3. **All public endpoints** — Comprehensive protection
**Selected solution:** All public endpoints rate limited
**Reason for choosing it:**
- Public endpoints are attack surface
- Auth endpoints need strict limits
- Public APIs need reasonable limits
**Advantages:**
- Comprehensive protection
- Consistent security posture
- DoS mitigation
**Disadvantages and trade-offs:**
- Legitimate high-volume users
- False positives
**Security implications:** Critical for availability
**Scalability implications:** Redis scales
**Files affected:**
- `backend/middleware/rate-limit.ts`
**Verification method:**
- Test auth endpoints limits
- Test public API limits
- Test internal service whitelist
- Test distributed limits
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-046: Default — Input Validation Enforcement
**Date:** 2026-11-09
**Decision:** Enforce input validation on all API inputs with Zod.
**Problem being solved:** Injection, XSS, business logic bypass, invalid data.
**Options considered:**
1. **None** — Vulnerable
2. **Some endpoints** — Inconsistent
3. **All endpoints** — Comprehensive protection
**Selected solution:** All API inputs validated with Zod
**Reason for choosing it:**
- Injection prevention
- XSS prevention
- Business rule enforcement
- Data quality
**Advantages:**
- Security
- Data quality
- Consistent errors
**Disadvantages and trade-offs:**
- Performance overhead
- Validation complexity
**Security implications:** Critical for injection and XSS
**Scalability implications:** Minimal CPU overhead
**Files affected:**
- `backend/lib/validation.ts`
- `backend/routes/v1/**/*.ts`
**Verification method:**
- Test injection attempts
- Test XSS attempts
- Test business rule violations
- Test invalid data rejection
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-047: Default — Structured Logging Enforcement
**Date:** 2026-11-09
**Decision:** Enforce structured JSON logging with correlation IDs on all requests.
**Problem being solved:** Observability, debugging, compliance audit trails.
**Options considered:**
1. **None** — Blind in production
2. **Some requests** — Incomplete visibility
3. **All requests** — Complete visibility
**Selected solution:** All requests structured logged with correlation IDs
**Reason for choosing it:**
- Debugging
- Compliance audit trails
- Performance monitoring
- Error correlation
**Advantages:**
- Observability
- Compliance
- Correlation
**Disadvantages and trade-offs:**
- Log volume
- Storage costs
- PII redaction required
**Security implications:** PII must be redacted from logs
**Scalability implications:** Log volume scales with traffic
**Files affected:**
- `backend/lib/logger.ts`
- `backend/middleware/logging.ts`
**Verification method:**
- Test JSON output
- Test correlation ID propagation
- Test PII redaction
- Test log levels
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-048: Default — Environment Variable Isolation
**Date:** 2026-11-09
**Decision:** Separate frontend (NEXT_PUBLIC_) and backend (SERVER_) environment variables.
**Problem being solved:** Prevent secret leakage to frontend, clear separation.
**Options considered:**
1. **Mixed variables** — Secret leakage risk
2. **Separated by prefix** — Clear separation
3. **Secrets Manager** — Overkill for MVP
**Selected solution:** NEXT_PUBLIC_ for frontend, SERVER_ for backend
**Reason for choosing it:**
- Prevents secret leakage
- Clear convention
- Vercel/Render support
**Advantages:**
- Secret protection
- Clear separation
- Deployment ready
**Disadvantages and trade-offs:**
- Naming convention discipline
- Documentation required
**Security implications:** Critical for secret protection
**Scalability implications:** None
**Files affected:**
- `.env.example`
- `.env.development`
- `backend/lib/config.ts`
- `src/lib/config.ts`
**Verification method:**
- Test frontend doesn't have secrets
- Test backend has secrets
- Test Vercel/Render import
- Test .gitignore
**Status:** ⏳ Pending implementation (Phase 10)

---

## Decision DD-DEC-049: Default — Database Connection Pooling
**Date:** 2026-11-09
**Decision:** Enforce connection pooling with Supabase pooler (transaction mode).
**Problem being solved:** Connection limits, idle connections, scaling.
**Options considered:**
1. **Direct connections** — Limited by max_connections
2. **Application pooling** — Duplication
3. **Supabase pooler** — Managed, transaction mode
**Selected solution:** Supabase connection pooler (transaction mode)
**Reason for choosing it:**
- Managed by Supabase
- No max_connections limit
- Transaction mode works with Prisma
- Scales with backend
**Advantages:**
- No connection limits
- No management overhead
- Scales with backend
**Disadvantages and trade-offs:**
- Transaction mode limitations
- Slight latency
**Security implications:** None
**Scalability implications:** Enables horizontal scaling
**Files affected:**
- `prisma/schema.prisma`
- `backend/lib/database.ts`
**Verification method:**
- Test concurrent connections
- Test transaction boundaries
- Test prepared statement compatibility
**Status:** ⏳ Pending implementation (Phase 3)

---

## Decision DD-DEC-050: Default — Audit Logging Enforcement
**Date:** 2026-11-09
**Decision:** Enforce audit logging for all PHI/PII access and modifications.
**Problem being solved:** Regulatory compliance (HIPAA/GDPR/DPDP), forensic analysis.
**Options considered:**
1. **None** — Non-compliant
2. **Some access** — Incomplete audit
3. **All PHI/PII access** — Comprehensive audit
**Selected solution:** All PHI/PII access and modifications audit logged
**Reason for choosing it:**
- HIPAA audit requirements
- GDPR accountability
- DPDP Act compliance
- Forensic capability
**Advantages:**
- Regulatory compliance
- Forensic capability
- Tamper evidence
**Disadvantages and trade-offs:**
- Storage overhead
- Performance impact
- Complexity
**Security implications:** Critical for compliance
**Scalability implications:** Partitioning by date
**Files affected:**
- `backend/middleware/audit.ts`
- `backend/services/audit.ts`
- `prisma/schema.prisma` (audit_log table)
**Verification method:**
- Test PHI access logged
- Test modification logged
- Test hash chaining
- Test query performance
**Status:** ⏳ Pending implementation (Phase 3)

---

*Total decisions: 50*
*Last updated: 2026-11-09*