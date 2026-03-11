import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@shared/components/styled/FormElements'
import Dropdown from '@shared/components/styled/Dropdown'
import PhoneInput from '@shared/components/styled/PhoneInput'
import FileUpload from '@shared/components/ui/FileUpload'
import StatusBadge from '@shared/components/StatusBadge'
import useClassificationsStore from '@stores/classificationsStore'
import { employersApi } from '@/api/employers'
import { localizeLabel } from '@shared/utils/localize'

const STATUS_STEPS = ['pending', 'submitted', 'under_review', 'verified']

const STEP_ICONS = [
  <svg key="0" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  <svg key="1" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  <svg key="2" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
]

export default function KycPage() {
  const { t, i18n } = useTranslation('employer')
  const lang = i18n.language
  const loc = (item) => localizeLabel(item, lang)
  const { countries: COUNTRIES, industries: INDUSTRIES, fetch: fetchClassifications } = useClassificationsStore()

  useEffect(() => { fetchClassifications() }, [fetchClassifications])

  const [kyc, setKyc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    employersApi.getMyKyc()
      .then((data) => setKyc(data))
      .catch(() => setError('Failed to load KYC data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#004AAD] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !kyc) {
    return <div className="text-center py-20 text-red-500">{error}</div>
  }

  const status = kyc?.kycStatus || 'pending'
  const isReadOnly = status === 'submitted' || status === 'under_review' || status === 'verified'
  const canEdit = !isReadOnly || editing
  const kycStep = STATUS_STEPS.indexOf(status)

  const handleChange = (field, value) => {
    setKyc((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const updated = await employersApi.submitKyc({
        companyName: kyc.companyName,
        country: kyc.country,
        city: kyc.city,
        industry: kyc.industry,
        contactName: kyc.contactName,
        contactPhone: kyc.contactPhone,
        contactEmail: kyc.contactEmail,
      })
      setKyc(updated)
      setEditing(false)
      setShowSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit KYC')
    } finally {
      setSaving(false)
    }
  }

  const handleDocUpload = async (docType, file) => {
    try {
      const updated = await employersApi.uploadKycDocument(docType, file)
      setKyc(updated)
    } catch {
      setError('Failed to upload document')
    }
  }

  // Wizard steps
  const WIZARD_STEPS = [
    { key: 'company', label: t('kyc.companyInfo', 'Company') },
    { key: 'contact', label: t('kyc.contactPerson', 'Contact') },
    { key: 'documents', label: t('kyc.uploadDocuments', 'Documents') },
  ]

  const canGoNext = () => {
    if (step === 0) return kyc.companyName && kyc.country && kyc.city
    if (step === 1) return kyc.contactName && kyc.contactPhone && kyc.contactEmail
    return true
  }

  const badgeStatus = status === 'verified' ? 'approved' : status === 'rejected' ? 'rejected' : status === 'submitted' ? 'pending' : status === 'under_review' ? 'reviewing' : 'pending'

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('kyc.title')}</h1>
        <StatusBadge status={badgeStatus} />
      </div>

      {/* KYC Status Progress */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 mb-6">
        <div className="flex items-center">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${i <= kycStep ? 'bg-[#004AAD] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i < kycStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : i + 1}
                </div>
                <span className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${i <= kycStep ? 'text-[#004AAD]' : 'text-gray-400'}`}>
                  {t(`kyc.steps.${s}`, s)}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-1.25rem] transition-colors ${i < kycStep ? 'bg-[#004AAD]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {status === 'rejected' && (
          <p className="text-sm text-red-600 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            {kyc.rejectionNote || t('kyc.rejectedMessage', 'Your verification was rejected. Please update your information and resubmit.')}
          </p>
        )}

        {status === 'verified' && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm text-green-700 font-medium">{t('kyc.verifiedMessage', 'Your company has been verified successfully.')}</span>
          </div>
        )}
      </div>

      {/* Edit toggle for readonly states */}
      {isReadOnly && !editing && status !== 'under_review' && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-[#004AAD] hover:underline cursor-pointer"
            onClick={() => { setEditing(true); setStep(0) }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            {t('common:actions.edit')}
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          {error}
        </div>
      )}

      {/* Wizard Step Tabs */}
      {canEdit && (
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
          {WIZARD_STEPS.map((ws, i) => (
            <button
              key={ws.key}
              type="button"
              onClick={() => setStep(i)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                step === i
                  ? 'bg-white text-[#004AAD] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {STEP_ICONS[i]}
              <span className="hidden sm:inline">{ws.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Form Content */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        {/* Step 0: Company Info */}
        {(canEdit ? step === 0 : true) && (
          <div className={canEdit && step !== 0 ? 'hidden' : ''}>
            {!canEdit && <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">{STEP_ICONS[0]} {t('kyc.companyInfo', 'Company Information')}</h3>}
            <div className="space-y-4">
              <Dropdown
                label={t('kyc.industry', 'Industry')}
                value={kyc.industry || ''}
                onChange={(val) => handleChange('industry', val)}
                options={INDUSTRIES.map((i) => ({ value: i.id, label: loc(i) }))}
                placeholder={t('kyc.selectIndustry', 'Select industry')}
                searchable
              />
              <Input
                label={t('kyc.companyName')}
                value={kyc.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                disabled={!canEdit}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dropdown
                  label={t('kyc.country')}
                  value={kyc.country || ''}
                  onChange={(val) => handleChange('country', val)}
                  options={COUNTRIES.map((c) => ({ value: c.id, label: loc(c) }))}
                  placeholder={t('kyc.selectCountry', 'Select country')}
                  searchable
                  dropUp
                  required
                />
                <Input
                  label={t('kyc.city', 'City')}
                  value={kyc.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  disabled={!canEdit}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Contact Person */}
        {(canEdit ? step === 1 : true) && (
          <div className={canEdit && step !== 1 ? 'hidden' : ''}>
            {!canEdit && <div className="border-t border-gray-100 my-6" />}
            {!canEdit && <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">{STEP_ICONS[1]} {t('kyc.contactPerson', 'Contact Person')}</h3>}
            <div className="space-y-4">
              <Input
                label={t('kyc.contactName', 'Full Name')}
                value={kyc.contactName || ''}
                onChange={(e) => handleChange('contactName', e.target.value)}
                disabled={!canEdit}
                required
              />
              <PhoneInput
                label={t('kyc.contactPhone', 'Phone')}
                value={kyc.contactPhone || ''}
                onChange={(val) => handleChange('contactPhone', val)}
                disabled={!canEdit}
                required
              />
              <Input
                label={t('kyc.contactEmail', 'Email')}
                type="email"
                value={kyc.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                disabled={!canEdit}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {(canEdit ? step === 2 : true) && (
          <div className={canEdit && step !== 2 ? 'hidden' : ''}>
            {!canEdit && <div className="border-t border-gray-100 my-6" />}
            {!canEdit && <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">{STEP_ICONS[2]} {t('kyc.uploadDocuments', 'Documents')}</h3>}
            <p className="text-sm text-gray-500 mb-1">{t('kyc.documentsHint', 'Upload clear scans or photos of your company documents.')}</p>
            <p className="text-xs text-gray-400 mb-4">{t('kyc.documentsOptional', 'Documents are optional but help speed up verification.')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload
                label={t('kyc.businessLicense', 'Business License')}
                accept=".pdf,.jpg,.png"
                disabled={!canEdit}
                onChange={(file) => handleDocUpload('businessLicense', file)}
                preview={kyc.businessLicensePath ? `${import.meta.env.VITE_API_URL || ''}/${kyc.businessLicensePath}` : null}
              />
              <FileUpload
                label={t('kyc.registrationCert', 'Registration Certificate')}
                accept=".pdf,.jpg,.png"
                disabled={!canEdit}
                onChange={(file) => handleDocUpload('registrationCert', file)}
                preview={kyc.registrationCertPath ? `${import.meta.env.VITE_API_URL || ''}/${kyc.registrationCertPath}` : null}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation / Submit */}
      {canEdit && (
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => step > 0 ? setStep(step - 1) : editing ? setEditing(false) : null}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              step > 0 || editing
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-300 cursor-default'
            }`}
            disabled={step === 0 && !editing}
          >
            {step > 0 ? t('kyc.back', 'Back') : editing ? t('common:actions.cancel') : ''}
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="px-6 py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003a8c] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {t('kyc.next', 'Next')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003a8c] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  {t('kyc.submitting', 'Submitting...')}
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t('kyc.submitKyc')}
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('kyc.submittedTitle', 'Application Submitted!')}</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{t('kyc.submittedMessage', 'Your KYC verification is being reviewed. This may take some time.')}</p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="w-full px-6 py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003a8c] transition-colors cursor-pointer"
            >
              {t('kyc.gotIt', 'Got it')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
