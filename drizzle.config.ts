import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// console.log(databasePassword, databaseUrl);

export default defineConfig({
  dialect: "postgresql", // ✅ required in v0.18
  schema: "./db/schema.ts", // ✅ path to your schema directory or file
  out: "./drizzle", // ✅ output folder for generated migrations
  dbCredentials: {
    url: process.env.DATABASE_URL!, // ✅ full Postgres connection string
    password: process.env.DATABASE_PASSWORD, // optional if not in URL
  },
});
