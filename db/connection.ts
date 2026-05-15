
import { drizzle } from 'drizzle-orm/libsql';
import { config } from 'dotenv';
import * as schema from './schema';

config({ path: '.env.local' }); // or .env.local

// const sqlite = new Database('./drizzle/database.sqlite');
// export const db = drizzle(sqlite, { schema });

export const db = drizzle({ connection: {
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}, schema });
