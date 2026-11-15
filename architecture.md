# DwaaDekho — System Architecture

---

## System Overview

DwaaDekho is a distributed healthcare marketplace platform connecting patients (buyers), pharmacies, doctors, and administrators. The platform enables medicine discovery, generic substitution comparison, prescription verification, real-time pharmacy offer broadcasting, reservations, order fulfillment, telemedicine consultations, and administrative oversight.

**Core Principles:**
- **Privacy by Design** — Data minimization, purpose limitation, consent management
- **Security by Default** — Zero trust, defense in depth, least privilege
- **Compliance by Architecture** — DPDP Act, GDPR, HIPAA, NMC Telemedicine Guidelines, CDSCO/Drugs & Cosmetics Act
- **Human-in-the-Loop** — AI assists, never decides; medical decisions require qualified professionals
- **Vendor Agnostic Core** — Business logic portable, integrations vendor-specific

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router) + TypeScript + React 19 | Server Components, Streaming SSR, Route Groups, Server Actions |
| **Styling** | Tailwind CSS 4 + Custom Design System | Utility-first, design tokens, dark mode, responsive |
| **UI Components** | Custom Tailwind components (shadcn/ui inspired) | Reusable, accessible, motion primitives |
| **State Management** | TanStack Query (server state) + Zustand (client state) | Caching, invalidation, mutations, UI state |
| **Backend** | Node.js 20 + TypeScript + Express | Modular REST API, middleware, validation, error handling |
| **Database** | Supabase PostgreSQL + Prisma ORM | Managed PostgreSQL, Auth, Realtime, Storage, Edge Functions |
| **ORM** | Prisma 5 | Type-safe queries, migrations, connection pooling |
| **Authentication** | Supabase Auth (JWT) + Custom Middleware | Email/password, social, magic link, OTP, RLS |
| **Realtime** | Supabase Realtime (PostgreSQL logical replication) | Live offers, orders, notifications, chat |
| **File Storage** | Supabase Storage (with virus scanning) | Prescriptions, licenses, documents, images |
| **Payments** | Razorpay (Indian market) | UPI, cards, netbanking, wallets, EMI, test mode |
| **Email** | Brevo (Transactional) | OTP, password reset, order confirmations, notifications |
| **AI** | OpenRouter (Multi-model aggregator) | OCR, interaction checking, decision support (open models for PHI) |
| **Monitoring** | Prometheus + Grafana + Sentry + Pino | Metrics, alerting, error tracking, structured logging |
| **CI/CD** | GitHub Actions | Matrix builds, preview deployments, security scanning |
| **Hosting** | Vercel (Frontend) + Render (Backend) | Edge optimized, full Node.js environment |
| **DNS/SSL** | Cloudflare | DDoS protection, WAF, SSL, caching |
| **Cache** | Redis (server-side) + TanStack Query (client-side) | API response caching, client stale-while-revalidate |
| **Audit** | Append-only audit log with SHA-256 chaining | Immutable compliance logging |

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   ┌─────────────────────────────┐              │
│  ┌──────────────▶ │        VERCEL EDGE          │              │
│  │              │(Next.js 14 App Router)        │              │
│  │              │  • Server Components          │              │
│  │              │  • Streaming SSR              │              │
│  │              │  • Image Optimization         │              │
│  │              │  • Edge Middleware            │              │
│  │              └─────────────┬─────────────────┘              │
│  │                            │ HTTPS                          │
│  │                            │                                │
│  │                    ┌───────▼────────┐                       │
│  │                    │   CLOUDFLARE   │                       │
│  │                    │  • DDoS/WAF    │                       │
│  │                    │  • SSL/TLS     │                       │
│  │                    │  • CDN Assets  │                       │
│  │                    └───────┬───────┘                       │
│  │                            │ HTTPS                          │
│  │                            │                                │
│  │                   ┌────────▼────────┐                       │
│  │                   │   RENDER SERVICE│                       │
│  │                   │  (Node.js/Express) │                   │
│  │                   │  • REST API     │                       │
│  │                   │  • Middleware   │                       │
│  │                   │  • Auth         │                       │
│  │                   │  • Validation   │                       │
│  │                   │  • Rate Limiting│                       │
│  │                   │  • Error Handling│                      │
│  │                   │  • Logging      │                       │
│  │                   │  • AI Services  │                       │
│  │                   │  • Payment      │                       │
│  │                   │  • Email        │                       │
│  │                   │  • Virus Scan   │                       │
│  │                   │  • Audit        │                       │
│  │                   └───────┬────────┘                       │
│  │                            │ PostgreSQL                     │
│  │                            │                                │
│  │                   ┌────────▼────────┐                       │
│  │                   │   SUPABASE      │                       │
│  │                   │  PostgreSQL     │                       │
│  │                   │  • Auth         │                       │
│  │                   │  • Realtime     │                       │
│  │                   │  • Storage      │                       │
│  │                   │  • Edge Func    │                       │
│  │                   │  • RLS Policies │                       │
│  │                   │  • Backups      │                       │
│  │                   │  • PITR         │                       │
│  │                   └────────┬────────┘                       │
│  │                            │ Redis                          │
│  │                            │                                │
│  │                   ┌────────▼────────┐                       │
│  │                   │    REDIS        │                       │
│  │                   │  • Rate Limit   │                       │
│  │                   │  • Cache        │                       │
│  │                   │  • Session      │                       │
│  │                   │  • Pub/Sub      │                       │
│  │                   └────────┬────────┘                       │
│  │                            │                                │
│  │                    ┌──────▼───────┐                         │
│  │  ┌──────────────▶ │   VIRUS SCAN   │                        │
│  │  │              │  (ClamAV)        │                        │
│  │  │              └──────┬────────┘                         │
│  │  │                     │                                  │
│  │  │                 ┌───▼───┐                              │
│  │  │                 │ RAZOR-│                              │
│  │  │                 │  PAY  │                              │
│  │  │                 │       │                              │
│  │  │                 └───┬───┘                              │
│  │  │                     │                                  │
│  │  │                 ┌───▼───┐                              │
│  │  │                 │ BREVO │                              │
│  │  │                 │ EMAIL │                              │
│  │  │                 └───┬───┘                              │
│  │  │                     │                                  │
│  │  │                 ┌───▼───┐                              │
│  │  │                 │OPENROUTER│                           │
│  │  │                 │  AI    │                              │
│  │  │                 └───────┘                              │
│  │  │                                                   │
│  └──┴───────────────────────────────────────────────────┘
│  Client Apps     Browsers / Mobile                      │
│  (Web, PWA, iOS, Android)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Next.js 14 App Router Structure
```
src/
├── app/                    # App Router (route-based)
│   ├── (dashboard)/        # Authenticated routes (layout)
│   │   ├── layout.tsx      # Dashboard layout (sidebar, header)
│   │   ├── dashboard/      # Overview page
│   │   ├── medicines/      # Medicine search & detail
│   │   ├── pharmacy/       # Pharmacy locator & offers
│   │   ├── prescription/   # Upload, validation, broadcast
│   │   ├── cart/           # Cart, checkout, order history
│   │   ├── reminder/       # Pill reminders
│   │   ├── chat/           # Doctor consultation
│   │   └── profile/        # User settings
│   ├── (auth)/             # Public auth routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify/
│   │   └── reset/
│   ├── api/                # Server Actions (Next.js 14)
│   │   ├── medicine/
│   │   ├── pharmacy/
│   │   ├── prescription/
│   │   └── order/
│   ├── (i18n)/             # Localized routes (en, hi)
│   │   ├── [locale]/
│   │   │   └── ...
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   ├── page.tsx            # Home page
│   ├── not-found.tsx       # 404
│   ├── error.tsx           # 500
│   ├── loading.tsx         # Suspense boundaries
│   └── globals.css         # Tailwind base
├── components/             # Reusable UI components
│   ├── ui/                 # Primitive components (Button, Input, etc.)
│   ├── layout/             # Layout components (Header, Footer, Sidebar)
│   ├── features/           # Feature-specific components
│   │   ├── medicine/
│   │   ├── pharmacy/
│   │   ├── prescription/
│   │   ├── order/
│   │   ├── chat/
│   │   └── reminder/
│   ├── hooks/              # Custom hooks
│   │   ├── useQuery.ts
│   │   ├── useMutation.ts
│   │   ├── useAuth.ts
│   │   ├── useRealtime.ts
│   │   └── useToast.ts
│   └── lib/                # Utilities
├── lib/                    # Shared libraries
│   ├── api-client.ts       # Generated from OpenAPI
│   ├── query-client.ts     # TanStack Query configuration
│   ├── store.ts            # Zustand stores
│   ├── auth.ts             # Auth helpers
│   ├── realtime.ts         # Supabase Realtime subscriptions
│   ├── storage.ts          # Supabase Storage helpers
│   ├── payment.ts          # Razorpay integration
│   ├── ai.ts               # OpenRouter integration
│   ├── i18n.ts             # next-intl configuration
│   ├── validation.ts       # Zod schemas
│   ├── accesskeys the dashboard          
           │   ├── orders/
           │   ├── users/
           │   └── settings/
           │
           ├── api/                 # Server Actions
           │   ├── pharmacy/
           │   ├── broadcast/
           │   └── order/
           │
           ├── layout.tsx           # Admin layout
           ├── page.tsx             # Dashboard
           └── not-found.tsx        │
                                   │
    └── lib/                       # Shared libraries
        ├── api-client.ts
        ├── query-client.ts
        ├── store.ts
        ├── auth.ts
        ├── realtime.ts
        ├── storage.ts
        └── validation.ts
```

