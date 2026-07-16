import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const feedbackResponses = pgTable("feedback_responses", {
  id: serial().primaryKey(),
  motivo: text(),
  impressione: integer(),
  broken: text(),
  wish: text(),
  pagina: text(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const issueReports = pgTable("issue_reports", {
  id: serial().primaryKey(),
  requestType: text("request_type").notNull(),
  name: text().notNull(),
  projectName: text("project_name").notNull(),
  city: text().notNull(),
  category: text(),
  description: text().notNull(),
  email: text().notNull(),
  projectRef: text("project_ref"),
  createdAt: timestamp("created_at").defaultNow(),
});
