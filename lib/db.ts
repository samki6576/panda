// lib/db.ts
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const connectionUrl = new URL(databaseUrl);
// pg lets `sslmode` in the URL override the explicit TLS configuration below.
// Removing it prevents `sslmode=require` from discarding this local setting.
connectionUrl.searchParams.delete("sslmode");

const pool = new Pool({
  connectionString: connectionUrl.toString(),
  ssl: {
    rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
  },
});

export async function query(
  text: string,
  params?: Array<string | number | boolean | null | Date>
) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
