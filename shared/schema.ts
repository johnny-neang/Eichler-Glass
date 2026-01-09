import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  location: varchar("location", { length: 100 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  referralSource: varchar("referral_source", { length: 50 }),
  promoCode: varchar("promo_code", { length: 50 }),
  propertyType: varchar("property_type", { length: 50 }).notNull(),
  services: text("services").array().notNull(),
  frequency: varchar("frequency", { length: 50 }).notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull().default("CA"),
  zip: varchar("zip", { length: 10 }).notNull(),
  pageUrl: varchar("page_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
