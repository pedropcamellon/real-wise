'use client'

import { useSession } from 'next-auth/react'
import { User, RoleName } from '@/types/role'

export const useAuth = () => {
  const { data: session } = useSession()
  const user = session?.user as User | undefined

  const hasRole = (roleName: RoleName) => 
    user?.roles?.some(role => role.name === roleName) ?? false

  const isAgent = hasRole('agent')
  const isUser = hasRole('user')

  return {
    user,
    isAgent,
    isUser,
    hasRole,
    isAuthenticated: !!user
  }
}