---

## Backend Architecture

### Express Modular Structure
```
backend/
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # HTTP server
│   │
│   ├── config/               # Configuration
│   │   ├── database.ts       # Prisma client + Supabase pooler
│   │   ├── redis.ts          # Redis client
│   │   ├── logger.ts         # Pino logger
│   │   ├── sentry.ts         # Sentry initialization
│   │   └── env.ts            # Environment variables
│   │
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts           # JWT validation + RLS context
│   │   ├── validation.ts     # Zod validation middleware
│   │   ├── rate-limit.ts     # Redis-backed rate limiting
│   │   ├── logging.ts        # Request logging + correlation ID
│   │   ├── security.ts       # Helmet + CSP + security headers
│   │   ├── cors.ts           # Strict origin validation
│   │   ├── error-handler.ts  # Centralized error handling
│   │   ├── audit.ts          # Audit logging
│   │   └── compression.ts    # Compression middleware
│   │
│   ├── routes/               # API routes (versioned)
│   │   ├── v1/               # Version 1
│   │   │   ├── auth/         # Auth endpoints
│   │   │   ├── medicine/     # Medicine search, detail
│   │   │   ├── pharmacy/     # Pharmacy management
│   │   │   ├── prescription/ # Prescription validation
│   │   │   ├── broadcast/    # Broadcast requests
│   │   │   ├── offer/        # Pharmacy offers
│   │   │   ├── reservation/  # Stock reservations
│   │   │   ├── order/        # Order management
│   │   │   ├── payment/      # Razorpay integration
│   │   │   ├── chat/         # Doctor consultation
│   │   │   ├── ai/           # AI services
│   │   │   ├── admin/        # Admin endpoints
│   │   │   └── health/       # Health checks
│   │   └── v2/               # Future version
│   │
│   ├── services/             # Business logic layer
│   │   ├── medicine.service.ts
│   │   ├── pharmacy.service.ts
│   │   ├── prescription.service.ts
│   │   ├── broadcast.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── email.service.ts
│   │   ├── ai.service.ts
│   │   ├── storage.service.ts
│   │   ├── virus-scan.service.ts
│   │   ├── audit.service.ts
│   │   └── redis.service.ts
│   │
│   ├── lib/                  # Libraries
│   │   ├── database.ts       # Prisma client wrapper
│   │   ├── redis.ts          # Redis wrapper
│   │   ├── logger.ts         # Pino wrapper
│   │   ├── sentry.ts         # Sentry wrapper
│   │   ├── errors.ts         # Custom error classes
│   │   ├── validation.ts     # Zod schemas (shared with frontend)
│   │   └── auth.ts           # JWT helpers
│   │
│   ├── workers/              # BullMQ workers
│   │   ├── email.worker.ts
│   │   ├── notification.worker.ts
│   │   └── ai.worker.ts
│   │
│   ├── webhooks/             # External webhooks
│   │   ├── razorpay.ts
│   │   ├── supabase-realtime.ts
│   │   └── upload.ts
│   │
│   ├── migrations/           # Prisma migrations
│   └── seeds/                # Database seed scripts
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
│
├── tests/                    # Vitest tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── .env.example              # Environment template
```

