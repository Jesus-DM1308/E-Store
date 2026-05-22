import { integer, pgTable, varchar, numeric, timestamp, uuid } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  price: numeric().notNull(),
  stock: integer(),
  img: varchar({ length: 255 }),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow()
});


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
