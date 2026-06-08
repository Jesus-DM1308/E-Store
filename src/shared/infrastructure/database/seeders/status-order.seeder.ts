import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { statusOrder } from '../drizzle-orm/schema.js';

const ORDER_STATUSES = [
  'Pendiente',
  'Aprobado',
  'Enviado',
  'En transito',
  'Entregado',
  'Cancelado',
  'Reembolsado'
];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle({ client: pool });

async function seedStatusOrder() {
  for (const status of ORDER_STATUSES) {
    const [existingStatus] = await db.select()
      .from(statusOrder)
      .where(eq(statusOrder.status, status));

    if (existingStatus) {
      continue;
    };

    await db.insert(statusOrder)
      .values({ status });
  };
}

seedStatusOrder()
  .then(() => {
    console.log('Status order seed completed.');
  })
  .catch((error) => {
    console.error('Status order seed failed.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