---

## Database Architecture

### Supabase PostgreSQL with Prisma ORM

#### Core Entities (ER Model)

```
┌─────────────────────┐    ┌─────────────────────┐
│       User          │    │     UserProfile     │
│  id (PK)            │    │ id (PK)             │
│  email              │    │ user_id (FK)        │
│  role (buyer/pharmacy│    │ phone               │
│  │   doctor/admin)   │    │ address             │
│  created_at         │    │ verified_at         │
│  updated_at         │    │ metadata            │
└────────────┬────────┘    └─────────────┬───────┘
             │                         │
             │1                        │1
             ▼                         ▼
┌─────────────────────┐    ┌─────────────────────┐
│    BuyerProfile     │    │    Pharmacy         │
│  user_id (PK, FK)   │    │ id (PK)             │
│  dob                │    │ user_id (FK)        │
│  gender             │    │ name                │
│  blood_group        │    │ license_number      │
│  allergies          │    │ license_document    │
│  chronic_conditions │    │ pharmacist_id (FK)  │
└────────────┬────────┘    │ latitude            │
             │             │ longitude           │
             │             │ address             │
             │             │ is_jan_aushadhi     │
             │             │ rating              │
             │             └──────────┬──────────┘
             │                        │
             │1                       │1
             ▼                        ▼
┌─────────────────────┐    ┌─────────────────────┐
│    Medicine         │    │   MedicineBrand     │
│  id (PK)            │    │ id (PK)             │
│  generic_name       │    │ brand_name          │
│  strength           │    │ manufacturer        │
│  dosage_form        │    │ mlp                 │
│  category           │    │ mrp                 │
│  schedule_drug      │    │ requires_prescription│
│  sal_engineers       │    │ active_ingredient   │
│  cdSCO_approved     │    │ brand ↔ generic ↔ medicine
│  side_effects       │    │    (Many-to-Many)   
│  uses               │    │
│  safety_advice      │    │
│  in_stock           │    │
│  created_at         │    │
└────────────┬────────┘    └──────────────┬──────┘
             │                         │
             │N                        │N
             ▼                         ▼
┌─────────────────────┐    ┌─────────────────────┐
│  BroadcastRequest   │    │    PharmacyOffer    │
│  id (PK)            │    │ id (PK)             │
│  buyer_id (FK)      │    │ broadcast_id (FK)   │
│  medicine_id (FK)   │    │ pharmacy_id (FK)    │
│  dosage             │    │ price               │
│  quantity           │    │ quantity_available  │
│  broadcast_at       │    │ offer_at            │
│  expires_at         │    │ expires_at          │
│  status             │    │ status              │
│  └──────┬──────────┘    │ └──────┬──────────┘
          │                 │
          │1                │1
          ▼                 ▼
┌─────────────────────┐    ┌─────────────────────┐
│   Reservation       │    │       Order         │
│  id (PK)            │    │ id (PK)             │
│  offer_id (FK)      │    │ offer_id (FK)       │
│  buyer_id (FK)      │    │ buyer_id (FK)       │
│  pharmacy_id (FK)   │    │ pharmacy_id (FK)    │
│  pin (4-digit)      │    │ order_number        │
│  reserved_at        │    │ status              │
│  expires_at         │    │ placed_at           │
│  status             │    │ confirmed_at        │
│  └──────┬──────────┘    │ delivered_at        │
          │                 │ cancelled_at        │
          │1                │ payment_id          │
          ▼                 │ invoice_number      │
┌─────────────────────┐    │ total_amount        │
│   Prescription      │    │ gst_amount          │
│  id (PK)            │    │ created_at          │
│  user_id (FK)       │    │ updated_at          │
│  doctor_id (FK)     │    │
│  file_url           │    │
│  ocr_text           │    │
│  validated_at       │    │
│  expires_at         │    │
└────────────┬────────┘    └──────────────┬──────┘
             │                         │
             │1                        │1
             ▼                         ▼
┌─────────────────────┐    ┌─────────────────────┐
│   Consultation      │    │      ChatMessage    │
│  id (PK)            │    │ id (PK)             │
│  doctor_id (FK)     │    │ consultation_id (FK)│
│  patient_id (FK)    │    │ sender_id (FK)      │
│  scheduled_at       │    │ message             │
│  duration           │    │ sent_at             │
│  status             │    │ read_at             │
│  notes              │    │
│  └──────┬──────────┘    └──────────────┬──────┘
          │                              │
          │1                             │1
          ▼                              ▼
┌─────────────────────┐    ┌─────────────────────┐
│    Review           │    │      AuditLog       │
│  id (PK)            │    │ id (PK)             │
│  pharmacy_id (FK)   │    │ user_id (FK)        │
│  buyer_id (FK)      │    │ action              │
│  rating             │    │ table_name          │
│  comment            │    │ record_id           │
│  created_at         │    │ changes             │
│  └──────┬──────────┘    │ ip_address          │
          │               │ user_agent          │
          │1              │ created_at          │
          ▼               └──────────────┬──────┘
┌─────────────────────┐                     │
│   Document          │                     │
│  id (PK)            │                     │
│  user_id (FK)       │                     │
│  file_url           │                     │
│  file_type          │                     │
│  is_verified        │                     │
│  virus_scanned      │                     │
│  uploaded_at        │                     │
└─────────────────────┘                     │
                                             │
┌─────────────────────┐                     │
│    ConsentRecord    │                     │
│  id (PK)            │                     │
│  user_id (FK)       │                     │
│  purpose            │                     │
│  granted_at         │                     │
│  withdrawn_at       │                     │
└─────────────────────┘                     │
                                             │
┌─────────────────────┐                     │
│   RegulatoryRule    │                     │
│  id (PK)            │                     │
│  medicine_id (FK)   │                     │
│  schedule_drug      │                     │
│  max_quantity       │                     │
│  prescription_req   │                     │
│  created_at         │                     │
│  updated_at         │                     │
└─────────────────────┘                     │
                                             │
┌─────────────────────┐                     │
│   Notification      │                     │
│  id (PK)            │                     │
│  user_id (FK)       │                     │
│  type               │                     │
│  title              │                     │
│  body               │                     │
│  read_at            │                     │
│  created_at         │                     │
└─────────────────────┘                     │
                                             │
```

