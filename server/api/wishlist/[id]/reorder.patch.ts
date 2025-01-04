import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { useDrizzle, tables } from '~~/server/utils/drizzle'
import { requireVerifiedUserSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const { user } = await requireVerifiedUserSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id || !body.items?.length) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request data'
    })
  }

  try {
    // Verify wishlist ownership
    const wishlist = await useDrizzle()
      .select()
      .from(tables.wishlists)
      .where(eq(tables.wishlists.id, parseInt(id)))
      .get()

    if (!wishlist || wishlist.userId !== user.id) {
      throw createError({
        statusCode: 404,
        message: 'Wishlist not found'
      })
    }

    // Update each item's order
    for (const item of body.items) {
      await useDrizzle()
        .update(tables.wishlistItems)
        .set({ order: item.order })
        .where(eq(tables.wishlistItems.id, item.id))
        .run()
    }

    return { message: 'Order updated successfully' }
  } catch (error) {
    console.error('Reorder error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update item order'
    })
  }
})
