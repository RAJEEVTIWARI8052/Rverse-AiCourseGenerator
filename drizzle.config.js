import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './configs/schema.jsx',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_UITpFqh2mX7e@ep-withered-morning-ady0c8dy-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
});