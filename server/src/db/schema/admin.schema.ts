import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";

export const adminRoleEnum = pgEnum("admin_role", [
  "admin",
  "security",
  "developer",
  "other"
]);

export const admin = pgTable("admin", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  role: adminRoleEnum("role").notNull(),
  phone_number: text("phone_number").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  photo_url: text("photo_url"),
  is_super_admin: boolean("is_super_admin").default(false),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});