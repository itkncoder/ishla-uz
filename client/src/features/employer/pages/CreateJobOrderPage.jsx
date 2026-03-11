import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Input, Textarea } from '@shared/components/styled/FormElements'
import Dropdown from '@shared/components/styled/Dropdown'
import useJobOrderStore from '@stores/jobOrderStore'
import useClassificationsStore from '@stores/classificationsStore'
import { formatSalary, parseSalary } from '@shared/utils/formatSalary'

const EMPTY_ORDER = {
  title: '',
  companyName: '',
  description: '',
  industry: '',
  country: '',
  city: '',
  experienceMin: '',
  gender: '',
  salaryAmount: '',
  salaryCurrency: 'USD',
  benefits: '',
}

export default function CreateJobOrderPage() {
  const { t } = useTranslation('employer')
  const navigate = useNavigate()
  const { industries: INDUSTRIES, countries: COUNTRIES, fetch: fetchClassifications } = useClassificationsStore()
  const createOrder = useJobOrderStore((s) => s.create)
  const optionalText = t('common:actions.optional', 'optional')

  useEffect(() => { fetchClassifications() }, [fetchClassifications])

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...EMPTY_ORDER })

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleCreate = () => {
    createOrder({
      title: form.title,
      description: form.description,
      employer: { id: 'e001', name: form.companyName, country: form.country },
      industry: form.industry,
      country: form.country,
      city: form.city,
      requirements: {
        experienceMin: Number(form.experienceMin) || 0,
        skills: [],
        languages: [],
        gender: form.gender || null,
        ageMin: 18,
        ageMax: 65,
      },
      salary: { amount: Number(form.salaryAmount), currency: form.salaryCurrency },
      benefits: form.benefits,
      recruiterId: 'r001',
    })
    navigate('/employer')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/employer')}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t('jobOrders.create')}</h1>
      </div>

      {/* Step indicator */}
      <div className="flex mb-8 border-b border-gray-200">
        {[1, 2].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
              step === s
                ? 'border-[#004AAD] text-[#004AAD]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= s ? 'bg-[#004AAD] text-white' : 'bg-gray-100 text-gray-400'
            }`}>{s}</span>
            {s === 1 ? t('jobOrders.stepBasic', 'Basic Info') : t('jobOrders.stepDetails', 'Details')}
          </button>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-5">
          <Input label={t('jobOrders.position')} value={form.title} onChange={handleChange('title')} required />
          <Input label={t('jobOrders.companyName')} value={form.companyName} onChange={handleChange('companyName')} required />
          <Textarea label={t('jobOrders.description')} value={form.description} onChange={handleChange('description')} rows={4} optional={optionalText} />
          <div className="grid grid-cols-2 gap-4">
            <Dropdown label={t('jobOrders.industry')} value={form.industry} onChange={(val) => setForm((prev) => ({ ...prev, industry: val }))} options={INDUSTRIES.map((i) => ({ value: i.id, label: i.label }))} placeholder={t('jobOrders.select')} searchable required />
            <Dropdown label={t('jobOrders.country')} value={form.country} onChange={(val) => setForm((prev) => ({ ...prev, country: val }))} options={COUNTRIES.map((c) => ({ value: c.id, label: c.label }))} placeholder={t('jobOrders.select')} searchable required />
          </div>
          <Input label={t('jobOrders.city')} value={form.city} onChange={handleChange('city')} optional={optionalText} />
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('jobOrders.salaryAmount')} value={formatSalary(form.salaryAmount)} onChange={(e) => setForm((prev) => ({ ...prev, salaryAmount: parseSalary(e.target.value) }))} placeholder="7 000 000" optional={optionalText} />
            <Dropdown label={t('jobOrders.currency')} value={form.salaryCurrency} onChange={(val) => setForm((prev) => ({ ...prev, salaryCurrency: val }))} options={[{ value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'UZS', label: 'UZS' }]} optional={optionalText} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('jobOrders.experienceMin')} type="number" value={form.experienceMin} onChange={handleChange('experienceMin')} optional={optionalText} />
            <Dropdown label={t('jobOrders.gender')} value={form.gender} onChange={(val) => setForm((prev) => ({ ...prev, gender: val }))} options={[{ value: '', label: t('jobOrders.genderAny') }, { value: 'male', label: t('jobOrders.genderMale') }, { value: 'female', label: t('jobOrders.genderFemale') }]} placeholder={t('jobOrders.select')} optional={optionalText} />
          </div>
          <Textarea label={t('jobOrders.benefits')} value={form.benefits} onChange={handleChange('benefits')} rows={3} optional={optionalText} />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        {step === 1 ? (
          <>
            <button
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate('/employer')}
            >
              {t('common:actions.cancel')}
            </button>
            <button
              className="px-6 py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] hover:shadow-xs transition-all cursor-pointer"
              onClick={() => setStep(2)}
            >
              {t('common:actions.next', 'Next')}
            </button>
          </>
        ) : (
          <>
            <button
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setStep(1)}
            >
              {t('common:actions.back', 'Back')}
            </button>
            <button
              className="px-6 py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] hover:shadow-xs transition-all cursor-pointer"
              onClick={handleCreate}
            >
              {t('common:actions.save')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
