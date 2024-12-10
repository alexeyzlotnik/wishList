import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  url: './.data/db.sqlite',
  dbCredentials: {
    url: './.data/db.sqlite'
  }
})