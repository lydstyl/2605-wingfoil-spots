import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";

export const spots = pgTable("spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  description: text("description"),
  isCoastal: text("is_coastal").notNull().default("false"),
  coastHeading: integer("coast_heading"), // degrés, direction vers la mer (null = plan d'eau intérieur)
  createdAt: timestamp("created_at").defaultNow(),
});
