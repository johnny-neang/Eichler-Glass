import { defineConfig } from "drizzle-kit";

// Prefer a direct (non-pooled) connection for DDL/migrations. Vercel Postgres
// (Neon) exposes the pooled URL as DATABASE_URL and the direct one as
// DATABASE_URL_UNPOOLED / POSTGRES_URL_NON_POOLING; fall back to DATABASE_URL
// for non-Vercel environments.
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
