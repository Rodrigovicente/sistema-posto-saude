import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const groups = sqliteTable("groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const streets = sqliteTable("streets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const addressIntervals = sqliteTable("address_intervals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  streetId: integer("street_id")
    .references(() => streets.id)
    .notNull(),
  startNumber: integer("start_number").notNull(),
  endNumber: integer("end_number").notNull(),
  // "odd", "even", or "both"
  parity: text("parity").notNull().default("both"), 
  groupId: integer("group_id")
    .references(() => groups.id)
    .notNull(),
});