#### Indexing Strategy

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| User | idx_user_email | Unique | Email lookup |
| User | idx_user_role | B-tree | Role-based queries |
| Medicine | idx_medicine_generic | B-tree | Generic search |
| Medicine | idx_medicine_category | B-tree | Category filter |
| Medicine | idx_medicine_schedule | B-tree | Schedule drug filter |
| Medicine | idx_medicine_gin_tags | GIN | Tag full-text search |
| Medicine | idx_medicine_gin_search | GIN | Name/generic full-text |
| BroadcastRequest | idx_broadcast_buyer | B-tree | Buyer broadcasts |
| BroadcastRequest | idx_broadcast_expires | B-tree | Expiry cleanup |
| PharmacyOffer | idx_offer_broadcast | B-tree | Offer listing |
| PharmacyOffer | idx_offer_pharmacy | B-tree | Pharmacy offers |
| PharmacyOffer | idx_offer_expires | B-tree | Offer expiry |
| Reservation | idx_reservation_offer | Unique | One reservation per offer |
| Reservation | idx_reservation_buyer | B-tree | Buyer reservations |
| Reservation | idx_reservation_pin | Unique | PIN lookup |
| Order | idx_order_buyer | B-tree | Buyer orders |
| Order | idx_order_pharmacy | B-tree | Pharmacy orders |
| Order | idx_order_status | B-tree | Status filtering |
| Prescription | idx_prescription_user | B-tree | User prescriptions |
| Prescription | idx_prescription_doctor | B-tree | Doctor prescriptions |
| Prescription | idx_prescription_expires | B-tree | Expiry cleanup |
| Consultation | idx_consultation_doctor | B-tree | Doctor consultations |
| Consultation | idx_consultation_patient | B-tree | Patient consultations |
| AuditLog | idx_audit_user | B-tree | User audit trail |
| AuditLog | idx_audit_table | B-tree | Table audit trail |
| AuditLog | idx_audit_created | B-tree | Time-based cleanup |
| Document | idx_document_user | B-tree | User documents |
| Document | idx_document_verified | B-tree | Verified documents |
| RegulatoryRule | idx_rule_medicine | Unique | Rule per medicine |
| Notification | idx_notification_user | B-tree | User notifications |
| Notification | idx_notification_read | B-tree | Unread count |

