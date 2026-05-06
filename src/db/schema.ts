import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";

export const spots = pgTable("spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  description: text("description"),
  isCoastal: text("is_coastal").notNull().default("false"),
  createdAt: timestamp("created_at").defaultNow(),
});
