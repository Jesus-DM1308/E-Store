import { text, json, integer, pgTable, varchar, numeric, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable(`user`, {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  lastName: varchar(`last_name`, { length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  cel: varchar({ length: 10 }).notNull(),
  userType: varchar(`user_type`, { length: 255 }).notNull(),
  isActive: boolean(`is_active`).default(true). notNull(),
  deletedAt: timestamp(`deleted_at`),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
});

export const productsTable = pgTable(`product`, {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  price: numeric({ mode: 'number' }).notNull(),
  stock: integer().notNull(),
  img: varchar({ length: 255 }),
  isActive: boolean(`is_active`).default(true). notNull(),
  deletedAt: timestamp(`deleted_at`),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
});


export const orderTable = pgTable(`order`, {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  //address_id: integer('address_id').notNull().references(() => addressTable.id),
  statusId: integer(`status_id`).notNull().references(() => statusOrder.id, { onDelete: 'restrict'}),
  userId: uuid(`user_id`).notNull().references(() => usersTable.id, { onDelete: 'restrict' }),
  total: numeric({ mode: `number` }).notNull(),
  address: json().notNull(),
  deliveryDate: timestamp(`delivery_date`),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
  createdAt: timestamp(`created_at`).defaultNow().notNull()
});

export const orderDetailTable = pgTable(`order_detail`, {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  orderId: integer(`order_id`).notNull().references(() => orderTable.id, { onDelete: 'restrict' }),
  productId: integer(`product_id`).notNull().references(() => productsTable.id, { onDelete: 'restrict' }),
  quantity: integer().notNull(),
  unitPrice: numeric(`unit_price`, { mode: 'number' }).notNull(),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull()
});

export const statusOrder = pgTable(`status_order`, {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  code: text().notNull()
});