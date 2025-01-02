export default oauthGoogleEventHandler({
  config: {
    // emailRequired: true,
  },
  async onSuccess(event, { user: oauthUser, tokens }) {
    if (!oauthUser?.sub || !oauthUser?.email) {
      throw createError({
        statusCode: 400,
        message: `Missing required user information from Google`,
      })
    }

    const { user: userSession } = await getUserSession(event)

    // First check: if user is logged in, link the Google account
    if (userSession?.id) {
      const user = await findUserById(userSession.id)
      if (user) {
        // Link Google ID to existing account
        await updateUser(userSession.id, {
          googleId: oauthUser.sub,
          googleToken: tokens.access_token ?? null,
        })

        await updateUserSession(event, {
          ...userSession,
          googleId: oauthUser.sub,
        })
        return sendRedirect(event, '/wishlists')
      }
    }

    // Second check: look for existing user by email
    let user = await findUserBy(eq(tables.users.email, oauthUser.email))

    if (user) {
      // Update existing user with Google info
      await updateUser(user.id, {
        googleId: oauthUser.sub,
        googleToken: tokens.access_token ?? null,
      })

      await updateUserSession(event, {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        verifiedAt: user.verifiedAt,
        googleId: oauthUser.sub,
      })
      return sendRedirect(event, '/wishlists')
    }

    // If no existing user found, create new user
    user = await createUser({
      email: oauthUser.email,
      name: oauthUser.name ?? '',
      avatar: oauthUser.picture ?? null,
      googleId: oauthUser.sub,
      googleToken: tokens.access_token ?? null,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    await updateUserSession(event, {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      verifiedAt: user.verifiedAt,
      googleId: oauthUser.sub,
    })

    return sendRedirect(event, '/wishlists')
  },
  onError(event, error) {
    console.error('Google OAuth Error:', error)

    // Set an error message in the session
    updateSession(event,
      {
        password: useRuntimeConfig(event).session.password,
      },
      {
        message: error.message || 'Authentication failed. Please try again.',
      }
    )

    // Redirect to login page with error
    return sendRedirect(event, '/login')
  }
})
