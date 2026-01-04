import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";

export const visitor = pgTable("visitor", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  visitor_id: text("visitor_id").notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_initial: text("middle_initial"),
  address: text("address"),
  email: text("email").notNull().unique(),
  phone_number: text("phone_number").notNull(),
  pin: text("pin").notNull().default("1234"),
  verified: boolean("verified").notNull().default(false),
  activated: boolean("activated").notNull().default(false),
  valid_id_type: text("valid_id_type"),
  valid_id_photo_url: text("valid_id_photo_url"),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});