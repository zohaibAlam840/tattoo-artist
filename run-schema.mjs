// Run: node run-schema.mjs YOUR_DB_PASSWORD
// Password found at: Supabase Dashboard → Settings → Database → Connection string

import { readFileSync } from "fs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node run-schema.mjs YOUR_DB_PASSWORD");
  process.exit(1);
}

const PROJECT_REF = "oxpjnqzlhmuolcrdbfcq";
const DB_URL = `postgresql://postgres:${encodeURIComponent(password)}@db.${PROJECT_REF}.supabase.co:5432/postgres`;

const sql = readFileSync("./supabase/schema.sql", "utf8");

// Install pg if needed, then run
const { default: pg } = await import("pg").catch(async () => {
  console.log("Installing pg...");
  const { execSync } = await import("child_process");
  execSync("npm install pg --no-save", { stdio: "inherit" });
  return import("pg");
});

const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log("Connected. Running schema...");
  await client.query(sql);
  console.log("✓ Schema applied successfully!");
  console.log("✓ Admin profile inserted.");
  console.log("\nYou can now log in with:");
  console.log("  Email:    renatovision23@gmail.com");
  console.log("  Password: Admin@2026!");
} catch (err) {
  console.error("Error:", err.message);
} finally {
  await client.end();
}
