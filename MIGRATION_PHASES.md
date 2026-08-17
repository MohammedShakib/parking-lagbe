# Migration Phases

This file is the source of truth for phase tracking. Each completed phase should be checked off before the phase commit is pushed.

## Phase Checklist

- [x] Phase 1: Repository hygiene, legacy audit, and Supabase schema mapping.
- [x] Phase 2: Bootstrap Next.js/Supabase application shell.
- [x] Phase 3: Implement authentication and user/role model with Supabase Auth.
- [x] Phase 4: Migrate regular user flows: home/search, vehicles, bookings, payments history.
- [ ] Phase 5: Migrate business owner dashboard: garages, schedules, booking management, income.
- [ ] Phase 6: Migrate admin dashboard: verification, users, garages, payments, commissions, analytics.
- [ ] Phase 7: Upload/storage migration and deployment configuration.
- [ ] Phase 8: End-to-end verification, cleanup, and legacy PHP retirement.

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
