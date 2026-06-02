import { json, integer, pgTable, varchar, numeric, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  cel: varchar({ length: 10 }).notNull(),
  user_type: varchar({ length: 255 }).notNull(),
  is_active: boolean().default(true). notNull(),
  deleted_at: timestamp(),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow()
});

export const productsTable = pgTable("product", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  price: numeric({ mode: 'number' }).notNull(),
  stock: integer().notNull(),
  img: varchar({ length: 255 }),
  is_active: boolean().default(true). notNull(),
  deleted_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});


export const orderTable = pgTable('order', {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  //address_id: integer('address_id').notNull().references(() => addressTable.id),
  status: integer().notNull().references(() => statusOrder.id, { onDelete: 'restrict'}),
  user_id: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'restrict' }),
  total: numeric({ mode: 'number' }).notNull(),
  address: json().notNull(),
  delivery_date: timestamp(),
  updated_at: timestamp().defaultNow().notNull(),
  created_at: timestamp().defaultNow().notNull()
});

export const orderDetailTable = pgTable("order_detail", {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  order_id: integer('order_id').notNull().references(() => orderTable.id, { onDelete: 'restrict' }),
  product_id: integer('product_id').notNull().references(() => productsTable.id, { onDelete: 'restrict' }),
  quantity: integer().notNull(),
  unit_price: numeric({ mode: 'number' }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull()
});

export const statusOrder = pgTable('status_order', {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  status: varchar({ length: 255 }).notNull()
});