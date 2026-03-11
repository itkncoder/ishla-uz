import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import useAuthStore from '@stores/authStore'

export default function RoleSwitcher() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const activeRole = useAuthStore((s) => s.user?.activeRole || 'candidate')
  const switchRole = useAuthStore((s) => s.switchRole)

  const handleSwitch = (role) => {
    if (role === activeRole) return
    switchRole(role)
    navigate(role === 'candidate' ? '/candidate' : '/employer')
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-0.5">
      <button
        onClick={() => handleSwitch('candidate')}
        className={`px-3 py-1.5 rounded-full flex-1 text-xs font-medium transition-all duration-200 cursor-pointer ${
          activeRole === 'candidate'
            ? 'bg-[#004AAD] text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        {t('roles.candidate', 'Candidate')}
      </button>
      <button
        onClick={() => handleSwitch('employer')}
        className={`px-3 py-1.5 rounded-full flex-1 text-xs font-medium transition-all duration-200 cursor-pointer ${
          activeRole === 'employer'
            ? 'bg-[#004AAD] text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        {t('roles.employer', 'Employer')}
      </button>
    </div>
  )
}
