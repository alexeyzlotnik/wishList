import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Wishlist ID is required'
    })
  }

  try {
    const result = await useDrizzle()
      .select({
        wishlists: tables.wishlists,
        wishlist_items: tables.wishlistItems
      })
      .from(tables.wishlists)
      .leftJoin(
        tables.wishlistItems,
        eq(tables.wishlists.id, tables.wishlistItems.wishlistId)
      )
      .where(eq(tables.wishlists.id, parseInt(id)))
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

    return {
      wishlists: wishlist,
      wishlist_items: items
    }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch wishlist'
    })
  }
})
