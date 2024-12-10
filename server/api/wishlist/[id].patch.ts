import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'
import { eq } from 'drizzle-orm'
import { useDrizzle, tables } from '~~/server/utils/drizzle'
import { requireVerifiedUserSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const { user } = await requireVerifiedUserSession(event)
    const body = await readBody(event)

    console.log('PATCH Debug:', {
      id,
      userId: user.id,
      requestBody: body,
      publicValue: Boolean(body.public)
    })

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Wishlist ID is required'
      })
    }

    const wishlist = await useDrizzle()
      .select()
      .from(tables.wishlists)
      .where(eq(tables.wishlists.id, parseInt(id)))
      .get()

    console.log('Found wishlist:', wishlist)

    if (!wishlist || wishlist.userId !== user.id) {
      throw createError({
        statusCode: 404,
        message: 'Wishlist not found'
      })
    }

    await useDrizzle()
      .update(tables.wishlists)
      .set({
        name: body.name || wishlist.name,
        description: body.description || wishlist.description,
        public: 'public' in body ? Boolean(body.public) : wishlist.public,
        updatedAt: new Date().toISOString()
      })
      .where(eq(tables.wishlists.id, parseInt(id)))
      .run()

    const updatedWishlist = await useDrizzle()
      .select()
      .from(tables.wishlists)
      .where(eq(tables.wishlists.id, parseInt(id)))
      .get()

    const result = { success: true, public: updatedWishlist.public }
    console.log('PATCH Response:', result)
    return result
  } catch (error) {
    console.error('PATCH error details:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update wishlist'
    })
  }
})
