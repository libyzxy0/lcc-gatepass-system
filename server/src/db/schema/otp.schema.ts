import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";
import { visitor } from './visitor.schema'
import { admin } from './admin.schema'

export const userTypeEnum = pgEnum("user_type", [
  "student",
  "visitor"
]);

export const otp = pgTable("otp", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  code: text("code").notNull(),
  user_type: userTypeEnum("user_type").notNull(),
  visitor_id: uuid("visitor_id").references(() => visitor.id).unique(),
  admin_id: uuid("admin_id").references(() => admin.id).unique(),
  revoked: boolean("revoked").default(false),
  expires_at: timestamp("expires_at", { mode: "string" }),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});