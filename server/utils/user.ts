import type { SQL } from 'drizzle-orm'
import type { UserInsert } from '~~/server/utils/drizzle'
import { useDrizzle, tables } from '~~/server/utils/drizzle'

export async function findUserById(userId: number) {
  return useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, userId))
    .get()
}

export async function findUserByGoogleId(googleId: string) {
  return useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.googleId, googleId))
    .get()
}

export async function findUserBy(query: SQL | undefined) {
  return useDrizzle().select().from(tables.users).where(query).get()
}

export async function createUser(user: UserInsert) {
  return useDrizzle()
    .insert(tables.users)
    .values(user)
    .returning({
      id: tables.users.id,
      email: tables.users.email,
      name: tables.users.name,
      avatar: tables.users.avatar,
      verifiedAt: tables.users.verifiedAt,
    })
    .get()
}

export async function updateUser(userId: number, user: Partial<UserInsert>) {
  return useDrizzle()
    .update(tables.users)
    .set(user)
    .where(eq(tables.users.id, userId))
    .run()
}

export async function deleteProfilePicture(avatar: string) {
  if (avatar.startsWith('profile-pictures/')) {
    await hubBlob().delete(avatar)
  }
}
