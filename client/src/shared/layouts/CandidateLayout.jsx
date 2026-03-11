import { useTranslation } from 'react-i18next'
import BasePortalLayout from './BasePortalLayout'

const sidebarItems = [
  { to: '/candidate', label: 'candidate:sidebar.dashboard', icon: '📊' },
  { to: '/candidate/documents', label: 'candidate:sidebar.documents', icon: '📄' },
  { to: '/candidate/timeline', label: 'candidate:sidebar.timeline', icon: '📅' },
  { to: '/candidate/contract', label: 'candidate:sidebar.contract', icon: '📝' },
  { to: '/candidate/profile', label: 'candidate:sidebar.profile', icon: '👤' },
]

export default function CandidateLayout() {
  const { t } = useTranslation('candidate')

  return (
    <BasePortalLayout
      sidebarItems={sidebarItems}
      portalTitle={t('candidate:portal')}
    />
  )
}
