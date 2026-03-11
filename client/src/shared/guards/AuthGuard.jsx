import { Navigate, Outlet } from 'react-router'
import useAuthStore from '@stores/authStore'
import Spinner from '@shared/components/ui/Spinner'

export default function AuthGuard() {
  const token = useAuthStore((s) => s.token)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return <Spinner />

  if (!token) return <Navigate to="/" replace />

  return <Outlet />
}
