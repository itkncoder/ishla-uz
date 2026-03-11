import { Navigate } from 'react-router'
import useAuthStore from '@stores/authStore'
import { ROLE_CONFIG } from '@config/roles'
import HomePage from '@features/home/HomePage'

export default function HomeRedirect() {
  const user = useAuthStore((s) => s.user)

  if (user) {
    const config = ROLE_CONFIG[user.activeRole || user.role]
    if (config?.homeRoute) {
      return <Navigate to={config.homeRoute} replace />
    }
  }

  return <HomePage />
}
