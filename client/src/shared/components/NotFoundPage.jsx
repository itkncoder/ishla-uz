import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation('common')

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-200">404</h1>
        <p className="mt-4 text-xl font-semibold text-gray-900">{t('notFoundTitle')}</p>
        <p className="mt-2 text-gray-500">{t('notFoundMessage')}</p>
        <Link to="/" className="inline-block mt-6 px-6 py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors">
          {t('goHome')}
        </Link>
      </div>
    </div>
  )
}
