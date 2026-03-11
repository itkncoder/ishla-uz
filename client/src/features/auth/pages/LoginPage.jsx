import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import useAuthStore from '@stores/authStore'
import { ROLE_CONFIG } from '@config/roles'
import { sanitizeString, isValidEmail } from '@shared/utils/sanitize'
import GoogleLoginButton from '@shared/components/GoogleLoginButton'

const OTP_LENGTH = 5

function OtpInput({ value, onChange }) {
  const inputs = useRef([])

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) return
    const next = [...value]
    next[idx] = val[0]
    onChange(next)
    if (idx < OTP_LENGTH - 1) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (value[idx]) {
        const next = [...value]
        next[idx] = ''
        onChange(next)
      } else if (idx > 0) {
        inputs.current[idx - 1]?.focus()
        const next = [...value]
        next[idx - 1] = ''
        onChange(next)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = [...value]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    onChange(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    inputs.current[focusIdx]?.focus()
  }

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-14 rounded-xl border-2 border-gray-200 bg-white text-center text-xl font-bold text-gray-900 outline-none transition-all focus:border-[#004AAD] focus:ring-4 focus:ring-[#004AAD]/10 caret-transparent"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { login, sendOtp, isLoading } = useAuthStore()

  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const startCountdown = () => {
    setCountdown(60)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    const cleanEmail = sanitizeString(email)
    if (!isValidEmail(cleanEmail)) {
      setError(t('invalidEmail', 'Invalid email format'))
      return
    }
    try {
      await sendOtp(cleanEmail)
      setStep('otp')
      startCountdown()
    } catch (err) {
      setError(err.response?.data?.message || t('otpSendError'))
    }
  }

  const handleResend = async () => {
    setError('')
    try {
      await sendOtp(email)
      startCountdown()
      setOtp(Array(OTP_LENGTH).fill(''))
    } catch (err) {
      setError(err.response?.data?.message || t('otpSendError'))
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    const otpStr = otp.join('')
    if (otpStr.length < OTP_LENGTH) {
      setError(t('otpIncomplete'))
      return
    }
    try {
      const data = await login({ email, otp: otpStr })
      const config = ROLE_CONFIG[data.user.role]
      navigate(config?.homeRoute || '/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || t('loginError'))
    }
  }

  const handleBack = () => {
    setStep('email')
    setOtp(Array(OTP_LENGTH).fill(''))
    setError('')
    clearInterval(timerRef.current)
    setCountdown(0)
  }

  return (
    <div className="w-full max-w-[460px]">
      <div className="bg-white rounded-xl border border-gray-200 px-8 py-8">

        {step === 'email' ? (
          <>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">{t('loginTitle')}</h1>
            <p className="text-sm text-gray-500 mb-6">{t('loginSubtitle')}</p>

            {error && <ErrorBanner message={error} />}

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD]"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full rounded-lg bg-[#004AAD] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003d8f] focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? <Spinner label={t('otpSending')} /> : t('otpSendButton')}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">{t('or')}</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <GoogleLoginButton onError={(msg) => setError(msg)} />

            {/* Demo hint */}
            <div className="mt-5 rounded-lg bg-[#e8f0fe] border border-[#a8c7f5] px-4 py-3">
              <p className="text-xs text-[#003275] font-medium mb-1">{t('demoHint')}</p>
              <p className="text-xs text-[#004AAD]">candidate@ishla.uz, employer@ishla.uz, recruiter@ishla.uz, admin@ishla.uz</p>
              <p className="text-xs text-[#004AAD] mt-0.5">{t('demoOtp')}: <span className="font-bold">12345</span></p>
            </div>
          </>
        ) : (
          <>
            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              {t('back')}
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#d0e2ff] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#004AAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">{t('otpTitle')}</h1>
              <p className="text-sm text-gray-500">{t('otpSentTo')} <span className="font-medium text-gray-700">{email}</span></p>
            </div>

            {error && <ErrorBanner message={error} />}

            <form onSubmit={handleVerify} className="space-y-6">
              <OtpInput value={otp} onChange={setOtp} />

              <button
                type="submit"
                disabled={isLoading || otp.join('').length < OTP_LENGTH}
                className="w-full rounded-lg bg-[#004AAD] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003d8f] focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? <Spinner label={t('otpVerifying')} /> : t('otpVerifyButton')}
              </button>
            </form>

            <div className="text-center mt-4">
              {countdown > 0 ? (
                <p className="text-sm text-gray-400">{t('otpResendIn', { seconds: countdown })}</p>
              ) : (
                <button onClick={handleResend} className="text-sm text-[#004AAD] hover:text-[#003275] font-medium cursor-pointer transition-colors">
                  {t('otpResend')}
                </button>
              )}
            </div>
          </>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">{t('or')}</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">{t('noAccount')}</p>
          <Link
            to="/auth/register"
            className="inline-block w-full rounded-lg border border-[#004AAD] px-4 py-2.5 text-sm font-medium text-[#004AAD] transition-colors hover:bg-[#e8f0fe] cursor-pointer"
          >
            {t('createAccount')}
          </Link>
        </div>
      </div>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  )
}

function Spinner({ label }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {label}
    </span>
  )
}
