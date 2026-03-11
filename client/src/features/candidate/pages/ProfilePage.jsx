import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useCandidateProfileStore from '@stores/candidateProfileStore'
import useAuthStore from '@stores/authStore'
import useClassificationsStore from '@stores/classificationsStore'
import Section from '@shared/components/styled/Section'
import Dropdown from '@shared/components/styled/Dropdown'
import PhoneInput from '@shared/components/styled/PhoneInput'
import { Input, AddButton, ItemCard } from '@shared/components/styled/FormElements'

import { localizeLabel } from '@shared/utils/localize'

/* ── Main Page ── */
export default function ProfilePage() {
  const { t, i18n } = useTranslation(['candidate', 'common', 'auth'])
  const lang = i18n.language
  const loc = (item) => localizeLabel(item, lang)
  const {
    industries: INDUSTRIES,
    specializations: SPECIALIZATIONS,
    languages: LANGUAGES,
    languageLevels: LANGUAGE_LEVELS,
    regions: REGIONS_UZ,
    fetch: fetchClassifications,
  } = useClassificationsStore()

  useEffect(() => { fetchClassifications() }, [])

  const user = useAuthStore((s) => s.user)
  const profile = useCandidateProfileStore((s) => s.profile)
  const updateField = useCandidateProfileStore((s) => s.updateField)
  const addEducation = useCandidateProfileStore((s) => s.addEducation)
  const removeEducation = useCandidateProfileStore((s) => s.removeEducation)
  const addWorkExperience = useCandidateProfileStore((s) => s.addWorkExperience)
  const removeWorkExperience = useCandidateProfileStore((s) => s.removeWorkExperience)
  const addLanguage = useCandidateProfileStore((s) => s.addLanguage)
  const removeLanguage = useCandidateProfileStore((s) => s.removeLanguage)
  const getProfileCompleteness = useCandidateProfileStore((s) => s.getProfileCompleteness)

  const completeness = getProfileCompleteness()

  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', field: '', year: '' })
  const [newExp, setNewExp] = useState({ company: '', position: '', years: '' })
  const [newLang, setNewLang] = useState({ id: '', level: '' })
  const [showEduForm, setShowEduForm] = useState(false)
  const [showExpForm, setShowExpForm] = useState(false)
  const [showLangForm, setShowLangForm] = useState(false)

  const handleAddEducation = () => {
    if (!newEdu.institution || !newEdu.degree) return
    addEducation(newEdu)
    setNewEdu({ institution: '', degree: '', field: '', year: '' })
    setShowEduForm(false)
  }

  const handleAddExperience = () => {
    if (!newExp.company || !newExp.position) return
    addWorkExperience(newExp)
    setNewExp({ company: '', position: '', years: '' })
    setShowExpForm(false)
  }

  const handleAddLanguage = () => {
    if (!newLang.id || !newLang.level) return
    addLanguage(newLang)
    setNewLang({ id: '', level: '' })
    setShowLangForm(false)
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#004AAD] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userName = profile.name || user?.name
  const userInitial = userName?.charAt(0)?.toUpperCase() || '?'

  // Build specialization options based on selected industry
  const specOptions = profile.industry && SPECIALIZATIONS[profile.industry]
    ? SPECIALIZATIONS[profile.industry].map((s) => ({ value: s.label, label: loc(s) }))
    : []

  // Year options
  const currentYear = new Date().getFullYear()
  const birthYearOptions = Array.from({ length: 62 }, (_, i) => ({ value: String(currentYear - 18 - i), label: String(currentYear - 18 - i) }))
  const eduYearOptions = Array.from({ length: 50 }, (_, i) => ({ value: String(currentYear - i), label: String(currentYear - i) }))
  const expYearOptions = [
    { value: '<1', label: '<1' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10+', label: '10+' },
  ]

  // Degree options
  const degreeOptions = [
    { value: 'bachelor', label: t('profile.degreeBachelor', 'Bachelor') },
    { value: 'master', label: t('profile.degreeMaster', 'Master') },
    { value: 'phd', label: t('profile.degreePhd', 'PhD') },
    { value: 'diploma', label: t('profile.degreeDiploma', 'Diploma') },
    { value: 'certificate', label: t('profile.degreeCertificate', 'Certificate') },
    { value: 'other', label: t('profile.degreeOther', 'Other') },
  ]

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* ── Complete Profile Banner ── */}
      {user && !user.profileCompleted && completeness < 100 && (
        <div className="rounded-xl bg-[#e8f0fe] border border-[#a8c7f5] px-5 py-4 mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 text-[#004AAD] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-[#003275]">{t('auth:completeProfileTitle')}</p>
            <p className="text-xs text-[#004AAD] mt-0.5">{t('auth:completeProfileSubtitle')}</p>
          </div>
        </div>
      )}

      {/* ── Header Card ── */}
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Initial */}
          <div className="w-20 h-20 rounded-2xl bg-[#004AAD] flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {userInitial}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-bold text-gray-900">{userName}</h1>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email || profile.email}</p>
            <p className="text-xs text-gray-400 mt-1">{profile.region && `${loc(REGIONS_UZ.find((r) => r.id === profile.region)) || profile.region}, `}{profile.specialization || t('profile.noSpecialization', 'No specialization yet')}</p>
          </div>

          {/* Completeness Bar */}
          <div className="flex-1 sm:max-w-[280px] w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{t('profile.complete', 'Complete')}</span>
              <span className={`text-sm font-bold ${completeness >= 60 ? 'text-[#004AAD]' : 'text-amber-500'}`}>{completeness}%</span>
            </div>
            <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${completeness >= 60 ? 'bg-[#004AAD]' : 'bg-amber-400'}`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Left Column: Personal Info ── */}
        <div className="space-y-5">
          {/* Personal Info */}
          <Section title={t('profile.personalInfo')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}>
            <div className="space-y-4">
              <Input label={t('profile.fullName', 'Full Name')} value={profile.name} onChange={(e) => updateField('name', e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  label={t('profile.dob', 'Birth Year')}
                  value={profile.dob}
                  onChange={(val) => updateField('dob', val)}
                  options={birthYearOptions}
                  placeholder={t('profile.yearLabel', 'Year')}
                  required
                />
                <Dropdown
                  label={t('profile.gender', 'Gender')}
                  value={profile.gender}
                  onChange={(val) => updateField('gender', val)}
                  options={[
                    { value: 'male', label: t('profile.male', 'Male') },
                    { value: 'female', label: t('profile.female', 'Female') },
                  ]}
                  placeholder={t('profile.selectGender', 'Select gender')}
                />
              </div>
              <PhoneInput label={t('profile.phone', 'Phone')} value={profile.phone} onChange={(val) => updateField('phone', val)} required />
              <Dropdown
                label={t('profile.region', 'Region')}
                value={profile.region}
                onChange={(val) => updateField('region', val)}
                options={REGIONS_UZ.map((r) => ({ value: r.id, label: loc(r) }))}
                placeholder={t('profile.selectRegion', 'Select region')}
                searchable
              />
            </div>
          </Section>
        </div>

        {/* ── Right Column: Skills, Experience, Languages, Education ── */}
        <div className="space-y-5">
          {/* Skills & Specialization */}
          <Section title={t('profile.skills')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a1.5 1.5 0 010-2.12l.88-.88a1.5 1.5 0 012.12 0l2.83 2.83 5.66-5.66a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-7.78 7.78a1.5 1.5 0 01-2.12 0z" /></svg>}>
            <div className="space-y-4">
              <Dropdown
                label={t('profile.industry', 'Industry')}
                value={profile.industry}
                onChange={(val) => {
                  updateField('industry', val)
                  updateField('specialization', '')
                }}
                options={INDUSTRIES.map((i) => ({ value: i.id, label: loc(i) }))}
                placeholder={t('profile.selectIndustry', 'Select industry')}
                searchable
              />
              <Dropdown
                label={t('profile.specialization', 'Specialization')}
                value={profile.specialization}
                onChange={(val) => updateField('specialization', val)}
                options={specOptions}
                placeholder={profile.industry ? t('profile.selectSpecialization', 'Select specialization') : t('profile.selectIndustryFirst', 'Select industry first')}
                searchable
              />
            </div>
          </Section>
          {/* Work Experience */}
          <Section title={t('profile.workExperience')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>}>
            <div className="space-y-3">
              {profile.workExperience?.map((exp, i) => (
                <ItemCard key={i} onRemove={() => removeWorkExperience(i)}>
                  <p className="font-medium text-sm text-gray-900">{exp.position}</p>
                  <p className="text-sm text-gray-500">{exp.company}</p>
                  {exp.years && <p className="text-xs text-gray-400 mt-1">{exp.years} {t('profile.yearsExp', 'years')}</p>}
                </ItemCard>
              ))}
            </div>
            {showExpForm ? (
              <div className="mt-4 p-4 rounded-xl border border-[#a8c7f5] bg-[#e8f0fe]/30 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input label={t('profile.company', 'Company')} value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} />
                  <Input label={t('profile.position', 'Position')} value={newExp.position} onChange={(e) => setNewExp({ ...newExp, position: e.target.value })} />
                </div>
                <Dropdown
                  label={t('profile.experienceYears', 'Experience (years)')}
                  value={newExp.years}
                  onChange={(val) => setNewExp({ ...newExp, years: val })}
                  options={expYearOptions}
                  placeholder={t('profile.selectYears', 'Select')}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowExpForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">{t('common:actions.cancel', 'Cancel')}</button>
                  <button onClick={handleAddExperience} className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003275] hover:shadow-xs transition-all cursor-pointer">{t('common:actions.add', 'Add')}</button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <AddButton label={t('profile.addExperience', 'Add Experience')} onClick={() => setShowExpForm(true)} />
              </div>
            )}
          </Section>

          {/* Education */}
          <Section title={t('profile.education')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15v-3.75m0 0h-.008v.008H6.75v-.008zm0 0L12 8.25l5.25 3" /></svg>}>
            <div className="space-y-3">
              {profile.education?.map((edu, i) => (
                <ItemCard key={i} onRemove={() => removeEducation(i)}>
                  <p className="font-medium text-sm text-gray-900">{edu.institution}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{edu.degree} — {edu.field} ({edu.year})</p>
                </ItemCard>
              ))}
            </div>
            {showEduForm ? (
              <div className="mt-4 p-4 rounded-xl border border-[#a8c7f5] bg-[#e8f0fe]/30 space-y-3">
                <Input label={t('profile.institution', 'Institution')} value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Dropdown
                    label={t('profile.degree', 'Degree')}
                    value={newEdu.degree}
                    onChange={(val) => setNewEdu({ ...newEdu, degree: val })}
                    options={degreeOptions}
                    placeholder={t('profile.selectDegree', 'Select degree')}
                  />
                  <Dropdown
                    label={t('profile.year', 'Year')}
                    value={newEdu.year}
                    onChange={(val) => setNewEdu({ ...newEdu, year: val })}
                    options={eduYearOptions}
                    placeholder={t('profile.yearLabel', 'Year')}
                  />
                </div>
                <Input label={t('profile.field', 'Field')} value={newEdu.field} onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })} />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowEduForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">{t('common:actions.cancel', 'Cancel')}</button>
                  <button onClick={handleAddEducation} className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003275] hover:shadow-xs transition-all cursor-pointer">{t('common:actions.add', 'Add')}</button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <AddButton label={t('profile.addEducation', 'Add Education')} onClick={() => setShowEduForm(true)} />
              </div>
            )}
          </Section>

          {/* Languages */}
          <Section title={t('profile.languages')} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>}>
            <div className="space-y-3">
              {profile.languages?.map((lang, i) => {
                const langObj = LANGUAGES.find((l) => l.id === lang.id)
                const levelObj = LANGUAGE_LEVELS.find((l) => l.value === lang.level)
                return (
                  <ItemCard key={i} onRemove={() => removeLanguage(i)}>
                    <div className="flex gap-1">
                      <span className="font-medium text-sm text-gray-900">{loc(langObj) || lang.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">{loc(levelObj) || lang.level}</span>
                    </div>
                  </ItemCard>
                )
              })}
            </div>
            {showLangForm ? (
              <div className="mt-4 p-4 rounded-xl border border-[#a8c7f5] bg-[#e8f0fe]/30 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Dropdown
                    label={t('profile.language', 'Language')}
                    value={newLang.id}
                    onChange={(val) => setNewLang({ ...newLang, id: val })}
                    options={LANGUAGES.map((l) => ({ value: l.id, label: loc(l) }))}
                    placeholder={t('profile.selectLanguage', 'Select language')}
                  />
                  <Dropdown
                    label={t('profile.level', 'Level')}
                    value={newLang.level}
                    onChange={(val) => setNewLang({ ...newLang, level: val })}
                    options={LANGUAGE_LEVELS.map((l) => ({ value: l.value, label: loc(l) }))}
                    placeholder={t('profile.selectLevel', 'Select level')}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowLangForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">{t('common:actions.cancel', 'Cancel')}</button>
                  <button onClick={handleAddLanguage} className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003275] hover:shadow-xs transition-all cursor-pointer">{t('common:actions.add', 'Add')}</button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <AddButton label={t('profile.addLanguage', 'Add Language')} onClick={() => setShowLangForm(true)} />
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}
