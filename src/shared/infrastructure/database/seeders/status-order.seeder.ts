import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { statusOrderTable } from '../drizzle-orm/schema.js';
import { ORDER_STATUSES } from '../../../../modules/orders/domain/index.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle({ client: pool });

async function seedStatusOrder() {
  for (const status of ORDER_STATUSES) {
    const [existingStatus] = await db
      .select()
      .from(statusOrderTable)
      .where(eq(statusOrderTable.code, status));

    if (existingStatus) {
      continue;
    }

    await db.insert(statusOrderTable).values({ code: status });
  }
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
