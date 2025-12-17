import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import postgres from 'postgres'

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL!
  },
});
