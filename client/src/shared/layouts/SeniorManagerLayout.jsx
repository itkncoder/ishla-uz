import { useTranslation } from 'react-i18next'
import BasePortalLayout from './BasePortalLayout'

const sidebarItems = [
  { to: '/senior-manager', label: 'seniorManager:sidebar.dashboard', icon: '📊' },
  { to: '/senior-manager/approvals', label: 'seniorManager:sidebar.approvals', icon: '✔' },
  { to: '/senior-manager/reports', label: 'seniorManager:sidebar.reports', icon: '📈' },
  { to: '/senior-manager/audit-log', label: 'seniorManager:sidebar.auditLog', icon: '📜' },
]

export default function SeniorManagerLayout() {
  const { t } = useTranslation('seniorManager')

  return (
    <BasePortalLayout
      sidebarItems={sidebarItems}
      portalTitle={t('seniorManager:portal')}
    />
  )
}
