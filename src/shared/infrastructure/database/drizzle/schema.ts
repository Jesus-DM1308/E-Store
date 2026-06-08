import { integer, pgTable, varchar, numeric, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  cel: varchar({ length: 10 }).notNull(),
  user_type: varchar({ length: 255 }).notNull(),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow()
});

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  price: numeric({ mode: 'number' }).notNull(),
  stock: integer().notNull(),
  img: varchar({ length: 255 }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});

export const addressTable = pgTable("address", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  user_id: integer().notNull(),
  street: varchar({length: 255}).notNull(),
  colony: varchar({length: 255}).notNull(),
  references: varchar({length: 255}).notNull(),
  postal_code: varchar({length: 255}).notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
