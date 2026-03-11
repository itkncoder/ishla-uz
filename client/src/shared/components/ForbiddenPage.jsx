import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function ForbiddenPage() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-200">403</h1>
        <p className="mt-4 text-xl font-semibold text-gray-900">{t('forbiddenTitle')}</p>
        <p className="mt-2 text-gray-500">{t('forbiddenMessage')}</p>
        <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors cursor-pointer">
          {t('goBack')}
        </button>
      </div>
    </div>
  )
}
