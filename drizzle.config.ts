import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle/migrations',
  verbose: true,
  dialect: 'sqlite',
  dbCredentials: {
    url: "./drizzle/database.sqlite", // Your local SQLite file
  },
});

