import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import FormInput from '@shared/components/ui/FormInput'
import FormSelect from '@shared/components/ui/FormSelect'
import FormTextarea from '@shared/components/ui/FormTextarea'
import useClassificationsStore from '@stores/classificationsStore'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  region: '',
  district: '',
  address: '',
  industry: '',
  specialization: '',
  experienceYears: '',
  notes: '',
}

export default function RegisterCandidatePage() {
  const { t } = useTranslation('recruiter')
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [submitted, setSubmitted] = useState(false)
  const { industries: INDUSTRIES, languages: LANGUAGES, languageLevels: LANGUAGE_LEVELS, regions: REGIONS_UZ, fetch: fetchClassifications } = useClassificationsStore()

  useEffect(() => {
    fetchClassifications()
  }, [])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div>
        <PageHeader title={t('registerCandidate.title', 'Register Candidate')} />
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6 text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold">{t('registerCandidate.success', 'Candidate Registered Successfully')}</h3>
            <p className="text-gray-500 mt-2">{t('registerCandidate.successMessage', 'The candidate has been added to your pipeline.')}</p>
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#004AAD] text-white hover:bg-[#003d8f] transition-colors cursor-pointer mt-4" onClick={() => { setForm({ ...EMPTY_FORM }); setSubmitted(false) }}>
              {t('registerCandidate.registerAnother', 'Register Another')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={t('registerCandidate.title', 'Register Candidate')} subtitle={t('registerCandidate.subtitle', 'Fill in candidate details on their behalf')} />

      <form onSubmit={handleSubmit}>
        {/* Personal Info */}
        <div className="rounded-2xl border border-gray-100 bg-white mb-6">
          <div className="p-6">
            <h3 className="font-semibold mb-4">{t('registerCandidate.personalInfo', 'Personal Information')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label={t('registerCandidate.fullName', 'Full Name')} name="name" value={form.name} onChange={handleChange('name')} required />
              <FormInput label={t('registerCandidate.email', 'Email')} name="email" type="email" value={form.email} onChange={handleChange('email')} required />
              <FormInput label={t('registerCandidate.phone', 'Phone')} name="phone" type="tel" value={form.phone} onChange={handleChange('phone')} required placeholder="+998" />
              <FormInput label={t('registerCandidate.dob', 'Date of Birth')} name="dob" type="date" value={form.dob} onChange={handleChange('dob')} required />
              <FormSelect
                label={t('registerCandidate.gender', 'Gender')}
                name="gender"
                value={form.gender}
                onChange={handleChange('gender')}
                options={[
                  { value: 'male', label: t('registerCandidate.male') },
                  { value: 'female', label: t('registerCandidate.female') },
                ]}
                placeholder={t('registerCandidate.select')}
                required
              />
              <FormSelect
                label={t('registerCandidate.region', 'Region')}
                name="region"
                value={form.region}
                onChange={handleChange('region')}
                options={REGIONS_UZ.map((r) => ({ value: r, label: r }))}
                placeholder={t('registerCandidate.select')}
              />
              <FormInput label={t('registerCandidate.district', 'District')} name="district" value={form.district} onChange={handleChange('district')} />
              <FormInput label={t('registerCandidate.address', 'Address')} name="address" value={form.address} onChange={handleChange('address')} />
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="rounded-2xl border border-gray-100 bg-white mb-6">
          <div className="p-6">
            <h3 className="font-semibold mb-4">{t('registerCandidate.professionalInfo', 'Professional Information')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label={t('registerCandidate.industry', 'Industry')}
                name="industry"
                value={form.industry}
                onChange={handleChange('industry')}
                options={INDUSTRIES.map((i) => ({ value: i.id, label: i.label }))}
                placeholder={t('registerCandidate.select')}
              />
              <FormInput label={t('registerCandidate.specialization', 'Specialization')} name="specialization" value={form.specialization} onChange={handleChange('specialization')} />
              <FormInput label={t('registerCandidate.experience', 'Years of Experience')} name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange('experienceYears')} />
            </div>
            <FormTextarea
              label={t('registerCandidate.notes', 'Notes')}
              name="notes"
              value={form.notes}
              onChange={handleChange('notes')}
              placeholder={t('registerCandidate.notesPlaceholder')}
              rows={3}
              className="mt-4"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setForm({ ...EMPTY_FORM })}>{t('common:actions.cancel')}</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors cursor-pointer">{t('registerCandidate.register', 'Register Candidate')}</button>
        </div>
      </form>
    </div>
  )
}
