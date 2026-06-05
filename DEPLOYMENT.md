# Deploying to Vercel

This app was migrated from Replit. It now runs as:

- **Frontend** — a Vite/React SPA built to `dist/public` and served as static
  files by Vercel's CDN.
- **Backend** — the existing Express routes wrapped in a single Vercel
  Serverless Function at [`api/index.ts`](api/index.ts). All `/api/*` requests
  are rewritten to it via [`vercel.json`](vercel.json).

## One-time setup

1. **Push this repo to GitHub** (if not already there).

2. **Import the project into Vercel**
   - Go to https://vercel.com/new and select the GitHub repo.
   - Framework preset: **Other** (config comes from `vercel.json`).
   - Build command, output dir, and routing are already defined in
     `vercel.json` — no overrides needed.

3. **Provision the database (Vercel Postgres)**
   - In the Vercel project → **Storage** → **Create Database** → **Postgres**.
   - Connect it to the project. Vercel injects `DATABASE_URL` (and related
     `POSTGRES_*` vars) into all environments automatically.

4. **Create the database schema**
   - Locally, with the production `DATABASE_URL` exported (or via a `.env`):
     ```bash
     npm install
     npm run db:push
     ```
   - This creates the `leads` table from `shared/schema.ts`.

5. **Set the remaining environment variables** (Project → Settings →
   Environment Variables), for Production and Preview:
   - `ADMIN_PASSWORD` — password for the `/admin/leads` dashboard
   - `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE` — Mailjet API keys
   - `MJ_SENDER_EMAIL` — verified Mailjet sender (e.g. `hello@eichlerglass.com`)

6. **Deploy** — every push to the default branch triggers a production deploy;
   pull requests get preview deployments.

## Local development

```bash
npm install
cp .env.example .env   # fill in values
npm run dev            # Express + Vite on http://localhost:5000
```

Local dev still uses `server/index.ts` (Express + Vite middleware on one port).
Production on Vercel uses `api/index.ts` + the static build instead.

## Endpoints

| Method | Path               | Notes                              |
| ------ | ------------------ | ---------------------------------- |
| POST   | `/api/leads`       | Create a lead; emails via Mailjet  |
| POST   | `/api/admin/login` | Returns admin token                |
| GET    | `/api/leads`       | Admin only (Bearer `ADMIN_PASSWORD`) |
| GET    | `/api/health`      | Health check                       |