#### Partitioning Strategy

- **AuditLog** — Partitioned by month (retention 7 years)
- **Notification** — Partitioned by month (retention 2 years)
- **Consultation** — Partitioned by month (retention 10 years)
- **Order** — Partitioned by month (retention 10 years)
- **ChatMessage** — Partitioned by month (retention 5 years)

---

## Authentication Architecture

### Supabase Auth + Custom Middleware

```
Flow:
1. User authenticates via Supabase Auth (email/password, social, magic link, OTP)
2. Supabase issues JWT (access token: 1h, refresh token: 7d)
3. Frontend stores tokens in httpOnly cookies (SSR) or localStorage (CSR)
4. Backend middleware validates JWT:
   - Signature verification (RS256)
   - Expiration check
   - Audience validation
   - Issuer validation
   - JWKS rotation
5. Middleware attaches user context to request
6. Prisma client uses user context for RLS policies
7. Row Level Security enforced at database level
```

#### JWT Claims
- `sub` — User ID (UUID)
- `email` — User email
- `role` — User role (buyer, pharmacy, doctor, admin)
- `aud` — Authenticated
- `iss` — Supabase project URL
- `exp` — Expiration
- `iat` — Issued at
- `app_metadata` — Provider info
- `user_metadata` — Custom metadata (phone, address, etc.)

#### Row Level Security Policies
```
-- Users table
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Medicine table (public read, admin write)
CREATE POLICY "Public can view medicines" ON medicines
FOR SELECT USING (true);

CREATE POLICY "Admins can modify medicines" ON medicines
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Broadcast requests (buyer owns)
CREATE POLICY "Buyer owns broadcast" ON broadcast_requests
FOR ALL USING (auth.uid() = buyer_id);

-- Pharmacy offers (pharmacy owns)
CREATE POLICY "Pharmacy owns offer" ON pharmacy_offers
FOR ALL USING (auth.uid() = pharmacy_id);

-- Orders (buyer or pharmacy)
CREATE POLICY "User owns order" ON orders
FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = pharmacy_id);

-- Prescriptions (user or doctor)
CREATE POLICY "User/Doctor owns prescription" ON prescriptions
FOR SELECT USING (auth.uid() = user_id OR auth.uid() = doctor_id);

-- Audit logs (admin only)
CREATE POLICY "Admin only audit logs" ON audit_logs
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

---

## Authorization Architecture

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Buyer** | Search medicines, upload prescriptions, create broadcast requests, view offers, reserve stock, place orders, view order history, pill reminders, doctor consultations |
| **Pharmacy** | View broadcast requests, submit offers, manage stock, verify PINs, complete orders, view order history, analytics |
| **Doctor** | Manage profile, view consultations, send prescriptions, schedule appointments, view patient history |
| **Admin** | Manage users, verify pharmacies, verify doctors, manage medicines, manage regulatory rules, audit logs, disputes, analytics |

### Permission Matrix
```
Action                      Buyer  Pharmacy  Doctor  Admin
----------------------------------------------------------------
search_medicines            ✓      ✓         ✓       ✓
view_medicine_details       ✓      ✓         ✓       ✓
upload_prescription         ✓      ✗         ✗       ✓
create_broadcast            ✓      ✗         ✗       ✓
view_broadcast_requests     ✗      ✓         ✗       ✓
submit_offer                ✗      ✓         ✗       ✓
reserve_stock               ✓      ✗         ✗       ✓
place_order                 ✓      ✗         ✗       ✓
view_order_history          ✓      ✓         ✗       ✓
verify_pin                  ✗      ✓         ✗       ✓
complete_order              ✗      ✓         ✗       ✓
create_consultation         ✓      ✗         ✓       ✓
join_consultation           ✓      ✗         ✓       ✓
manage_profile              ✓      ✓         ✓       ✓
view_analytics              ✗      ✓         ✗       ✓
manage_pharmacies           ✗      ✗         ✗       ✓
manage_doctors              ✗      ✗         ✗       ✓
manage_medicines            ✗      ✗         ✗       ✓
manage_regulatory_rules     ✗      ✗         ✗       ✓
view_audit_logs             ✗      ✗         ✗       ✓
```

---

## API Design Conventions

### REST API Standards
- **Versioning** — URL versioning (`/api/v1/...`)
- **HTTP Methods** — GET (read), POST (create), PUT/PATCH (update), DELETE (delete)
- **Status Codes** — 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 422 (Unprocessable Entity), 429 (Too Many Requests), 500 (Internal Server Error)
- **Response Format** — `{ success: boolean, data: any, error: { code: string, message: string } }`
- **Pagination** — Cursor-based (limit, cursor) for large datasets
- **Sorting** — `sort=field:asc,field2:desc`
- **Filtering** — `filter[field]=value` or `filter[field][gte]=value`
- **Field Selection** — `fields=field1,field2,field3`
- **Expansion** — `expand=relation1,relation2`

### Error Response Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "code": "invalid_email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

### Success Response Format
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "created_at": "2026-11-09T10:00:00Z"
  },
  "error": null
}
```

### Pagination Response Format
```json
{
  "success": true,
  "data": [
    { "id": "...", "name": "..." },
    { "id": "...", "name": "..." }
  ],
  "meta": {
    "count": 2,
    "has_next_page": true,
    "next_cursor": "abc123"
  },
  "error": null
}
```

