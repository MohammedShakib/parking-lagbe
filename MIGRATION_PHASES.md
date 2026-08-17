# Migration Phases

This file is the source of truth for phase tracking. Each completed phase should be checked off before the phase commit is pushed.

## Phase Checklist

- [x] Phase 1: Repository hygiene, legacy audit, and Supabase schema mapping.
- [x] Phase 2: Bootstrap Next.js/Supabase application shell.
- [ ] Phase 3: Implement authentication and user/role model with Supabase Auth.
- [ ] Phase 4: Migrate regular user flows: home/search, vehicles, bookings, payments history.
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
