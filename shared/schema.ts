import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "quoted", "converted", "lost"]);
export const depositStatusEnum = pgEnum("deposit_status", ["pending", "captured", "refunded"]);
export const workOrderStatusEnum = pgEnum("work_order_status", ["new", "scheduled", "in_progress", "completed", "invoiced", "cancelled"]);

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").default("website"),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  address: text("address"),
  serviceCity: text("service_city"),
  serviceTier: text("service_tier"),
  notes: text("notes"),
  status: leadStatusEnum("status").default("new"),
  followUpAt: timestamp("follow_up_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deposits = pgTable("deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  amount: integer("amount").notNull().default(5000),
  depositDate: timestamp("deposit_date").defaultNow(),
  method: text("method").default("stripe"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: depositStatusEnum("status").default("pending"),
  memo: text("memo"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workOrders = pgTable("work_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  address: text("address").notNull(),
  scheduledDate: timestamp("scheduled_date"),
  timeWindow: text("time_window"),
  crewAssignment: text("crew_assignment"),
  status: workOrderStatusEnum("status").default("new"),
  serviceTier: text("service_tier"),
  scopeOfWork: text("scope_of_work"),
  completionNotes: text("completion_notes"),
  invoiceTotal: integer("invoice_total"),
  depositApplied: boolean("deposit_applied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  lastLoginAt: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
});

export const insertWorkOrderSchema = createInsertSchema(workOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLeadSchema = insertLeadSchema.partial();
export const updateDepositSchema = insertDepositSchema.partial();
export const updateWorkOrderSchema = insertWorkOrderSchema.partial();

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;

export type WorkOrder = typeof workOrders.$inferSelect;
export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;
