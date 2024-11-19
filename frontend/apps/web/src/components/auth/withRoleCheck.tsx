'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { ComponentType } from 'react'
import { RoleName } from '@/types/role'

interface RoleCheckProps {
  allowedRoles?: RoleName[];
  requiredPermissions?: string[];
}

export const withRoleCheck = (
  WrappedComponent: ComponentType<any>,
  { allowedRoles = [], requiredPermissions = [] }: RoleCheckProps
) => {
  return function WithRoleCheckComponent(props: any) {
    const { user, hasRole } = useAuth()

    // Check if user has required role
    const hasRequiredRole = allowedRoles.length === 0 || 
      allowedRoles.some(role => hasRole(role))

    if (!user || !hasRequiredRole) {
      redirect('/')
    }

    return <WrappedComponent {...props} />
  }
}
