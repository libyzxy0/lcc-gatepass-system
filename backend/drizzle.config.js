"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
const isProduction = process.env.NODE_ENV === 'production';
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: "./src/db/schema.ts",
    out: "./src/drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.NEON_DATABASE_URL
    },
});
