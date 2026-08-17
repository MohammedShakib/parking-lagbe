# Parking Lagbe (পার্কিং লাগবে ?)

Smart Parking & Space Sharing Platform in Bangladesh — Rebuilt with Next.js 15, TypeScript, Tailwind CSS, and Supabase PostgreSQL.

---

## 🌟 Overview

**Parking Lagbe** is the leading digital parking reservation and space-sharing ecosystem in Bangladesh. It connects drivers searching for safe, CCTV-monitored parking spaces in Dhaka with commercial and residential property owners who want to monetize their vacant parking spaces.

### Key Workflows:
1. **🚗 Driver Hub (`/dashboard`)**:
   - Real-time parking space search across Dhaka (Banani, Dhanmondi, Gulshan, Uttara, Mirpur, Motijheel).
   - Instant spot reservations with date/time pickers and duration sliders.
   - Digital payments via simulated bKash, Nagad, Card, or Loyalty Points.
   - Printable official receipts and invoices.
   - Personal vehicle fleet management.
   - VIP Loyalty Rewards tiers (Bronze ⭐, Gold 🏆, Diamond 💎).
   - 5-star garage rating and review submission.
2. **🏢 Space Host Portal (`/business`)**:
   - Parking lot portfolio management with capacity controls and hourly rates.
   - 24/7 operating schedules and manual emergency force-close overrides.
   - Driver check-in and checkout management.
   - Net income analytics (70% Host payout, 30% Platform commission).
   - Customer review feeds and ratings summary.
3. **🛡️ Super Administrator Governance (`/admin`)**:
   - Executive analytics (30% platform profit, gross volume, 70% payouts).
   - Host identity & trade license verification review queue.
   - Garage safety inspection approvals and compliance controls.
   - User account management and role controls.
   - Custom host commission overrides.
   - Full financial audit ledger.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components & Server Actions)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, Glassmorphism, DaisyUI dark theme aesthetics
- **Database**: PostgreSQL with Supabase (RLS, Triggers, Stored Procedures)
- **Storage**: Supabase Storage Buckets (`garage-images`, `avatars`, `verification-documents`)
- **Containerization**: Multi-stage Docker with standalone runner

---

## 📂 Project Structure

```
parking-lagbe/
├── frontend/                     # Next.js App Router Application
│   ├── src/
│   │   ├── app/                  # Pages & API Route Handlers
│   │   │   ├── admin/            # Super Admin Console
│   │   │   ├── business/         # Space Host Portal
│   │   │   ├── dashboard/        # Driver Hub
│   │   │   ├── login/            # Authentication Sign-In
│   │   │   ├── register/         # Driver & Host Registration
│   │   │   ├── api/              # Typed REST API Endpoints
│   │   │   │   ├── admin/        # Admin analytics, users, garages, payments
│   │   │   │   ├── auth/         # Login, register, logout, dashboard switch
│   │   │   │   ├── bookings/     # Reservation create, list, cancel
│   │   │   │   ├── business/     # Host garages, schedules, check-in, income
│   │   │   │   ├── garages/      # Discovery search and details
│   │   │   │   ├── payments/     # Digital settlement
│   │   │   │   ├── points/       # Loyalty ledger & milestones
│   │   │   │   ├── ratings/      # Reviews and rating calculations
│   │   │   │   └── upload/       # Supabase Storage uploader
│   │   ├── components/           # Reusable UI & Client Components
│   │   │   ├── admin/            # Admin analytics, users, garages, payments
│   │   │   ├── business/         # Host portfolio, schedule, bookings, income
│   │   │   ├── dashboard/        # Search, modal, vehicles, bookings, points
│   │   │   └── auth-header.tsx   # Global navigation bar with branding & dropdown
│   │   └── lib/
│   │       ├── auth/             # Session profile helper
│   │       └── supabase/         # Typed database client & SSR wrappers
│   └── package.json
├── supabase/
│   └── migrations/               # PostgreSQL Migrations (0001 - 0006)
├── legacy_php_archive/           # Preserved legacy PHP codebase & MySQL dumps
├── Dockerfile                    # Production container specification
├── DEPLOYMENT.md                 # Production deployment manual
└── MIGRATION_PHASES.md           # Migration progress tracking checklist
```

---

## 🚀 Getting Started Locally

### Prerequisites:
- Node.js 20+
- npm or pnpm

### 1. Install Dependencies:
```bash
cd frontend
npm install
```

### 2. Configure Environment:
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

### 3. Run Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Attribution
© 2026 Parking Lagbe. All rights reserved.
