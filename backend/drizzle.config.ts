import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import postgres from 'postgres'

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL!
  },
});
