# Deploy Mama Mo Ink to Vercel with Supabase

The frontend remains Vite/React. Vercel serves requests through `api/[...path].js`; the server accesses Supabase Postgres through its Data API with a server-only service role key. SQLite remains for local development and the one-time import.

The Postgres schema uses a keyed `app_records` table with JSONB payloads. This preserves the existing app data shapes without exposing the database to the browser.

## 1. Create the Supabase table and functions

In your Supabase project, open **SQL Editor**, paste the contents of [supabase/schema.sql](supabase/schema.sql), and run it. The table has Row Level Security enabled and no public policies; the API uses the service role key only on the server.

## 2. Set environment variables

For local migration, copy `.env.example` to `.env` and fill these values from your Supabase dashboard:

- `SUPABASE_URL`: the project's URL from Project Settings → API.
- `SUPABASE_SERVICE_ROLE_KEY`: the secret `service_role` key from Project Settings → API. Keep this private. Never prefix it with `VITE_` or put it in frontend code.
- `ADMIN_EMAIL`: email for the production administrator. Choose an email that is not already used by a buyer account.
- `ADMIN_PASSWORD`: a unique password of at least 12 characters. Do not use the old demo password `admin123`.
- `ADMIN_NAME`: optional display name.

The Vercel Function uses Supabase's HTTPS Data API, so it does not need a raw Postgres connection string or pooler URL.

## 3. Migrate the existing SQLite data

The tracked `database.sqlite` is the import source. A backup of the SQLite file and WAL files is in the local `backup-pre-vercel-*` directory. From the project directory run:

```powershell
npm install
npm run db:migrate:supabase
```

The migration preserves products, categories, orders and order history, inquiries, promotions, inventory ledger, custom pages, navigation, media, store settings, audit records, and buyer accounts/password hashes. It omits old demo admins, sessions, and failed-login counters. Legacy plain-text buyer passwords are upgraded to scrypt hashes at their next successful sign-in.

The migration stops if the Supabase table already contains records. `npm run db:migrate:supabase -- --force` replaces all records in `app_records` with the local SQLite contents; use it only if you intend to overwrite the hosted app data.

## 4. Configure and deploy on Vercel

Import the repository with the project root as the Root Directory. Use Vite (or Other) with:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `ADMIN_NAME` in **Project Settings → Environment Variables** for Production (and Preview if needed). Add secrets directly in the dashboard, not in source control. Redeploy after adding them. No `vercel.json` is needed for the Vite static output plus root `api/` Functions.

The first API request creates the configured administrator if that account is missing. Changing `ADMIN_PASSWORD` updates the configured admin password on the next API request.

## 5. Verify

- `GET /api/health` returns `{ "status": "ok", "engine": "Supabase Postgres" }`.
- Anonymous `GET /api/all-data` returns storefront data without user records, orders, or inquiries.
- Sign in with the configured admin email/password; admin list and edit operations use the issued server session.
- Submit a test Printing Services inquiry; it should appear in the admin Inquiries panel and retain status changes after refresh.
- Place a test order, confirm it appears in Transactions, and check its ID in Order Tracking.

Inquiry creation and order creation are public storefront actions. Reading inquiries, changing inquiry/order status, product and content administration, audit logs, and database reset require an authenticated administrator.

## Local development

`npm run dev` continues to use the local SQLite middleware. The migration and Vercel Functions use Supabase only when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured.
