# Supabase Migration Runbook

## 1) Prepare Supabase
- Create a Supabase project.
- In project settings, copy:
  - `SUPABASE_URL`
  - Postgres connection string for `DATABASE_URL`
  - Frontend `anon` key.
- Enable Email auth in Supabase Auth.

## 2) Switch Prisma to Postgres
- Confirm `provider = "postgresql"` in `prisma/schema.prisma`.
- Run:
  - `npx prisma generate`
  - `npx prisma migrate dev --name supabase_postgres_bootstrap`

## 3) Data Migration (MySQL -> Supabase Postgres)
- Export MySQL tables using CSV or SQL dump.
- Import static masters first (`state`, `district`, `branch`), then `user`, then `student` and dependent tables.
- Preserve key IDs so existing foreign keys remain valid.
- Validate with row counts per table before/after migration.

## 4) Auth Cutover
- Frontend now signs users in/up with Supabase Auth.
- Backend verifies Supabase JWT using JWKS from `SUPABASE_URL`.
- Backend upserts local app user by `supabaseUserId` during token verification.

## 5) Environment Setup
- Backend: copy `.env.example` -> `.env` and fill values.
- Frontend: copy `College-ERP-Frontend/.env.example` -> `College-ERP-Frontend/.env` and fill values.

## 6) Hosting
- Frontend: deploy `College-ERP-Frontend` to Vercel.
- Backend: deploy repo root backend service to Render using `render.yaml`.
- Set `CORS_ORIGIN` to the Vercel domain.

## 7) Validation Checklist
- Register and login via Supabase.
- Verify `/api/auth/me` returns local app profile.
- Student flow: create, edit, submit application.
- Admin flow: dashboard, review, approve/reject, assign USN.
- Document upload and PDF download.

## 8) Rollback
- Keep MySQL dump before migration.
- Keep previous Vercel and Render deploy versions.
- If critical issue appears:
  - Roll frontend to previous Vercel deployment.
  - Roll backend to previous Render deployment.
  - Restore MySQL backup and old `DATABASE_URL`.
