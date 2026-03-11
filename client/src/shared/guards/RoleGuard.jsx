import { Navigate, Outlet } from 'react-router'
import useAuthStore from '@stores/authStore'

export default function RoleGuard({ allowedRoles }) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
