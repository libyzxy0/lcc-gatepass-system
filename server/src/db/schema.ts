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
  "guard",
  "developer",
  "department_head"
]);

export const statusEnum = pgEnum("status", [
  "pending",
  "approved",
  "rejected"
]);

export const userTypeEnum = pgEnum("user_type", [
  "student",
  "visitor",
  "staff",
]);

export const staffTypeEnum = pgEnum("staff_type", [
  "teacher",
  "guard",
  "administrator",
  "canteen_vendors",
  "other"
]);

export const student = pgTable("student", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: text("student_id").notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_initial: text("middle_initial"),
  section: text("section").notNull(),
  grade_level: text("grade_level").notNull(),
  parent_phone_number: text("parent_phone_number").notNull(),
  parent_email: text("parent_email"),
  rfid_code: text("rfid_code").unique().notNull(),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});

export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  staff_id: text("staff_id").notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_initial: text("middle_initial"),
  staff_type: staffTypeEnum('staff_type').notNull(),
  phone_number: text("phone_number").notNull(),
  email: text("email"),
  rfid_code: text("rfid_code").unique().notNull(),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});

export const visitor = pgTable("visitor", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  visitor_id: text("visitor_id").notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_initial: text("middle_initial"),
  address: text("address"),
  email: text("email").notNull().unique(),
  phone_number: text("phone_number").notNull(),
  pin: text("pin").notNull(),
  verified: boolean("verified").notNull().default(false),
  activated: boolean("activated").notNull().default(false),
  valid_id_type: text("valid_id_type"),
  valid_id_photo_url: text("valid_id_photo_url"),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});

export const visit = pgTable("visit", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  visitor_id: uuid("visitor_id").references(() => visitor.id),
  purpose: text("purpose").notNull(),
  description: text("description").notNull(),
  vehicle_type: text("vehicle_type"),
  vehicle_plate: text("vehicle_plate"),
  qr_token: text("qr_token").unique(),
  schedule_date: timestamp("schedule_date", { mode: "string" }).notNull(),
  status: statusEnum("status").default("pending"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
})

export const visitor_log = pgTable("visitor_log", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  visitor_id: uuid("visitor_id").references(() => visitor.id),
  device_id: text("device_id"),
  visiting: text("visiting"),
  purpose: text("purpose"),
  time_in: timestamp("time_in", { mode: "string" }).defaultNow(),
  time_out: timestamp("time_out", { mode: "string" }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});

export const student_log = pgTable("student_log", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  student_id: uuid("student_id").references(() => student.id),
  device_id: text("device_id"),
  time_in: timestamp("time_in", { mode: "string" }).defaultNow(),
  time_out: timestamp("time_out", { mode: "string" }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});

export const staff_log = pgTable("staff_log", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  staff_id: uuid("staff_id").references(() => staff.id),
  device_id: text("device_id"),
  time_in: timestamp("time_in", { mode: "string" }).defaultNow(),
  time_out: timestamp("time_out", { mode: "string" }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
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
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});

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