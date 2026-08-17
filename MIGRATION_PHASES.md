# Migration Phases

This file is the source of truth for phase tracking. Each completed phase should be checked off before the phase commit is pushed.

## Phase Checklist

- [x] Phase 1: Repository hygiene, legacy audit, and Supabase schema mapping.
- [x] Phase 2: Bootstrap Next.js/Supabase application shell.
- [x] Phase 3: Implement authentication and user/role model with Supabase Auth.
- [x] Phase 4: Migrate regular user flows: home/search, vehicles, bookings, payments history.
- [x] Phase 5: Migrate business owner dashboard: garages, schedules, booking management, income.
- [x] Phase 6: Migrate admin dashboard: verification, users, garages, payments, commissions, analytics.
- [x] Phase 7: Upload/storage migration and deployment configuration.
- [ ] Phase 8: End-to-end verification, cleanup, and legacy PHP retirement.

## Phase 7 Notes

Completed:

- Created `supabase/migrations/0006_storage_buckets.sql` initializing storage buckets (`garage-images`, `avatars`, `verification-documents`) with fine-grained Postgres RLS storage policies.
- Implemented `/api/upload` route handler supporting MIME validation, file size limits (<5MB), unique filename generation, and Supabase Storage uploads.
- Configured Next.js image domain optimization (`images.unsplash.com`, `*.supabase.co`, `placehold.co`) and `output: "standalone"` in `frontend/next.config.ts`.
- Created multi-stage production `Dockerfile` and `.dockerignore` for containerized hosting.
- Added `frontend/.env.production.example` and `DEPLOYMENT.md` production deployment guide.

## Phase 1 Notes

Completed:

- Initialized Git repository and connected `origin`.
- Added Git hygiene rules to keep uploads, debug logs, environment files, and raw database dumps out of Git.
- Captured legacy project audit.
- Created an initial Supabase/Postgres schema draft based on the legacy MySQL schema.

Important migration decisions:

- Do not migrate plaintext legacy passwords into the new application.
- Use Supabase Auth for credentials.
- Keep legacy business table names initially where practical to reduce mapping risk.
- Port MySQL trigger behavior deliberately in later phases, either as Postgres triggers/RPCs or API service logic.

## Phase 2 Notes

Completed:

- Created `frontend/` with Next.js App Router, TypeScript, Tailwind, and ESLint.
- Installed Supabase browser/server client packages.
- Added Supabase env example and client helper modules.
- Added route shells for user, business, admin, login, and health check.
- Added `backend/` notes for API/service placement.

## Phase 3 Notes

Completed:

- Created `supabase/migrations/0002_auth_and_roles.sql` introducing Row Level Security (RLS), role resolution functions (`get_user_role`, `is_admin`), login audit RPC (`record_login_history`), and dashboard switching RPC.
- Generated and mapped complete TypeScript types in `frontend/src/lib/supabase/database.types.ts`.
- Implemented `@supabase/ssr` server and browser client wrappers with typed database generics.
- Added server auth helper layer (`frontend/src/lib/auth/auth.ts`) for profile extraction, session management, role resolution, and server actions.
- Built Next.js edge middleware (`frontend/src/middleware.ts`) handling automated session refresh, route protection for `/dashboard`, `/business`, and `/admin`, and intelligent redirection.
- Added API route handlers for login (`/api/auth/login`), registration (`/api/auth/register`), logout (`/api/auth/logout`), auth callbacks (`/api/auth/callback`), and dashboard switching (`/api/auth/switch-dashboard`).
- Built modern, responsive UI pages for `/login` and `/register` (supporting Driver and Garage Host workflows), and integrated `AuthHeader` into `/dashboard`, `/business`, and `/admin`.

## Phase 4 Notes

Completed:

- Created `supabase/migrations/0003_regular_user_flows.sql` with RLS policies, atomic reservation function `create_booking_order`, financial settlement function `process_booking_payment`, cancellation function `cancel_booking_order`, and rating summary updater `submit_garage_rating`.
- Added API route handlers for garages (`/api/garages`, `/api/garages/[id]`), vehicles (`/api/vehicles`), bookings (`/api/bookings`, `/api/bookings/[id]/cancel`), payments (`/api/payments`), loyalty points (`/api/points`), ratings (`/api/ratings`), and user profiles (`/api/user/profile`).
- Built modular driver frontend components: `GarageSearch`, `BookingModal`, `VehiclesManager`, `BookingsList`, `PaymentModal` (bKash, Nagad, Card, Points simulation with instant receipts), `PointsLedger` (Tier status and progress bar), `RatingModal`, and `ProfileEditor`.
- Upgraded the Driver App (`/dashboard`) into an interactive hub with instant spot search, capacity gauges, vehicle management, and booking workflows.

## Phase 5 Notes

Completed:

- Created `supabase/migrations/0004_business_owner_flows.sql` with atomic schedule & override updater `update_garage_schedule_and_status`, host check-in handler `update_host_booking_status`, and financial aggregator `get_owner_income_summary`.
- Added host API route handlers: `/api/business/garages`, `/api/business/garages/[id]`, `/api/business/garages/[id]/schedule`, `/api/business/bookings`, `/api/business/income`, and `/api/business/reviews`.
- Built modular host components: `GaragePortfolio`, `ScheduleControls` (24/7 toggles, operating hours, force-close with reasons), `HostBookings` (1-click driver check-in/checkout), `IncomeAnalytics` (70% net payout, 30% platform commission, today's income), and `HostReviews`.
- Upgraded the Host Operations Portal (`/business`) into an interactive real-time management console.

## Phase 6 Notes

Completed:

- Created `supabase/migrations/0005_admin_flows.sql` with platform analytics aggregator `admin_get_analytics_summary`, entity verification handler `admin_verify_entity`, and custom host commission override function `admin_set_owner_commission`.
- Added Admin API route handlers: `/api/admin/analytics`, `/api/admin/users`, `/api/admin/garages`, `/api/admin/owners`, and `/api/admin/payments`.
- Built modular admin components: `AdminAnalytics` (platform profit 30%, gross volume, payouts 70%, verification counters), `AdminUsers` (user audit and verification controls), `AdminGarages` (garage approvals and safety compliance), `AdminOwners` (host verification and custom commission rate editor), and `AdminPayments` (full platform payment ledger).
- Upgraded the Super Administrator Console (`/admin`) into a unified platform governance hub.
