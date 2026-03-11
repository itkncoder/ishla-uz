import { useTranslation } from 'react-i18next'
import BasePortalLayout from './BasePortalLayout'

const sidebarItems = [
  { to: '/visa-officer', label: 'visaOfficer:sidebar.dashboard', icon: '📊' },
  { to: '/visa-officer/visa-forms', label: 'visaOfficer:sidebar.visaForms', icon: '🛂' },
  { to: '/visa-officer/batch-monitoring', label: 'visaOfficer:sidebar.batchMonitoring', icon: '📦' },
]

export default function VisaOfficerLayout() {
  const { t } = useTranslation('visaOfficer')

  return (
    <BasePortalLayout
      sidebarItems={sidebarItems}
      portalTitle={t('visaOfficer:portal')}
    />
  )
}
