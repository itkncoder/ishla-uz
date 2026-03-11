import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import useAuthStore from '@stores/authStore'

export default function AuthGuard() {
  const user = useAuthStore((s) => s.user)
  const isAuthChecked = useAuthStore((s) => s.isAuthChecked)
  const checkAuth = useAuthStore((s) => s.checkAuth)

  useEffect(() => {
    if (!isAuthChecked) {
      checkAuth()
    }
  }, [isAuthChecked, checkAuth])

  // Show nothing while verifying token with server
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-[#004AAD] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
