export default defineEventHandler(async (event) => {
  const form = await readFormData(event)
  const file = form.get('file') as File

  if (!file || !file.size) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  ensureBlob(file, {
    maxSize: '4MB',
    types: ['image']
  })

  try {
    const blob = await hubBlob().put(file.name, file, {
      addRandomSuffix: true,
      prefix: 'wishlist-images'
    })

    console.log('Blob upload response:', blob) // Debug log

    return {
      pathname: blob.pathname,
      url: `/images/${blob.pathname}`
    }
  } catch (error) {
    console.error('Blob upload error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to upload image'
    })
  }
})
