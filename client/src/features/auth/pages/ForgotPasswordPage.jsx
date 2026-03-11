import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="w-full max-w-[460px]">
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">{t('forgotPassword')}</h2>

        {submitted ? (
          <div className="mt-4 text-center">
            <p className="text-gray-500">{t('resetEmailSent')}</p>
            <Link to="/" className="inline-block mt-4 px-6 py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors">
              {t('backToLogin')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD]"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="w-full rounded-lg bg-[#004AAD] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003d8f] cursor-pointer">
              {t('sendResetLink')}
            </button>

            <p className="text-center text-sm">
              <Link to="/" className="text-[#004AAD] hover:text-[#003d8f] font-medium transition-colors">
                {t('backToLogin')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
