import { useTranslation } from 'react-i18next'
import BasePortalLayout from './BasePortalLayout'

const sidebarItems = [
  { to: '/admin', label: 'admin:sidebar.dashboard', icon: '📊' },
  { to: '/admin/users', label: 'admin:sidebar.users', icon: '👥' },
  { to: '/admin/config', label: 'admin:sidebar.config', icon: '⚙' },
  { to: '/admin/roles', label: 'admin:sidebar.roles', icon: '🔐' },
  { to: '/admin/sla', label: 'admin:sidebar.sla', icon: '⏱' },
]

export default function AdminLayout() {
  const { t } = useTranslation('admin')

  return (
    <BasePortalLayout
      sidebarItems={sidebarItems}
      portalTitle={t('admin:portal')}
    />
  )
}
