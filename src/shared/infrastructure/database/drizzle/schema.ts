import { uuid, integer, pgTable, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  price: numeric().notNull(),
  stock: integer(),
  img: varchar({ length: 255 }),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow()
});