---

## Error Handling Conventions

### Custom Error Classes
```typescript
class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any[]
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class ValidationError extends AppError {
  constructor(message: string, details: any[] = []) {
    super('VALIDATION_ERROR', message, 422, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super('NOT_FOUND', message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super('CONFLICT', message, 409);
  }
}

class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super('RATE_LIMIT_EXCEEDED', message, 429);
  }
}
```

### Centralized Error Middleware
```typescript
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  // Log error with correlation ID
  logger.error(err, { 
    correlationId: req.headers['x-correlation-id'],
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });
  
  // Don't leak stack traces in production
  if (process.env.NODE_ENV === 'production') {
    err.stack = undefined;
  }
  
  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: err.code,
      message: err.message,
      details: err.details
    }
  });
});
```

---

## State Management Strategy

### TanStack Query (Server State)
- **Cache Time** — 5 minutes (stale-while-revalidate)
- **Background Refetch** — Window focus, network reconnect, interval
- **Pagination** — Cursor-based with `getNextPageParam`
- **Infinite Scroll** — `useInfiniteQuery`
- **Mutations** — Optimistic updates, rollback on error
- **Query Keys** — Structured arrays (`['medicines', 'search', query]`)
- **Invalidation** — `invalidateQueries` on mutations

### Zustand (Client State)
- **Auth State** — User, tokens, permissions
- **UI State** — Sidebar open, modal state, toast queue
- **Form State** — Form values, errors, touched fields
- **Realtime State** — Live offers, order status, notifications
- **Persisted State** — Cart (localStorage), preferences

---

## Real-time Communication Architecture

### Supabase Realtime Subscriptions
```typescript
// Buyer: Subscribe to offers for their broadcast
const broadcastChannel = supabase
  .channel('broadcast-offers')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'pharmacy_offers',
      filter: 'broadcast_id=eq.' + broadcastId
    },
    (payload) => {
      // Update UI with new offer
      queryClient.setQueryData(['offers', broadcastId], (old) => [
        ...(old || []),
        payload.new
      ]);
    }
  )
  .subscribe();

// Pharmacy: Subscribe to broadcast requests in radius
const radiusChannel = supabase
  .channel('nearby-broadcasts')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'broadcast_requests',
      filter: 'latitude=gt.' + (lat - 0.1) + ' AND latitude=lt.' + (lat + 0.1) +
              ' AND longitude=gt.' + (lng - 0.1) + ' AND longitude=lt.' + (lng + 0.1)
    },
    (payload) => {
      // Show new broadcast in UI
      toast.success('New broadcast request nearby');
    }
  )
  .subscribe();

// Admin: Subscribe to audit logs
const auditChannel = supabase
  .channel('audit-logs')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'audit_logs'
    },
    (payload) => {
      // Update admin dashboard
    }
  )
  .subscribe();
```

### Connection Management
- **Automatic Reconnection** — Built-in
- **Heartbeat** — 30 seconds
- **Max Connections** — 100 per instance (configurable)
- **Fallback** — Polling every 30 seconds if realtime fails

---

## Security Architecture

### Defense in Depth Layers

1. **Network Layer** — Cloudflare WAF, DDoS protection, rate limiting
2. **Transport Layer** — TLS 1.3, HSTS, Perfect Forward Secrecy
3. **Application Layer** — Input validation, authentication, authorization
4. **Database Layer** — Row Level Security, parameterized queries, connection pooling
5. **Data Layer** — Encryption at rest, field-level encryption for PHI
6. **Audit Layer** — Immutable audit logs, hash chaining
7. **Monitoring Layer** — Anomaly detection, alerting, SIEM integration

### Critical Security Controls

#### Authentication
- JWT signature verification (RS256)
- Refresh token rotation (one-time use)
- Short-lived access tokens (15-30 minutes)
- httpOnly, Secure, SameSite cookies
- Account lockout after 5 failed attempts
- CAPTCHA on login/register

#### Authorization
- Row Level Security enforced at database level
- Middleware checks permissions before controller
- Least privilege principle
- Admin-only endpoints require 2FA

#### Input Validation
- Zod schemas for all inputs
- Sanitization (DOMPurify for HTML)
- TypeScript inference
- Custom refinements (email, phone, INR, date, UUID)

#### Output Encoding
- JSON responses (no HTML)
- CSP header (script-src 'self')
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin

#### Secrets Management
- Environment variables (never in repo)
- Vault/Secrets Manager for production
- .gitignore for .env files
- Secret scanning in CI

#### Data Protection
- Encryption at rest (Supabase managed)
- Field-level encryption for PHI (AES-256-GCM)
- Data minimization (collect only necessary)
- Purpose limitation (explicit consent)
- Retention policies (auto-delete after compliance period)

#### API Security
- Rate limiting (per-IP + per-user)
- Request size limits
- Timeout limits
- CORS allowlist (no wildcards)
- Security headers (Helmet + custom CSP)
- Compression (filter sensitive responses)

---

## Error Handling & Logging

