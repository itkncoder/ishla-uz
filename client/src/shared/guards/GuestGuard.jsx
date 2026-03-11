import { Navigate, Outlet } from 'react-router'
import useAuthStore from '@stores/authStore'
import { ROLE_CONFIG } from '@config/roles'

export default function GuestGuard() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)

  if (token && user) {
    const config = ROLE_CONFIG[user.role]
    const home = config?.homeRoute || '/'
    return <Navigate to={home} replace />
  }

  return <Outlet />
}
