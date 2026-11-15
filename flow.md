# DwaaDekho — Execution Flow Documentation

---

## Overview

This document describes the actual execution flow through the current codebase (Phase 1 prototype). This is not a proposed architecture — it reflects the real implementation paths in the existing code.

---

## Application Entry Points

### Frontend Entry Point
```
1. index.html (served by Vite dev server)
   └── <script type="module" src="/src/main.jsx"></script>
2. src/main.jsx
   └── ReactDOM.createRoot(document.getElementById('root')).render(<App />)
3. src/App.jsx
   └── Main application component with all features
```

### Backend Entry Point
```
1. backend/server.js
   └── Node.js process entry point
2. Express app initialization
   └── app.use(cors())
   └── app.use(express.json())
3. API Routes
   └── GET /api/medicines
   └── GET /api/medicines/:id
4. Server listen
   └── app.listen(PORT, callback)
```

---

## Execution Lifecycle

### Application Startup (Current Prototype)
```
1. npm run dev (frontend) → Vite dev server starts
2. npm run dev (backend) → Nodemon starts server.js
3. Frontend loads index.html → React hydrates App.jsx
4. Backend initializes Express → CORS middleware → JSON middleware
5. Backend loads medicines.js data → In-memory array
6. Server listens on port 5000
7. Frontend proxies /api requests to backend:5000
```

### Request Lifecycle (Current Prototype)
```
Client → Vite Dev Server → [If /api] → Proxy → Express Middleware → Route Handler → Response
```

---

## Function Call Relationships (Current Implementation)

### 1. Medicine Search Flow
```
Frontend UI (SearchSection.jsx)
    → useEffect → fetch(`/api/medicines?q=...`)
    → Proxy to Backend
    → backend/server.js:12-22 (GET /api/medicines)
        → Parse query param 'q'
        → medicines.filter(med => med.name.includes(q) OR ...)
        → res.json(results)
    → Frontend setResults
    → Render MedicineCard components
```

### 2. Medicine Detail Flow
```
Frontend UI (MedicineCard → View details)
    → setExpanded(true)
    → (Static data only, no API call in current impl)
    → Render description, uses, sideEffects, safetyAdvice, genericSubstitute
```

### 3. Generic Savings Calculator Flow
```
Frontend UI (GenericSaver)
    → onChange select medicine → setSelected
    → onChange quantity → setQty
    → Find medicine in local medicines array (from /api/medicines)
    → Calculate: brandTotal = price * qty
    → Calculate: genericTotal = genericSubstitute.price * qty
    → Calculate: savings = brandTotal - genericTotal
    → Render results
```

### 4. Prescription Scanner Flow
```
Frontend UI (PrescriptionScanner)
    → onFileChange → setFile
    → onScanClick → setScanning(true) → setTimeout(1800ms)
    → setDone(true) → Show mock results
    → (No actual OCR or API call in current impl)
```

### 5. Pharmacy Locator Flow
```
Frontend UI (PharmacyFinder)
    → onInputChange → setLocation
    → onEnter/Click → setSearchLoc
    → Filter PHARMACIES array (hardcoded) by distance (mock calculation)
    → Render pharmacy cards with distance, rating, generic flag
```

### 6. Pill Reminder Flow
```
Frontend UI (PillReminder)
    → onAdd → setReminders([...prev, newReminder])
    → onToggle → setReminders(map(r => r.id === id ? {...r, taken: !r.taken} : r))
    → onRemove → setReminders(filter(r => r.id !== id))
    → (Local state only, no persistence)
```

### 7. Cart Flow
```
Frontend UI (SearchSection → MedicineCard)
    → onAdd → setCart(prev => {...})
    → onRemove → setCart(prev => {...})
    → CartDrawer → render cart items
    → (Local state only, no API)
```

---

## User Workflows (Current Implementation)

