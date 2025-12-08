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
  "staff",
]);

export const userTypeEnum = pgEnum("user_type", [
  "student",
  "visitor",
]);

export const directionEnum = pgEnum("direction", [
  "in",
  "out",
]);

export const statusEnum = pgEnum("status", [
  "pending",
  "approved",
  "rejected",
  "completed",
]);

export const student = pgTable("student", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_no: text("student_no").notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_initial: text("middle_initial"),
  grade_level: text("grade_level"),
  section: text("section"),
  parent_phone_number: text("parent_phone_number"),
  parent_email: text("parent_email"),
  rfid_code: text("rfid_code").unique(),
  photo_url: text("photo_url"),
  is_active: text("is_active").default("true"),
  created_at: timestamp("created_at", { mode: "string" })
    .defaultNow()
    .notNull(),
});

export const visitor = pgTable("visitor", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_initial: text("middle_initial"),
  email: text("email").notNull().unique(),
  phone_number: text("phone_number").notNull(),
  company: text("company"),
  valid_id_type: text("valid_id_type"),
  valid_id_number: text("valid_id_number"),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" })
    .defaultNow()
    .notNull(),
  purpose: text("purpose"),
  office: text("office"),
  schedule_date: timestamp("schedule_date", { mode: "string" }),
  status: statusEnum("status").default("pending"),
  is_one_time: boolean("is_one_time").default(true),
});

export const qr_code = pgTable("qr_code", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  user_type: userTypeEnum("user_type").notNull(),
  visitor_id: uuid("visitor_id").references(() => visitor.id),
  student_id: uuid("student_id").references(() => visitor.id),
  qr_token: text("qr_token").notNull().unique(),
  pin_code: text("pin_code"),
  scanned_count: text("scanned_count").default("0"),
  issued_at: timestamp("issued_at", { mode: "string" }).defaultNow(),
  expires_at: timestamp("expires_at", { mode: "string" }),
  revoked: boolean("revoked").default(false),
});

export const gate_log = pgTable("gate_log", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  user_type: userTypeEnum("user_type").notNull(),
  student_id: uuid("student_id").references(() => student.id),
  visitor_id: uuid("visitor_id").references(() => visitor.id),
  direction: directionEnum("direction").notNull(),
  timestamp: timestamp("timestamp", { mode: "string" }).defaultNow(),
  device_id: text("device_id"),
  guard_id: uuid("guard_id").references(() => admin.id),
  office: text("office"),
});

export const admin = pgTable("admin", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  role: adminRoleEnum("role").notNull(),
  phone_number: text("phone_number").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  photo_url: text("photo_url"),
  is_super_admin: boolean("is_super_admin").default(false),
  created_at: timestamp("created_at", { mode: "string" })
    .defaultNow()
    .notNull(),
});
