export default oauthGoogleEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user: oauthUser, tokens }) {
    const { user: userSession } = await getUserSession(event)

    // If the user is already signed in, link the account
    if (userSession?.id) {
      const user = await findUserById(userSession.id)

      if (user) {
        await updateUser(userSession.id, {
          googleId: oauthUser.id,
          googleToken: tokens.access_token,
        })

        await updateUserSession(event, {
          ...userSession,
          googleId: oauthUser.id,
        })
        return sendRedirect(event, '/profile')
      }
    }

    // If the user is not signed in, search for an existing user with that Google ID
    // If it exists, sign in as that user and refresh the token
    let user = await findUserBy(eq(tables.users.googleId, oauthUser.id))

    if (user) {
      await updateUser(user.id, {
        googleId: oauthUser.id,
        googleToken: tokens.access_token,
      })

      await updateUserSession(event, {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        verifiedAt: user.verifiedAt,
        googleId: oauthUser.id,
      })
      return sendRedirect(event, '/profile')
    }

    // If the user is not signed in, search for an existing user with that email address without a Google ID
    // If it exists, tells the user to sign in with that account and link the Google account
    user = await findUserBy(
      and(
        eq(tables.users.email, oauthUser.email),
        isNull(tables.users.googleId),
      ),
    )
    if (user) {
      await updateSession(event,
        {
          password: useRuntimeConfig(event).session.password,
        },
        {
          message: 'An existing account for this email already exists. Please login and visit your profile settings to add support for Google authentication.',
        })
      return sendRedirect(event, '/login')
    }

    // If the user is not signed in and no user exists with that Google ID or email address, create a new user
    const createdUser = await createUser({
      name: oauthUser.name as string,
      email: oauthUser.email as string,
      avatar: oauthUser.picture as string,
      googleId: oauthUser.id as string,
      googleToken: tokens.access_token as string,
      verifiedAt: new Date().toUTCString(),
    })

    await updateUserSession(event, {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      avatar: createdUser.avatar,
      verifiedAt: createdUser.verifiedAt,
      googleId: oauthUser.id,
    })

    return sendRedirect(event, '/profile')
  },
})
