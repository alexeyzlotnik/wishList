import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { useDrizzle, tables } from '~~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'id')
  const { itemId, userName, action } = await readBody(event)

  if (!uuid || !itemId || !userName) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request data'
    })
  }

  try {
    // Get the current item state first
    const currentItem = await useDrizzle()
      .select()
      .from(tables.wishlistItems)
      .where(eq(tables.wishlistItems.id, itemId))
      .get()

    if (!currentItem) {
      throw createError({
        statusCode: 404,
        message: 'Item not found'
      })
    }

    // For selecting: Check if item is already selected
    if (action === 'select' && currentItem.selectedBy) {
      throw createError({
        statusCode: 400,
        message: 'This item has already been selected by someone else'
      })
    }

    // For unselecting: Check if the user is the one who selected it
    if (action === 'unselect' && currentItem.selectedBy !== userName) {
      throw createError({
        statusCode: 403,
        message: 'You can only unselect items you have selected'
      })
    }

    // Proceed with the update
    await useDrizzle()
      .update(tables.wishlistItems)
      .set({
        selectedBy: action === 'select' ? userName : null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(tables.wishlistItems.id, itemId))
      .run()

    return {
      success: true,
      message: action === 'select' ? 'Item selected successfully' : 'Item unselected successfully'
    }
  } catch (error) {
    console.error('Selection error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update item selection'
    })
  }
})
