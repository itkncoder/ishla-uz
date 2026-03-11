import { Navigate, Outlet } from 'react-router'
import useAuthStore from '@stores/authStore'

export default function RoleGuard({ roles }) {
  const user = useAuthStore((s) => s.user)
  const isAuthChecked = useAuthStore((s) => s.isAuthChecked)

  // Still loading — AuthGuard above should handle this,
  // but defend in case RoleGuard is used standalone
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-[#004AAD] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user || !Array.isArray(roles) || !roles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
