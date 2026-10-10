// scripts/test-db.js
require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const safe = process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@");
  console.log("Connecting to:", safe);
  try {
    const res = await pool.query("SELECT NOW() as now, current_user as user");
    console.log("✅ Success:", res.rows[0]);
  } catch (err) {
    console.error("❌ Failed:", err.message);
    console.error("Code:", err.code);
  } finally {
    await pool.end();
  }
})();