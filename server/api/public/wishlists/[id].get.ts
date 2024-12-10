import { defineEventHandler, createError, getRouterParam } from 'h3'
import { eq, and } from 'drizzle-orm'
import { useDrizzle, tables } from '~~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'id')

  if (!uuid) {
    throw createError({
      statusCode: 400,
      message: 'Invalid wishlist identifier'
    })
  }

  try {
    const result = await useDrizzle()
      .select({
        wishlists: tables.wishlists,
        wishlist_items: tables.wishlistItems,
        user: {
          id: tables.users.id,
          name: tables.users.name
        }
      })
      .from(tables.wishlists)
      .leftJoin(
        tables.wishlistItems,
        eq(tables.wishlists.id, tables.wishlistItems.wishlistId)
      )
      .leftJoin(
        tables.users,
        eq(tables.wishlists.userId, tables.users.id)
      )
      .where(eq(tables.wishlists.uuid, uuid))
      .all()

    if (!result.length) {
      throw createError({
        statusCode: 404,
        message: 'Wishlist not found'
      })
    }

    // Group the results
    const wishlist = result[0].wishlists
    const items = result.map(r => r.wishlist_items).filter(Boolean)
    const ownerName = result[0].user?.name || 'Anonymous'

    console.log('Debug result:', {
      wishlist: result[0].wishlists,
      user: result[0].user,
      itemsCount: items.length
    })

    return {
      ...wishlist,
      items,
      ownerName
    }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch wishlist'
    })
  }
})
