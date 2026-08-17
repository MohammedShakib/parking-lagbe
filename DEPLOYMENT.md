# Parking Lagbe - Production Deployment Guide

This document outlines the step-by-step deployment procedure for the Parking Lagbe Next.js App Router application and Supabase backend.

---

## 1. Database & Supabase Cloud Setup

1. **Create a Supabase Project**:
   - Go to [database.new](https://database.new) and create a project in the closest region (e.g. `Singapore - ap-southeast-1`).
2. **Apply Migrations**:
   - Navigate to the Supabase SQL Editor and run migrations in sequential order:
     - `supabase/migrations/0001_initial_schema.sql` (Schema, 21 tables)
     - `supabase/migrations/0002_auth_and_roles.sql` (Auth & Roles)
     - `supabase/migrations/0003_regular_user_flows.sql` (Driver Flows, Bookings, Ratings)
     - `supabase/migrations/0004_business_owner_flows.sql` (Host Operations & 70% Income)
     - `supabase/migrations/0005_admin_flows.sql` (Super Admin Governance)
     - `supabase/migrations/0006_storage_buckets.sql` (Storage buckets & security policies)
3. **Copy Credentials**:
   - Project Settings → API:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `Project API anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `Project API service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Option A: Vercel Deployment (Recommended)

1. Connect the GitHub repository `MohammedShakib/parking-lagbe` to Vercel.
2. Configure **Root Directory** as `frontend`.
3. Set the Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js App Router bundle to global edge nodes.

---

## 3. Option B: Docker Container Deployment (VPS / DigitalOcean / Coolify)

1. Build the production Docker image:
   ```bash
   docker build -t parking-lagbe:latest .
   ```
2. Run the container:
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co" \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" \
     -e SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \
     -e NEXT_PUBLIC_APP_URL="https://your-domain.com" \
     --name parking-lagbe-app \
     parking-lagbe:latest
   ```

---

## 4. Production Health Verification

After deployment, verify the health status endpoint:
```bash
curl https://your-domain.com/api/health
```
Response:
```json
{
  "status": "healthy",
  "service": "parking-lagbe-api",
  "version": "1.0.0",
  "timestamp": "..."
}
```