### Structured Logging (Pino)
```typescript
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  },
  base: { pid: process.pid },
  redact: {
    paths: ['req.headers.authorization', 'req.body.password', 'req.body.token'],
    censor: '[REDACTED]'
  }
});

// Request logging middleware
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  req.correlationId = correlationId;
  
  logger.info({
    correlationId,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });
  
  res.on('finish', () => {
    logger.info({
      correlationId,
      statusCode: res.statusCode,
      responseTime: Date.now() - startTime
    });
  });
  
  next();
});
```

### Error Tracking (Sentry)
```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  attachStacktrace: true,
  beforeSend: (event) => {
    // Scrub PHI/PII
    if (event.request?.data) {
      event.request.data = scrubPII(event.request.data);
    }
    return event;
  }
});
```

---

## Monitoring & Observability

### Prometheus Metrics
- **HTTP Requests** — Duration, count, status codes
- **Database Queries** — Duration, count, slow queries
- **External APIs** — Duration, count, error rates
- **Cache** — Hit/miss ratio, latency
- **Business Metrics** — Active users, broadcasts, offers, orders
- **System** — CPU, memory, disk, network

### Sentry Error Tracking
- Error grouping by fingerprint
- Breadcrumbs (network, console, user interactions)
- Release tracking (Git commit SHA)
- Performance monitoring
- User context (anonymized)

### Health Checks
- **Liveness** — `GET /health/live` (process running)
- **Readiness** — `GET /health/ready` (DB, Redis, external deps)
- **Startup** — `GET /health/startup` (cold start)

---

## Deployment Architecture

### Vercel (Frontend)
- **Edge Runtime** — Next.js 14 Server Components
- **ISR** — Incremental Static Regeneration
- **Image Optimization** — Built-in
- **Middleware** — Auth, redirects, security headers
- **Preview Deployments** — Per PR
- **Environment Variables** — Vercel dashboard

### Render (Backend)
- **Full Node.js Environment** — No cold starts
- **Persistent Disk** — Uploads, logs
- **Auto-scaling** — Based on CPU/memory
- **Preview Deployments** — Per branch
- **Environment Variables** — Render dashboard

### Supabase
- **PostgreSQL** — Managed, backups, PITR
- **Auth** — Managed, RLS, Realtime
- **Storage** — Managed, CDN, signed URLs
- **Edge Functions** — Serverless (TypeScript)
- **Pricing** — Free tier for MVP

### Cloudflare
- **DNS** — Managed
- **SSL** — Universal, free
- **WAF** — Managed rules, custom rules
- **Rate Limiting** — Per IP
- **CDN** — Static assets caching

### Redis
- **Managed** — Upstash Redis or Render Redis
- **Clustering** — Horizontal scaling
- **Persistence** — AOF + RDB
- **Replication** — Master-replica

---

## Scaling Considerations

### Horizontal Scaling
- **Frontend** — Vercel auto-scales edge
- **Backend** — Render auto-scales services
- **Database** — Supabase read replicas, connection pooler
- **Redis** — Cluster mode
- **Workers** — BullMQ with multiple workers

### Vertical Scaling
- **Database** — Upgrade Supabase plan
- **Backend** — Upgrade Render plan
- **Redis** — Upgrade plan

### Caching Strategy
- **CDN** — Static assets, ISR pages
- **Redis** — API responses, sessions, rate limiting
- **Client** — TanStack Query, localStorage (cart)
- **Browser** — Cache-Control headers

### Database Optimization
- **Indexes** — Composite, partial, GIN
- **Partitioning** — Time-based for large tables
- **Connection Pooling** — Supabase pooler (transaction mode)
- **Query Optimization** — EXPLAIN ANALYZE, index hints
- **Archiving** — Move old data to cold storage

---

## File Storage Architecture

### Supabase Storage Buckets
| Bucket | Public | Max Size | Allowed Types | Virus Scan |
|--------|--------|----------|---------------|------------|
| prescriptions | Private | 10MB | PDF, JPG, PNG | ✓ |
| licenses | Private | 5MB | PDF, JPG, PNG | ✓ |
| documents | Private | 20MB | PDF, DOCX | ✓ |
| profile_images | Public | 2MB | JPG, PNG, WEBP | ✗ |
| medicine_images | Public | 2MB | JPG, PNG, WEBP | ✗ |

### Virus Scanning
- **ClamAV** — Open source, signature updates
- **Integration** — Webhook on upload
- **Quarantine** — Infected files moved to quarantine bucket
- **Notification** — Alert admin on infection

### Signed URLs
- **Expiration** — 15 minutes (download), 1 hour (upload)
- **Permissions** — Inherit from bucket RLS
- **Caching** — CDN edge caching with cache-busting

---

## Payment Architecture

### Razorpay Integration
```
Flow:
1. Frontend creates order via backend (amount, currency, receipt)
2. Backend calls Razorpay API (server-to-server)
3. Razorpay returns order_id
4. Frontend opens Razorpay Checkout with order_id
5. User pays via UPI/card/netbanking/wallet
6. Razorpay redirects to success/failure
7. Razorpay sends webhook to backend
8. Backend verifies webhook signature
9. Backend updates order status
10. Frontend polls order status
```

### Security
- **Webhook Signature** — HMAC SHA256 verification
- **No Card Data** — Never touch card data (PCI DSS)
- **Test Mode** — Fake card numbers for testing
- **Idempotency** — Idempotency keys for retries
- **Refunds** — Partial/full refunds supported

---

## Email Architecture

