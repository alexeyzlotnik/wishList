// auth.d.ts
declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    email: string
    avatar: string | null
    googleId?: string | null
    verifiedAt: string | null
    emailToVerify?: string | null
  }

  interface UserSession {
  }
}

export {}
