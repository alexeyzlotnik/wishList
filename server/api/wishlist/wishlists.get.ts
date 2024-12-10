import { defineEventHandler, createError } from 'h3'
import { useDrizzle, tables } from '~~/server/utils/drizzle'
import { requireVerifiedUserSession } from '~~/server/utils/session'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireVerifiedUserSession(event)

  try {
    const wishlists = await useDrizzle()
      .select()
      .from(tables.wishlists)
      .where(eq(tables.wishlists.userId, user.id))
      .all()

    return wishlists
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch wishlists'
    })
  }
})