### 1. Buyer Searching for Medicine
```
User types in search box
→ Frontend: useEffect triggers fetch to /api/medicines?q=...
→ Backend: server.js line 12-22 filters medicines array
→ Backend: returns JSON array
→ Frontend: setResults → render MedicineCard list
→ User clicks "View details" → expand MedicineCard → show static data
→ User clicks "Add" → local cart state updated
```

### 2. Buyer Broadcasting a Request
```
User clicks "Scan Prescription"
→ Upload file → mock scan → setDone true
→ Show mock prescription items
→ Click "Add all to cart" → local cart updated
→ (No actual broadcast, no real OCR, no backend API)
```

### 3. Pharmacy Receiving a Request
```
(Not implemented in current prototype)
→ Pharmacy interface missing
→ No real-time broadcasting
→ No offer submission
```

### 4. Pharmacy Submitting an Offer
```
(Not implemented)
```

### 5. Buyer Reserving Stock
```
(Not implemented)
```

### 6. Pharmacy Validating a PIN
```
(Not implemented)
```

### 7. Doctor Accepting a Consultation
```
(Not implemented)
```

### 8. Admin Approving a Pharmacy
```
(Not implemented)
```

---

## Real Execution Paths (Code Analysis)

### Backend Execution Paths
**File:** `backend/server.js`
```javascript
// Line 1-3: Imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Line 5: Data import
const { medicines } = require('./data');

// Line 7-9: App setup
const app = express();
app.use(cors());
app.use(express.json());

// Line 12-22: GET /api/medicines
app.get('/api/medicines', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(medicines);

  const query = q.toLowerCase();
  const results = medicines.filter(med =>
    med.name.toLowerCase().includes(query) ||
    med.genericName.toLowerCase().includes(query) ||
    med.tags.some(tag => tag.toLowerCase().includes(query))
  );
  res.json(results);
});

// Line 25-29: GET /api/medicines/:id
app.get('/api/medicines/:id', (req, res) => {
  const med = medicines.find(m => m.id === req.params.id);
  if (!med) return res.status(404).json({ message: 'Medicine not found' });
  res.json(med);
});

// Line 32-33: Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Frontend Execution Paths
**File:** `frontend/src/App.jsx` (742 lines)
- **Header** — Navigation, cart button (opens drawer)
- **Hero** — Static marketing content
- **SearchSection** — Medicine search with useEffect + fetch
- **GenericSaver** — Calculator with local state
- **PrescriptionScanner** — Mock file upload + timeout
- **PharmacyFinder** — Hardcoded pharmacy array with mock distance
- **PillReminder** — Local state reminders
- **CartDrawer** — Local cart state
- **Footer** — Static content

**File:** `frontend/src/index.css` — Tailwind CSS imports

**File:** `frontend/src/main.jsx` — React root render

### Data Flow
**File:** `backend/data/medicines.js`
- 16 hardcoded medicine objects with brand, generic, tags, genericSubstitute
- Each has: id, name, genericName, brand, category, manufacturer, dosageForm, packSize, mrp, price, requiresPrescription, rating, reviewsCount, image, description, uses, sideEffects, safetyAdvice, howToUse, genericSubstitute, inStock, tags

**File:** `backend/data/index.js`
- `const medicines = require('./medicines'); module.exports = { medicines };`

---

## Data Flow Analysis

### Medicine Data Flow
```
Backend Data Layer (medicines.js)
    → Export array of 16 medicine objects
    → Imported by server.js
    → Served via /api/medicines and /api/medicines/:id
    → Frontend receives JSON array
    → Stored in local React state (useState/useEffect)
    → Filtered, mapped, rendered in UI components
