import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle/migrations',
  verbose: true,
  dialect: 'turso',
  dbCredentials: {
    // url: "./drizzle/database.sqlite", // Your local SQLite file
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

