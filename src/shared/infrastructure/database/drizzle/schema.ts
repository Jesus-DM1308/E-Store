import { integer, pgTable, varchar, numeric, timestamp, uuid} from "drizzle-orm/pg-core";

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
  description: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  stock: integer(),
  img: varchar({ length: 255 }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
