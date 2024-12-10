import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  emailToVerify: text('email_to_verify'),
  name: text('name').notNull(),
  avatar: text('avatar'),
  googleId: text('google_id').unique(),
  googleToken: text('google_token'),
  verifiedAt: text('verified_at'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`)
    .$onUpdateFn(() => sql`(current_timestamp)`),
})

export const wishlists = sqliteTable('wishlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  public: integer('public', { mode: 'boolean' }).notNull().default(false),
  uuid: text('uuid').notNull(),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`)
    .$onUpdateFn(() => sql`(current_timestamp)`),
})

export const wishlistItems = sqliteTable('wishlist_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  wishlistId: integer('wishlist_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  url: text('url'),
  image: text('image'),
  price: text('price'),
  selectedBy: text('selected_by'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`)
    .$onUpdateFn(() => sql`(current_timestamp)`),
})
