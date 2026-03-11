import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import useAuthStore from '@stores/authStore'
import { ROLE_CONFIG } from '@config/roles'
import { sanitizeString, isValidEmail } from '@shared/utils/sanitize'
import GoogleLoginButton from '@shared/components/GoogleLoginButton'

export default function AuthModal({ open, onClose }) {
  const navigate = useNavigate()
  const { t: tAuth } = useTranslation('auth')
  const { login, sendOtp, isLoading } = useAuthStore()

  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [authError, setAuthError] = useState('')

  const resetState = () => {
    setOtpStep(false)
    setOtp('')
    setAuthError('')
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleSendLoginOtp = async (e) => {
    e.preventDefault()
    setAuthError('')
    const email = sanitizeString(loginEmail)
    if (!isValidEmail(email)) {
      setAuthError(tAuth('invalidEmail', 'Invalid email format'))
      return
    }
    try {
      await sendOtp(email)
      setOtpStep(true)
    } catch (err) {
      setAuthError(err.response?.data?.message || tAuth('loginError'))
    }
  }

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault()
    setAuthError('')
    try {
      const data = await login({ email: loginEmail, otp })
      handleClose()
      const config = ROLE_CONFIG[data.user.role]
      navigate(config?.homeRoute || '/', { replace: true })
    } catch (err) {
      setAuthError(err.response?.data?.message || tAuth('loginError'))
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-[460px] animate-[modalIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-white rounded-xl border border-gray-200 px-8 py-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{tAuth('loginTitle')}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {otpStep
                ? tAuth('otpSent', 'We sent a code to your email')
                : tAuth('enterEmail', 'Enter your email to receive a code')}
            </p>

            {authError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            {!otpStep ? (
              <form onSubmit={handleSendLoginOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{tAuth('email')}</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD]"
                    placeholder={tAuth('emailPlaceholder')}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#004AAD] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003d8f] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : tAuth('sendOtp', 'Send code')}
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-400">{tAuth('or')}</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <GoogleLoginButton onError={(msg) => setAuthError(msg)} onClose={handleClose} />
              </form>
            ) : (
              <form onSubmit={handleVerifyLoginOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{tAuth('otpCode', 'Verification code')}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD] text-center tracking-[0.3em] text-lg font-semibold"
                    placeholder="12345"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    required
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#004AAD] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003d8f] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : tAuth('loginButton')}
                </button>
                <button
                  type="button"
                  onClick={() => { setOtpStep(false); setOtp(''); setAuthError('') }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  {tAuth('changeEmail', 'Change email')}
                </button>
              </form>
            )}

        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </span>
  )
}
