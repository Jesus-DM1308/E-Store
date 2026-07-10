import {
  text,
  json,
  integer,
  pgTable,
  varchar,
  numeric,
  timestamp,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable(`user`, {
  id: uuid(`id`).defaultRandom().primaryKey(),
  name: varchar(`name`, { length: 255 }).notNull(),
  lastName: varchar(`last_name`, { length: 255 }).notNull(),
  email: varchar(`email`, { length: 255 }).notNull().unique(),
  password: varchar(`password`, { length: 255 }).notNull(),
  cel: varchar(`cel`, { length: 10 }).notNull(),
  isActive: boolean(`is_active`).default(true).notNull(),
  userType: varchar(`user_type`, { length: 255 }).notNull(),
  deletedAt: timestamp(`deleted_at`),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
});

export const addressTable = pgTable(`address`, {
  id: integer(`id`).primaryKey().generatedAlwaysAsIdentity().notNull(),
  userId: uuid(`user_id`)
    .notNull()
    .references(() => usersTable.id, { onDelete: 'restrict' }),
  street: varchar(`street`, { length: 255 }).notNull(),
  colony: varchar(`colony`, { length: 255 }).notNull(),
  references: varchar(`references`, { length: 255 }).notNull(),
  postalCode: varchar(`postal_code`, { length: 255 }).notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
});

export const productsTable = pgTable(`products`, {
  id: integer(`id`).primaryKey().generatedAlwaysAsIdentity().notNull(),
  name: varchar(`name`, { length: 255 }).notNull(),
  brand: varchar(`brand`, { length: 255 }).notNull(),
  description: varchar(`description`, { length: 255 }),
  image: varchar(`image`, { length: 255 }),
  isActive: boolean(`is_active`).default(true).notNull(),
  deletedAt: timestamp(`deleted_at`),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
});

export const productsUsersTable = pgTable('products_users', {
  id: integer(`id`).primaryKey().generatedAlwaysAsIdentity().notNull(),
  userId: uuid(`user_id`)
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  productId: integer(`product_id`)
    .notNull()
    .references(() => productsTable.id, { onDelete: 'restrict' }),
  price: numeric(`price`, { mode: 'number' }).notNull(),
  stock: integer(`stock`).notNull(),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
});

export const ordersTable = pgTable(`order`, {
  id: integer(`id`).primaryKey().generatedAlwaysAsIdentity().notNull(),
  statusId: integer(`status_id`)
    .notNull()
    .references(() => statusOrderTable.id, { onDelete: 'restrict' }),
  userId: uuid(`user_id`)
    .notNull()
    .references(() => usersTable.id, { onDelete: 'restrict' }),
  total: numeric({ mode: `number` }).notNull(),
  address: json(`address`).notNull(),
  deliveryDate: timestamp(`delivery_date`),
  whoReceive: varchar(`who_receive`, { length: 255 }).notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
});

export const orderDetailTable = pgTable(`order_detail`, {
  id: integer(`id`).primaryKey().generatedAlwaysAsIdentity().notNull(),
  orderId: integer(`order_id`)
    .notNull()
    .references(() => ordersTable.id, { onDelete: 'restrict' }),
  productUserId: integer(`product_user_id`)
    .notNull()
    .references(() => productsUsersTable.id, { onDelete: 'restrict' }),
  quantity: integer(`quantity`).notNull(),
  unitPrice: numeric(`unit_price`, { mode: 'number' }).notNull(),
  updatedAt: timestamp(`updated_at`).defaultNow().notNull(),
  createdAt: timestamp(`created_at`).defaultNow().notNull(),
});

export const statusOrderTable = pgTable(`status_order`, {
  id: integer(`id`).primaryKey().generatedAlwaysAsIdentity().notNull(),
  code: text(`code`).notNull(),
});
