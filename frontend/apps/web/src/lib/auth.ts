import { ApiError } from '@frontend/types/api'
import type { AuthOptions, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getApiClient } from './api'

// Debug helper
const debugLog = (step: string, message: string, data?: any) => {
  console.log(`[Auth Debug][${step}] ${message}`, data || '')
}

const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    debugLog('decodeToken', 'Failed to decode token:', { error, token })
    throw error
  }
}

const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    session: async ({ session, token }: { session: Session; token: any }) => {
      debugLog('session', 'Starting session callback', { token })

      try {
        if (!token?.access || !token?.refresh) {
          debugLog('session', 'Missing tokens in session', { token })
          throw new Error('No tokens available')
        }

        const access = decodeToken(token.access)
        const refresh = decodeToken(token.refresh)

        debugLog('session', 'Decoded tokens', { access, refresh })

        // Check token expiration
        const now = Date.now() / 1000
        if (now > access.exp && now > refresh.exp) {
          debugLog('session', 'Both tokens expired', { accessExp: access.exp, refreshExp: refresh.exp, now })
          throw new Error('Refresh token expired')
        }

        // Update session
        session.user = {
          id: access.user_id,
          username: token.username
        }
        session.refreshToken = token.refresh
        session.accessToken = token.access

        debugLog('session', 'Session updated successfully', { session })
        return session
      } catch (error) {
        debugLog('session', 'Session callback error', { error })
        return Promise.reject({ error })
      }
    },
    jwt: async ({ token, user }) => {
      debugLog('jwt', 'Starting JWT callback', { token, user })

      // Initial sign in
      if (user) {
        debugLog('jwt', 'Initial sign in - updating token with user data', { user })
        return {
          ...token,
          access: user.access,
          refresh: user.refresh,
          username: user.username
        }
      }

      // Check if access token exists and is still valid
      if (token.access) {
        try {
          const decoded = decodeToken(token.access)
          const now = Date.now() / 1000

          debugLog('jwt', 'Checking token expiration', {
            exp: decoded.exp,
            now,
            timeLeft: decoded.exp - now
          })

          if (now < decoded.exp) {
            debugLog('jwt', 'Access token still valid')
            return token
          }
        } catch (error) {
          debugLog('jwt', 'Error decoding access token', { error })
        }
      }

      // Token refresh needed
      try {
        debugLog('jwt', 'Attempting token refresh')
        const apiClient = await getApiClient()
        const res = await apiClient.token.tokenRefreshCreate({
          refresh: token.refresh,
          access: token.access
        })

        debugLog('jwt', 'Token refresh successful', {
          newAccess: res.access?.substring(0, 20) + '...',
          newRefresh: res.refresh?.substring(0, 20) + '...'
        })

        return {
          ...token,
          access: res.access,
          refresh: res.refresh || token.refresh
        }
      } catch (error) {
        debugLog('jwt', 'Token refresh failed', { error })
        throw new Error('RefreshAccessTokenError')
      }
    }
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        debugLog('authorize', 'Starting authorization', { username: credentials?.username })

        if (!credentials?.username || !credentials?.password) {
          debugLog('authorize', 'Missing credentials')
          return null
        }

        try {
          const apiClient = await getApiClient()
          debugLog('authorize', 'Calling Django token endpoint')

          // Log the API URL being used
          debugLog('authorize', 'Using API URL', { url: process.env.API_URL })

          const res = await apiClient.token.tokenCreate({
            username: credentials.username,
            password: credentials.password,
            access: '',
            refresh: ''
          })

          debugLog('authorize', 'Django token response received', {
            access: res.access?.substring(0, 20) + '...',
            refresh: res.refresh?.substring(0, 20) + '...'
          })

          if (!res.access || !res.refresh) {
            debugLog('authorize', 'Missing tokens in response')
            return null
          }

          const userData = {
            id: decodeToken(res.access).user_id.toString(),
            username: credentials.username,
            access: res.access,
            refresh: res.refresh
          }

          debugLog('authorize', 'Authorization successful', {
            userId: userData.id,
            username: userData.username
          })

          return userData
        } catch (error) {
          debugLog('authorize', 'Authorization failed', { error })
          return null
        }
      }
    })
  ]
}

export { authOptions }
