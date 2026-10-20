# Deploy Mama Mo Ink to Vercel

The frontend remains Vite/React. Vercel serves API requests through `api/[...path].js`; application data is stored in Neon Postgres. SQLite remains only for local development and the one-time import.

## 1. Create the hosted database

Create a Neon Postgres project and copy its pooled connection string from the Neon dashboard. Keep the string private. Do not put it in a `VITE_*` variable or frontend source.

The Postgres schema is a keyed `app_records` table with JSONB payloads. This preserves the existing UI data shapes while moving persistence to hosted Postgres; it does not create one relational SQL table for each old SQLite table.

Create `.env` in the project root from `.env.example`, then set:

- `DATABASE_URL`: Neon pooled Postgres connection string.
- `ADMIN_EMAIL`: email address for the production administrator.
- `ADMIN_PASSWORD`: a unique password of at least 12 characters. Do not use the old demo password `admin123`.
- `ADMIN_NAME`: optional display name.

`.env` is ignored by Git. The API creates the administrator the first time it runs when the configured email is absent. It excludes the old demo admin records during migration.

## 2. Migrate the current SQLite data

The SQLite file is the source. Keep a separate backup before migrating (one is present in this workspace as `backup-pre-vercel-*`). From the project directory run:

```powershell
npm install
npm run db:migrate:neon
```

The migration preserves products, categories, orders and order history, inquiries, promotions, inventory ledger, custom pages, navigation, media, store settings, audit records, and buyer accounts/password hashes. It omits admin accounts, sessions, and failed-login counters. Use an administrator email that is not already used by a buyer account. Existing buyer accounts can sign in and legacy plain-text passwords are upgraded to scrypt hashes at their next successful sign-in.

The migration stops if the Neon table already contains records. `npm run db:migrate:neon -- --force` replaces those records with the local SQLite contents; use it only when you intend to overwrite the Neon application data.

## 3. Configure Vercel

Import the repository into Vercel with the project root as the Root Directory. Use Vite (or Other) with:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Add `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `ADMIN_NAME` under **Project Settings → Environment Variables** for Production and Preview as needed. Add secrets directly in the dashboard; do not commit them or prefix them with `VITE_`. Redeploy after changing environment variables. No `vercel.json` is needed for the Vite static output plus root `api/` Functions.

## 4. Verify the deployment

- `GET /api/health` should return `{ "status": "ok", "engine": "Neon Postgres" }`.
- `GET /api/all-data` should return storefront data; anonymous requests do not receive customer orders, user records, or inquiries.
- Sign in using the configured admin email/password. Admin data and mutations require the resulting server session token.
- Submit a test inquiry from Printing Services. It should appear in the admin Inquiries panel; changing its status should persist after refresh.
- Place a test order, confirm it appears in Transactions, and check its ID in Order Tracking.

`/api/inquiries` POST and order creation are public storefront actions. Reading inquiries, changing statuses, order status updates, product and content administration, audit logs, and database reset require an authenticated administrator.

## Local development

`npm run dev` continues to use the existing local SQLite middleware. To exercise Vercel Functions locally, use Vercel CLI with the project environment variables configured or pulled into a private local environment. Do not use a real production database for destructive tests such as `/api/reset`.
