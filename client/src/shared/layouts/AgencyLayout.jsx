import { useTranslation } from 'react-i18next'
import BasePortalLayout from './BasePortalLayout'

const sidebarItems = [
  { to: '/agency', label: 'agency:sidebar.dashboard', icon: '📊' },
  { to: '/agency/recruiters', label: 'agency:sidebar.recruiters', icon: '👥' },
  { to: '/agency/candidates', label: 'agency:sidebar.candidates', icon: '📋' },
  { to: '/agency/reports', label: 'agency:sidebar.reports', icon: '📈' },
]

export default function AgencyLayout() {
  const { t } = useTranslation('agency')

  return (
    <BasePortalLayout
      sidebarItems={sidebarItems}
      portalTitle={t('agency:portal', 'Agency Portal')}
    />
  )
}
