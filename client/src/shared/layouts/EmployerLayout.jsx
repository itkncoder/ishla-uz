import { useTranslation } from 'react-i18next'
import BasePortalLayout from './BasePortalLayout'

const sidebarItems = [
  { to: '/employer', label: 'employer:sidebar.dashboard', icon: '📊' },
  { to: '/employer/kyc', label: 'employer:sidebar.kyc', icon: '🏢' },
  { to: '/employer/job-orders', label: 'employer:sidebar.jobOrders', icon: '📋' },
  { to: '/employer/showcase', label: 'employer:sidebar.showcase', icon: '🖼' },
]

export default function EmployerLayout() {
  const { t } = useTranslation('employer')

  return (
    <BasePortalLayout
      sidebarItems={sidebarItems}
      portalTitle={t('employer:portal')}
    />
  )
}