```

### State Flow (Frontend)
```
SearchSection: useState for query, results, loading, category, sortBy, cart
→ useEffect triggers fetch on query change
→ setResults updates UI
→ MedicineCard renders each medicine
→ Cart state managed in SearchSection, passed to CartDrawer
→ GenericSaver manages selected medicine and qty locally
→ PrescriptionScanner manages file, scanning, done state locally
→ PharmacyFinder manages location, searchLoc locally
→ PillReminder manages reminders locally
```

---

## Component Hierarchy (Actual)

```
App.jsx
├── Header.jsx (inline)
│   └── Cart button → opens CartDrawer
├── Hero.jsx (inline)
├── SearchSection.jsx (inline)
│   ├── MedicineCard.jsx (inline)
│   └── CartDrawer.jsx (inline)
├── GenericSaver.jsx (inline)
├── PrescriptionScanner.jsx (inline)
├── PharmacyFinder.jsx (inline)
├── PillReminder.jsx (inline)
└── Footer.jsx (inline)
```

---

## API Contracts (Actual)

### GET /api/medicines
```
Request: GET /api/medicines?q=paracetamol
Response: [
  {
    "id": "med-2",
    "name": "Dolo 650 Tablet",
    "genericName": "Paracetamol / Acetaminophen (650mg)",
    "brand": "Dolo",
    "category": "Pain Relief & Fever",
    "manufacturer": "Micro Labs Ltd",
    "dosageForm": "Tablet",
    "packSize": "Strip of 15 tablets",
    "mrp": 34.0,
    "price": 30.5,
    "requiresPrescription": false,
    "rating": 4.8,
    "reviewsCount": 14200,
    "image": "https://...",
    "description": "...",
    "uses": [...],
    "sideEffects": [...],
    "safetyAdvice": { alcohol, pregnancy, breastfeeding, driving, kidney, liver },
    "howToUse": "...",
    "genericSubstitute": {
      "name": "Paracetamol Tablets IP 650mg (Jan Aushadhi)",
      "genericName": "Paracetamol (650mg)",
      "manufacturer": "PMBJP Jan Aushadhi",
      "packSize": "Strip of 10 tablets",
      "price": 9.5,
      "mrp": 12.0,
      "savingsPercent": 72,
      "qualityStandard": "Indian Pharmacopoeia (IP) Certified",
      "verified": true
    },
    "inStock": true,
    "tags": ["paracetamol", "fever", "headache", "dolo", "crocin", "pain", "otc"]
  }
]
```

### GET /api/medicines/:id
```
Request: GET /api/medicines/med-2
Response: Single medicine object (same structure as above)
```

---

## Security & Validation (Current State)

### Missing Security Controls
- No CORS origin validation (allows all origins)
- No input validation (no Zod/Joi)
- No authentication/authorization
- No rate limiting
- No security headers (Helmet)
- No audit logging
- No error handling middleware
- No request/response logging
- No rate limiting
- No CSP, X-Frame-Options, Referrer-Policy
- No PII redaction in logs
- No SQL injection protection (not applicable - no DB)
- No XSS protection (JSON responses only)

### Missing Validation
- No query parameter validation
- No path parameter validation
- No request body validation (no POST endpoints)
- No response validation

---

## Performance Characteristics

### Backend
- **Cold Start** — Nodemon dev server
- **Response Time** — < 10ms (in-memory array filter)
- **Concurrency** — Single-threaded Node.js
- **Memory** — 16 medicine objects in memory
- **Scalability** — None (single instance, no clustering)

### Frontend
- **Bundle Size** — ~81KB gzipped (dist/assets/index-tJqb6PnQ.js)
- **Initial Paint** — < 1s (dev server)
- **Runtime** — React 19 + Vite
- **State** — Local React state only
- **Caching** — None (Vite dev server no-cache)

---

## Infrastructure (Current)

### Development
- **Frontend** — Vite dev server on port 3001
- **Backend** — Nodemon on port 5000
- **Proxy** — Vite proxy config forwards /api to backend
- **Hot Reload** — Enabled (Vite + React Fast Refresh)
- **Environment** — No .env files, hardcoded values

### Production
- **Not deployed** — No CI/CD, no hosting, no domain
- **No backups** — No database, no persistence
- **No monitoring** — No metrics, no logging, no error tracking

---

## Limitations & Gaps (Current Implementation)

### Missing Features
1. **Database** — No PostgreSQL, no Prisma, no migrations
2. **Authentication** — No Auth, no JWT, no roles
3. **Real-time** — No WebSocket, no Supabase Realtime
4. **File Upload** — No storage, no virus scanning
5. **Payments** — No Razorpay, no webhook verification
6. **Email** — No Brevo, no transactional emails
7. **AI** — No OpenRouter, no OCR, no interaction checking
8. **Admin** — No admin interface, no KYC, no analytics
9. **Doctor** — No doctor interface, no consultations
10. **Pharmacy** — No pharmacy interface, no stock management
11. **Persistence** — No localStorage, no IndexedDB, no backend DB
12. **Testing** — No unit tests, no integration tests, no e2e
13. **CI/CD** — No GitHub Actions, no preview deployments
14. **Monitoring** — No metrics, no logging, no Sentry
15. **Security** — No rate limiting, no validation, no headers
16. **Accessibility** — No WCAG AA, no screen reader testing
17. **Performance** — No Lighthouse budgets, no bundle optimization
18. **Internationalization** — No i18n, no Hindi support
19. **Compliance** — No DPDP, no GDPR, no HIPAA, no NMC
20. **Audit** — No immutable audit logs, no hash chaining

### Technical Debt
- **Hardcoded data** — 16 medicines in JS file, not database
- **Mock UI** — Prescription scanner, pharmacy locator, reminders are mocks
- **Local state only** — No persistence across sessions
- **No separation of concerns** — All logic in App.jsx
- **No TypeScript** — JavaScript only
- **No ESLint/Prettier** — No code quality enforcement
- **No .gitignore** — node_modules, logs, dist committed
- **No environment config** — Hardcoded ports, URLs
- **No documentation** — No API docs, no architecture docs

---

## Recommended Next Steps (Based on Current Flow)

Based on the actual execution flow analysis, the immediate next steps should address:

1. **Database Layer** — Add PostgreSQL + Prisma ORM
2. **Authentication** — Add Supabase Auth + JWT middleware
3. **Persistence** — Move medicine data to database
4. **Validation** — Add Zod validation middleware
5. **Security** — Add Helmet, rate limiting, CORS allowlist
6. **Logging** — Add Pino structured logging with correlation IDs
7. **Error Handling** — Add centralized error middleware
8. **API Versioning** — Add /api/v1/ prefix
9. **Environment Config** — Add .env.example, .env.development
10. **Code Quality** — Add ESLint, Prettier, TypeScript
11. **Testing** — Add Vitest, Jest + RTL, Playwright
12. **CI/CD** — Add GitHub Actions
13. **Frontend** — Migrate to Next.js 14 + TypeScript
14. **State Management** — Add TanStack Query, Zustand
15. **Real-time** — Add Supabase Realtime subscriptions

---

## Verification Methods

### To Verify Current Flows:
1. **Medicine Search** — `curl "http://localhost:5000/api/medicines?q=dolo"` → Returns filtered array
2. **Medicine Detail** — `curl "http://localhost:5000/api/medicines/med-2"` → Returns single object
3. **Frontend Search** — Type in search box → Results update
4. **Frontend Calculator** — Select medicine, change quantity → Savings calculated
5. **Frontend Cart** → Add/remove → Cart count updates
6. **Frontend Reminders** → Add/toggle/remove → State updates
7. **Frontend Pharmacy** → Enter location → Filtered results show

### To Verify Security Gaps:
1. **CORS** — `curl -H "Origin: http://evil.com" http://localhost:5000/api/medicines` → Returns data (should be blocked)
2. **Rate Limit** — Rapid requests → No 429 response
3. **Headers** — `curl -I http://localhost:5000/api/medicines` → Missing security headers
4. **Validation** — `curl "http://localhost:5000/api/medicines?q=<script>alert(1)</script>"` → Returns data (should sanitize)

---

*Document Version: 1.0*
*Generated from: Actual codebase inspection*
*Last Updated: 2026-11-09*
*Status: Current implementation analysis (Phase 1 prototype)*