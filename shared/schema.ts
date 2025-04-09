import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: text("role").default("user"),  // 'admin', 'customer', 'user'
  teamId: integer("team_id"),
  createdAt: timestamp("created_at").defaultNow(),
  customerId: integer("customer_id"), // For linking users to customers
  planId: integer("plan_id") // For linking users to specific plans
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

// Teams
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  customerId: integer("customer_id") // For linking teams to customers
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true
});

// Sites
export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull().default("website"), // website, mobile_app, api
  checkFrequency: integer("check_frequency").notNull().default(5), // check interval in minutes
  teamId: integer("team_id"),
  active: boolean("active").default(true),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  customerId: integer("customer_id") // For linking sites to customers
});

export const insertSiteSchema = createInsertSchema(sites).omit({
  id: true,
  createdAt: true
});

// Check Results
export const checkResults = pgTable("check_results", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  statusCode: integer("status_code"),
  responseTime: integer("response_time"), // in milliseconds
  success: boolean("success").notNull(),
  error: text("error")
});

export const insertCheckResultSchema = createInsertSchema(checkResults).omit({
  id: true,
  timestamp: true
});

// Alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  severity: text("severity").notNull(), // critical, high, medium, low, info
  status: text("status").default("active"), // active, resolved, acknowledged
  message: text("message").notNull(),
  details: jsonb("details"),
  resolvedAt: timestamp("resolved_at"),
  acknowledgedBy: integer("acknowledged_by"),
  customerId: integer("customer_id") // For linking alerts to customers
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
  resolvedAt: true
});

// Uptime Statistics
export const uptimeStats = pgTable("uptime_stats", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  period: text("period").notNull(), // hourly, daily, weekly, monthly
  uptimePercentage: real("uptime_percentage").notNull(),
  avgResponseTime: real("avg_response_time").notNull(),
  checksCount: integer("checks_count").notNull(),
  failedChecksCount: integer("failed_checks_count").notNull(),
  customerId: integer("customer_id") // For linking stats to customers
});

export const insertUptimeStatSchema = createInsertSchema(uptimeStats).omit({
  id: true,
  timestamp: true
});

// AI Insights
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  type: text("type").notNull(), // prediction, anomaly, trend, optimization
  message: text("message").notNull(),
  confidence: real("confidence").notNull(),
  relatedMetrics: jsonb("related_metrics"),
  details: jsonb("details"),
  status: text("status").default("new"), // new, reviewed, implemented, dismissed
  customerId: integer("customer_id") // For linking insights to customers
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  timestamp: true
});

// New schema for customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  planId: integer("plan_id").notNull(),
  status: text("status").default("active"), // active, suspended, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  billingInfo: jsonb("billing_info").default({})
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true
});

// New schema for subscription plans
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  price: real("price").notNull(),
  billingCycle: text("billing_cycle").default("monthly"), // monthly, quarterly, yearly
  features: jsonb("features").default([]),
  limits: jsonb("limits").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  createdAt: true
});

// New schema for billing
export const billing = pgTable("billing", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  planId: integer("plan_id").notNull(),
  amount: real("amount").notNull(),
  status: text("status").default("pending"), // pending, paid, failed, refunded
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  notes: text("notes")
});

export const insertBillingSchema = createInsertSchema(billing).omit({
  id: true,
  createdAt: true,
  paidAt: true
});

// Type Definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertSite = z.infer<typeof insertSiteSchema>;
export type Site = typeof sites.$inferSelect;

export type InsertCheckResult = z.infer<typeof insertCheckResultSchema>;
export type CheckResult = typeof checkResults.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertUptimeStat = z.infer<typeof insertUptimeStatSchema>;
export type UptimeStat = typeof uptimeStats.$inferSelect;

export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

export type InsertBilling = z.infer<typeof insertBillingSchema>;
export type Billing = typeof billing.$inferSelect;