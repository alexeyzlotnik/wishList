export default defineEventHandler(async (event) => {
  const { user } = await requireVerifiedUserSession(event)
  const itemId = getRouterParam(event, 'id')

  if (!itemId) {
    throw createError({
      statusCode: 400,
      message: 'Wishlist item ID is required'
    })
  }

  // First get the item with its associated wishlist to check ownership
  const result = await useDrizzle()
    .select({
      wishlistItems: tables.wishlistItems,
      wishlists: tables.wishlists
    })
    .from(tables.wishlistItems)
    .innerJoin(
      tables.wishlists,
      eq(tables.wishlistItems.wishlistId, tables.wishlists.id)
    )
    .where(eq(tables.wishlistItems.id, parseInt(itemId)))
    .get()

  if (!result || result.wishlists.userId !== user.id) {
    throw createError({
      statusCode: 404,
      message: 'Wishlist item not found or you don\'t have permission to delete it'
    })
  }

  await useDrizzle()
    .delete(tables.wishlistItems)
    .where(eq(tables.wishlistItems.id, parseInt(itemId)))

  return { message: 'Item deleted successfully' }
})
