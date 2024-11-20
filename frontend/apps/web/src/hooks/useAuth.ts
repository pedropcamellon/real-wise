'use client'

import { useSession } from 'next-auth/react'
import { User, UserRole } from '@/types/role'
import { SessionUser } from '@/types/session'

export const useAuth = () => {
  const { data: session } = useSession()
  const sessionUser = session?.user as SessionUser | undefined

  const user: User | null = sessionUser ? {
    username: sessionUser.username,
    first_name: '',
    last_name: '',
    roles: ['user'] // Default role, update when roles are implemented
  } : null

  const hasRole = (userRole: UserRole) =>
    user?.roles?.some((r: UserRole) => r === userRole) ?? false

  const isAgent = hasRole('agent')
  const isUser = hasRole('user')

  return {
    user,
    // TODO Remove when roles are implemented
    isAgent: true,
    isUser,
    hasRole,
    isAuthenticated: !!user
  }
}
