import { consola } from 'consola'
import { migrate } from 'drizzle-orm/d1/migrator'

export default defineNitroPlugin(async (nitroApp) => {
  consola.info('Starting database migrations...')

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const db = useDrizzle()
    consola.info('Database connection established')

    await migrate(db, {
      migrationsFolder: 'server/database/migrations',
    })
    consola.success('Database migrations completed successfully')

    try {
      const result = await db.query.wishlists.findMany()
      consola.success('Database verified:', result.length, 'wishlists found')
    } catch (err) {
      consola.error('Database verification failed:', err)
      throw err
    }
  } catch (err) {
    consola.error('Migration error:', err)
    throw err
  }
})
