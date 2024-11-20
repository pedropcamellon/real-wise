import 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user?: {
      id: number
      username: string
    } & DefaultSession['user']
  }

  interface User {
    id: string | number
    username: string
    access?: string
    refresh?: string
  }
}
