# Parking Lagbe

Legacy PHP/MySQL parking management application being migrated phase by phase to a Supabase-backed React/Next.js application.

## Current State

- Legacy source: PHP files in the project root.
- Legacy database source: local MySQL dump kept out of Git because it contains sample data and plaintext credentials.
- Migration tracking: `MIGRATION_PHASES.md`.
- Supabase schema draft: `supabase/migrations/0001_initial_schema.sql`.

## Migration Direction

The target architecture is:

- Frontend: React + Next.js
- Backend/API: Next.js route handlers or a separate API service, decided during implementation
- Database/Auth: Supabase Postgres and Supabase Auth
- Uploads: Supabase Storage or another cloud object store
