# Backend

The migration target uses Supabase for Postgres, Auth, and likely file storage. API code starts inside the Next.js App Router under `frontend/src/app/api` so frontend and backend contracts stay close while workflows are being rebuilt.

Create a separate Node backend here only if the project needs long-running jobs, non-Next deployment, or integrations that should not live in route handlers.
