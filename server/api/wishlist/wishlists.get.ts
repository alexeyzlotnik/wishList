// import { defineEventHandler } from 'h3'
// import { useDrizzle, tables } from '~~/server/utils/drizzle'
// import { requireUserSession } from '~~/server/utils/session'


// export default defineEventHandler(async (event) => {
//   try {
//     // Get the current user's session
//     const { user } = await requireUserSession(event)

//     // Fetch wishlists for the current user
//     const wishlists = await useDrizzle()
//       .select()
//       .from(tables.wishlists)
//       .where(eq(tables.wishlists.userId, user.id)) // Assuming 'userId' is the column name
//       .all()

//     return {
//       statusCode: 200,
//       body: wishlists,
//     }
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: { error: 'Failed to fetch wishlists' },
//     }
//   }
// })

// export default defineEventHandler((event) => {
//    return {
//     id: 1,
//     user_id: 1,
//     name: 'test',
//     description: 'test',
//     created_at: '2024-01-01',
//     updated_at: '2024-01-01',
//   }
// })

export default defineEventHandler(async () => {
  const wishlists = await useDrizzle().select().from(tables.wishlists).all()

  return wishlists
})

