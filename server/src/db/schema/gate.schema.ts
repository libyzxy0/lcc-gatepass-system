import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum
} from "drizzle-orm/pg-core";

export const gateTypeEnum = pgEnum("gate_type", [
  "entry",
  "exit",
  "entry-exit"
]);

export const gateStatusEnum = pgEnum("gate_status", [
  "online",
  "offline"
]);

export const gate = pgTable("gate", {
  id: uuid("id").primaryKey().defaultRandom(),
  gate_id: text("gate_id").notNull().unique(),
  name: text("name").notNull(),
  secret: text("secret").notNull(),
  type: gateTypeEnum("gate_type").notNull(),
  status: gateStatusEnum("gate_status").notNull().default('offline'),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});