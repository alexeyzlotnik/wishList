import { defineEventHandler, createError, getRouterParam, readMultipartFormData } from 'h3'
import { eq } from 'drizzle-orm'
import { useDrizzle, tables } from '~~/server/utils/drizzle'
import { requireVerifiedUserSession } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const { user } = await requireVerifiedUserSession(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Wishlist ID is required'
    })
  }

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

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({
      statusCode: 400,
      message: 'Invalid form data'
    })
  }

  // Process form data
  const data = formData.reduce((acc, field) => {
    acc[field.name] = field.data.toString()
    return acc
  }, {} as Record<string, string>)

  // Validate required fields
  if (!data.name) {
    throw createError({
      statusCode: 400,
      message: 'Name is required'
    })
  }

  // Add item to wishlist_items table
  const item = await useDrizzle()
    .insert(tables.wishlistItems)
    .values({
      wishlistId: parseInt(id),
      name: data.name,
      description: data.description || '',
      url: data.url || '',
      price: data.price || '',
      // Handle image upload if needed
      image: null, // TODO: Implement image upload
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .returning()
    .get()

  return item
})
