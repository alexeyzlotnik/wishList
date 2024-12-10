import { randomUUID } from 'uncrypto'

export default defineEventHandler(async (event) => {
  const { name, description } = await readBody(event)
  const { user } = await requireUserSession(event)

  const now = new Date().toISOString()

  const wishlist = await useDrizzle()
    .insert(tables.wishlists)
    .values({
      name,
      description,
      userId: user.id,
      uuid: randomUUID(),
      createdAt: now,
      updatedAt: now
    })
    .returning()
    .get()

  return wishlist
})
