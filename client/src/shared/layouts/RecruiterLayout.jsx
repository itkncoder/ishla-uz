import { useTranslation } from 'react-i18next'
import BasePortalLayout from './BasePortalLayout'

const sidebarItems = [
  { to: '/recruiter', label: 'recruiter:sidebar.dashboard', icon: '📊' },
  { to: '/recruiter/assignments', label: 'recruiter:sidebar.assignments', icon: '📌' },
  { to: '/recruiter/assessment', label: 'recruiter:sidebar.assessment', icon: '✅' },
  { to: '/recruiter/documents', label: 'recruiter:sidebar.documents', icon: '📄' },
  { to: '/recruiter/register-candidate', label: 'recruiter:sidebar.registerCandidate', icon: '➕' },
]

export default function RecruiterLayout() {
  const { t } = useTranslation('recruiter')

  return (
    <BasePortalLayout
      sidebarItems={sidebarItems}
      portalTitle={t('recruiter:portal')}
    />
  )
}
