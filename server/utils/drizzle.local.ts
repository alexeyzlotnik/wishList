import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../database/schema'

const sqlite = new Database('local.db')
export const db = drizzle(sqlite, { schema })
