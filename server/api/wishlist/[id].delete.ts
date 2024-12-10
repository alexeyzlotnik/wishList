import { defineEventHandler, createError, getRouterParam } from 'h3'
import { eq } from 'drizzle-orm'
import { useDrizzle, tables } from '~~/server/utils/drizzle'
import { requireVerifiedUserSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { user } = await requireVerifiedUserSession(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Wishlist ID is required'
    })
  }

  try {
    // First verify the wishlist belongs to the user
    const wishlist = await useDrizzle()
      .select()
      .from(tables.wishlists)
      .where(eq(tables.wishlists.id, parseInt(id)))
      .get()

    if (!wishlist) {
      throw createError({
        statusCode: 404,
        message: 'Wishlist not found'
      })
    }

    // Delete the wishlist
    await useDrizzle()
      .delete(tables.wishlists)
      .where(eq(tables.wishlists.id, parseInt(id)))
      .run()

    return { success: true }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete wishlist'
    })
  }
})