### Brevo Integration
```
Flow:
1. Backend calls Brevo API
2. Brevo sends email via SMTP/API
3. Brevo returns message_id
4. Backend stores message_id in DB
5. Webhooks track delivery/open/click/bounce
```

### Templates
- **Transactional** — OTP, password reset, order confirmation
- **Marketing** — Newsletters, promotions (optional)
- **Variables** — User name, order details, medicine details

### Deliverability
- **SPF/DKIM/DMARC** — Configured
- **IP Warming** — Gradual volume increase
- **Bounce Handling** — Remove invalid emails
- **Unsubscribe** — One-click unsubscribe

---

## AI Architecture

### OpenRouter Integration
```
Flow:
1. User uploads prescription (image)
2. Frontend sends to backend (presigned URL)
3. Backend calls OpenRouter API (server-to-server)
4. OpenRouter routes to model (Llama/Mistral for PHI)
5. Backend returns OCR text + confidence
6. Frontend shows to pharmacist/doctor for verification
7. Human validates and approves
```

### Model Selection
- **PHI Data** — Open models (Llama 3, Mistral) — self-hosted option
- **Non-PHI** — Closed models (GPT-4, Claude) — better quality
- **Fallback** — Route to cheapest capable model
- **Rate Limits** — Fallback mechanism

### Security
- **PHI Never Leaves** — Only open models for PHI
- **Audit Logs** — All AI requests logged
- **Human-in-the-loop** — No AI output shown without verification
- **Data Minimization** — Send only necessary data

---

## Compliance Architecture

### DPDP Act / GDPR / HIPAA
| Requirement | Implementation |
|-------------|----------------|
| Data Minimization | Collect only necessary fields |
| Purpose Limitation | Explicit consent per purpose |
| Consent Management | Granular consent records |
| Right to Access | Export user data API |
| Right to Erasure | Delete user data (with audit) |
| Data Portability | Export in JSON/CSV |
| Breach Notification | 72-hour notification |
| DPO | Designated Data Protection Officer |
| DPIA | Data Protection Impact Assessment |

### NMC Telemedicine Guidelines
- Doctor verification mandatory
- Prescription standards followed
- Consent for telemedicine
- Medical records maintained
- No autonomous diagnosis

### CDSCO / Drugs & Cosmetics Act
- Schedule drug validation
- Prescription validation
- Quantity limits
- Jan Aushadhi verification
- QR code verification (educational)

---

## Backup & Disaster Recovery

### Supabase Backups
- **Automated** — Daily full backups
- **Retention** — 30 days (configurable)
- **PITR** — Point-in-time recovery
- **Encryption** — At rest and in transit

### Manual Backups
- **Monthly** — Full dump to cold storage
- **Verification** — Restore test quarterly
- **Encryption** — AES-256-GCM

### Recovery Time Objectives
- **RPO** — 1 hour (transaction log shipping)
- **RTO** — 2 hours (restore from backup)

---

## Development Workflow

### Git Workflow
- **main** — Production
- **staging** — Staging environment
- **develop** — Development
- **feature/*** — Feature branches
- **bugfix/*** — Bug fix branches
- **release/*** — Release branches

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
on:
  pull_request:
    branches: [main, staging, develop]
  push:
    branches: [main, staging, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
      - name: Security Scan
        uses: github/codeql-action/analyze@v3
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Frontend
        uses: amondnet/vercel-action@v20
      - name: Deploy Backend
        uses: render-deploy-action@v1
```

---

## Quality Gates

### Code Quality
- **ESLint** — Airbnb + TypeScript rules
- **Prettier** — Code formatting
- **TypeScript** — Strict mode, noImplicitAny
- **SonarQube** — Code coverage, duplication, bugs
- **Dependabot** — Dependency updates

### Testing
- **Unit** — Vitest (backend), Jest + RTL (frontend)
- **Integration** — API contracts, database transactions
- **E2E** — Playwright (critical flows)
- **Coverage** — > 80% overall
- **Mutation** — Stryker (optional)

### Performance
- **Lighthouse** — FCP < 1.5s, LCP < 2.5s, CLS < 0.1, TBT < 150ms
- **Bundle Size** — < 100KB gzipped (initial)
- **TTFB** — < 200ms
- **FCP** — < 1.5s

### Security
- **SAST** — CodeQL, Bandit
- **DAST** — OWASP ZAP
- **Dependency Scan** — npm audit, Snyk
- **Secret Scan** — GitHub Secret Scanning
- **Penetration Test** — Annual third-party

---

## Environment Configuration

### .env.example
```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# Prisma
DATABASE_URL=
DIRECT_URL=

# Redis
REDIS_URL=

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Email
BREVO_API_KEY=
BREVO_FROM_EMAIL=
BREVO_FROM_NAME=

# AI
OPENROUTER_API_KEY=
OPENROUTER_MODEL=mistralai/mistral-7b-instruct

# Cloudflare
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ZONE_ID=

# Monitoring
SENTRY_DSN=
SENTRY_ENVIRONMENT=

# App
NEXT_PUBLIC_APP_URL=
API_BASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Environment Separation
- **Development** — `.env.development` (mock services)
- **Staging** — `.env.staging` (real services, test data)
- **Production** — `.env.production` (real services, real data)
- **Never commit** — `.env.*` files
- **Template** — `.env.example`

---

*Document Version: 1.0*
*Last Updated: 2026-11-09*
*Next Review: 2026-12-09*