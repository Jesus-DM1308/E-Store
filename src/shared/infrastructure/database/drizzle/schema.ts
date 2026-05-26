import { integer, pgTable, varchar, numeric, timestamp} from "drizzle-orm/pg-core";


export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 500 }).notNull(),
  price: integer().notNull(),
  stock: integer(),
  img: varchar({ length: 255 }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
