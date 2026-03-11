import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import useJobOrderStore from '@stores/jobOrderStore'
import useClassificationsStore from '@stores/classificationsStore'
import useCandidateProfileStore from '@stores/candidateProfileStore'
import EmptyState from '@shared/components/ui/EmptyState'
import localize from '@shared/utils/localize'
import { formatSalary } from '@shared/utils/formatSalary'
import { applicationsApi } from '@/api/applications'

/* ── Custom filter UI primitives ── */

function FilterSection({ title, onReset, resetLabel, children }) {
  return (
    <div className="pb-5 border-b border-gray-100 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold tracking-wide uppercase text-gray-400">{title}</h3>
        {onReset && (
          <button className="text-xs text-[#004AAD] hover:text-[#003275] hover:underline transition-colors" onClick={onReset}>
            {resetLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function FilterInput({ placeholder, value, onChange, type = 'text', icon }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-9 rounded-lg border border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#004AAD]/50 focus:ring-2 focus:ring-[#004AAD]/10 transition-all ${icon ? 'pl-9 pr-3' : 'px-3'}`}
      />
    </div>
  )
}

function FilterChip({ label, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
        active
          ? 'bg-[#004AAD] text-white border-[#004AAD]'
          : 'bg-white text-gray-500 border-gray-200 hover:border-[#004AAD]/40 hover:text-gray-700'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`text-[10px] ${active ? 'text-white/70' : 'text-gray-300'}`}>{count}</span>
      )}
    </button>
  )
}

function FilterDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-9 rounded-lg border border-gray-200 bg-white text-sm px-3 flex items-center justify-between gap-2 hover:border-[#004AAD]/40 focus:outline-none focus:border-[#004AAD]/50 focus:ring-2 focus:ring-[#004AAD]/10 transition-all cursor-pointer"
      >
        <span className={selected ? 'text-gray-700' : 'text-gray-300'}>{selected ? selected.label : placeholder}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-100 shadow-lg py-1 max-h-60 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                value === opt.value
                  ? 'bg-[#004AAD]/5 text-[#004AAD] font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterCheckbox({ label, sublabel, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 py-2 px-2.5 cursor-pointer group rounded-lg border border-gray-100 mb-1.5 last:mb-0 hover:border-[#004AAD]/30 transition-colors">
      <span
        className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all shrink-0 ${
          checked
            ? 'bg-[#004AAD] border-[#004AAD]'
            : 'border-gray-200 group-hover:border-[#004AAD]/50'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-sm flex-1 group-hover:text-[#004AAD]/80 transition-colors">{label}</span>
      {sublabel && <span className="text-xs text-gray-300">{sublabel}</span>}
    </label>
  )
}

/* ── Helpers ── */

const EXP_OPTIONS = [
  { key: 'any', min: 0, max: Infinity },
  { key: 'none', min: 0, max: 0 },
  { key: '1_2', min: 1, max: 2 },
  { key: '3_5', min: 3, max: 5 },
  { key: '5plus', min: 5, max: Infinity },
]

const SORT_OPTIONS = ['relevant', 'salary_desc', 'salary_asc', 'newest']

function getCounts(jobs, field) {
  const counts = {}
  jobs.forEach((j) => {
    if (j.status === 'active') counts[j[field]] = (counts[j[field]] || 0) + 1
  })
  return counts
}

/* ── Main component ── */

export default function JobsPage() {
  const { t, i18n } = useTranslation(['candidate', 'common'])
  const lang = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const { jobOrders, fetch } = useJobOrderStore()
  const { industries: INDUSTRIES, countries: COUNTRIES, fetch: fetchClassifications } = useClassificationsStore()
  const navigate = useNavigate()
  const { profile, fetchMe } = useCandidateProfileStore()

  const [search, setSearch] = useState('')
  const [industries, setIndustries] = useState(() => {
    const initial = searchParams.get('industry')
    return initial ? [initial] : []
  })
  const [country, setCountry] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [experience, setExperience] = useState('any')
  const [gender, setGender] = useState('')
  const [currency, setCurrency] = useState('')
  const [housing, setHousing] = useState('')
  const [sortBy, setSortBy] = useState('relevant')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const modalRef = useRef(null)

  const openJobModal = useCallback((job) => {
    setSelectedJob(job)
    modalRef.current?.showModal()
  }, [])

  const closeJobModal = useCallback(() => {
    modalRef.current?.close()
    setSelectedJob(null)
  }, [])

  const confirmRef = useRef(null)
  const [applyingJob, setApplyingJob] = useState(null)

  const openConfirmApply = useCallback((job) => {
    setApplyingJob(job)
    confirmRef.current?.showModal()
  }, [])

  const handleConfirmApply = useCallback(() => {
    confirmRef.current?.close()
    const job = applyingJob
    setApplyingJob(null)
    if (selectedJob) closeJobModal()
    if (job) {
      const jobTitle = localize(job.title, lang)

      // Save to API
      applicationsApi.create({
        jobOrderId: job.id,
        candidateId: profile?.id || 'anonymous',
        candidateProfile: profile,
        jobTitle,
        employerId: job.employer.id,
        employerName: job.employer.name,
      }).catch(() => {})

      // Notify via BroadcastChannel for real-time (if employer chat is open)
      const channel = new BroadcastChannel('ishla_applications')
      channel.postMessage({ candidate: profile, jobTitle, employerId: job.employer.id, employerName: job.employer.name })
      channel.close()

      navigate('/candidate/chat', { state: { newEmployer: { id: job.employer.id, name: job.employer.name, jobTitle }, profile } })
    }
  }, [applyingJob, selectedJob, closeJobModal, navigate, lang, profile])

  useEffect(() => { fetchClassifications(); fetchMe() }, [])
  useEffect(() => {
    const params = industries.length > 0 ? { industry: industries.join(',') } : {}
    fetch(params)
  }, [industries])

  const countryCounts = useMemo(() => getCounts(jobOrders, 'country'), [jobOrders])
  const industryCounts = useMemo(() => getCounts(jobOrders, 'industry'), [jobOrders])

  const filtered = useMemo(() => {
    let jobs = jobOrders.filter((job) => {
      if (job.status !== 'active') return false
      if (industries.length > 0 && !industries.includes(job.industry)) return false
      if (country && job.country !== country) return false
      if (currency && job.salary.currency !== currency) return false
      if (salaryMin && job.salary.amount < Number(salaryMin)) return false
      if (salaryMax && job.salary.amount > Number(salaryMax)) return false

      if (experience !== 'any') {
        const opt = EXP_OPTIONS.find((o) => o.key === experience)
        if (opt) {
          const exp = job.requirements.experienceMin
          if (opt.key === 'none' && exp > 0) return false
          if (opt.key !== 'none' && (exp < opt.min || (opt.max !== Infinity && exp > opt.max))) return false
        }
      }

      if (gender && job.requirements.gender && job.requirements.gender !== gender) return false

      if (housing === 'yes') {
        const b = localize(job.benefits, 'en').toLowerCase()
        if (!b.includes('accommod') && !b.includes('housing')) return false
      }

      if (search) {
        const q = search.toLowerCase()
        const title = localize(job.title, lang).toLowerCase()
        const desc = localize(job.description, lang).toLowerCase()
        const employer = job.employer.name.toLowerCase()
        if (!title.includes(q) && !desc.includes(q) && !employer.includes(q)) return false
      }

      return true
    })

    // Sort
    if (sortBy === 'salary_desc') jobs = [...jobs].sort((a, b) => b.salary.amount - a.salary.amount)
    else if (sortBy === 'salary_asc') jobs = [...jobs].sort((a, b) => a.salary.amount - b.salary.amount)
    else if (sortBy === 'newest') jobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return jobs
  }, [jobOrders, industries, country, salaryMin, salaryMax, experience, gender, currency, housing, search, sortBy, lang])

  const handleReset = () => {
    setSearch('')
    setIndustries([])
    setCountry('')
    setSalaryMin('')
    setSalaryMax('')
    setExperience('any')
    setGender('')
    setCurrency('')
    setHousing('')
    setSortBy('relevant')
    setSearchParams({})
  }

  const handleIndustryToggle = (val) => {
    setIndustries((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    )
  }

  const hasFilters = industries.length > 0 || country || salaryMin || salaryMax || experience !== 'any' || gender || currency || housing || search

  const activeFilterCount = [industries.length > 0, country, salaryMin || salaryMax, experience !== 'any', gender, currency, housing, search].filter(Boolean).length

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('jobs.title')}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{t('jobs.subtitle')}</p>
        </div>
        {/* Sort — desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-gray-400">{t('jobs.sortBy')}:</span>
          <div className="w-48">
            <FilterDropdown
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS.map((key) => ({ value: key, label: t(`jobs.sort_${key}`) }))}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter toggle */}
      <button
        className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-[#004AAD]/40 transition-all"
        onClick={() => setMobileFilters(!mobileFilters)}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        {t('jobs.filters')}
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#004AAD] text-white text-[10px] flex items-center justify-center font-semibold">{activeFilterCount}</span>
        )}
      </button>

      <div className="flex gap-6 items-start">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className={`w-full lg:w-[280px] shrink-0 ${mobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-100 p-5 space-y-5">

            {/* Search */}
            <FilterSection title={t('jobs.search')}>
              <FilterInput
                placeholder={t('jobs.searchPlaceholder')}
                value={search}
                onChange={setSearch}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                }
              />
            </FilterSection>

            {/* Salary */}
            <FilterSection
              title={t('jobs.salaryLevel')}
              onReset={(salaryMin || salaryMax || currency) ? () => { setSalaryMin(''); setSalaryMax(''); setCurrency('') } : undefined}
              resetLabel={t('jobs.reset')}
            >
              <div className="flex gap-2 mb-3">
                <FilterInput placeholder={t('jobs.from')} value={salaryMin} onChange={setSalaryMin} type="number" />
                <span className="text-gray-200 self-center">—</span>
                <FilterInput placeholder={t('jobs.to')} value={salaryMax} onChange={setSalaryMax} type="number" />
              </div>
              <div className="flex gap-1.5">
                {['', 'USD', 'EUR'].map((c) => (
                  <FilterChip
                    key={c || 'all'}
                    label={c || t('jobs.anyCurrency')}
                    active={currency === c}
                    onClick={() => setCurrency(c)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Experience */}
            <FilterSection
              title={t('jobs.experience')}
              onReset={experience !== 'any' ? () => setExperience('any') : undefined}
              resetLabel={t('jobs.reset')}
            >
              <div className="flex flex-wrap gap-1.5">
                {EXP_OPTIONS.map((opt) => (
                  <FilterChip
                    key={opt.key}
                    label={t(`jobs.exp_${opt.key}`)}
                    active={experience === opt.key}
                    onClick={() => setExperience(opt.key === experience ? 'any' : opt.key)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Industry */}
            <FilterSection
              title={t('jobs.industry')}
              onReset={industries.length > 0 ? () => setIndustries([]) : undefined}
              resetLabel={t('jobs.reset')}
            >
              <div>
                {INDUSTRIES.map((ind) => (
                  <FilterCheckbox
                    key={ind.id}
                    label={t(`common:landing.${ind.id}`)}
                    sublabel={String(industryCounts[ind.id] || 0)}
                    checked={industries.includes(ind.id)}
                    onChange={() => handleIndustryToggle(ind.id)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Country */}
            <FilterSection
              title={t('jobs.country')}
              onReset={country ? () => setCountry('') : undefined}
              resetLabel={t('jobs.reset')}
            >
              <div>
                {COUNTRIES.filter((c) => countryCounts[c.id]).map((c) => (
                  <FilterCheckbox
                    key={c.id}
                    label={c.label}
                    sublabel={String(countryCounts[c.id])}
                    checked={country === c.id}
                    onChange={() => setCountry(c.id === country ? '' : c.id)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Gender */}
            <FilterSection
              title={t('jobs.gender')}
              onReset={gender ? () => setGender('') : undefined}
              resetLabel={t('jobs.reset')}
            >
              <div className="flex gap-1.5">
                {['', 'male', 'female'].map((g) => (
                  <FilterChip
                    key={g || 'any'}
                    label={t(`jobs.gender_${g || 'any'}`)}
                    active={gender === g}
                    onClick={() => setGender(g)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Housing */}
            <FilterSection
              title={t('jobs.housing')}
              onReset={housing ? () => setHousing('') : undefined}
              resetLabel={t('jobs.reset')}
            >
              <div className="flex gap-1.5">
                {['', 'yes'].map((h) => (
                  <FilterChip
                    key={h || 'any'}
                    label={t(`jobs.housing_${h || 'any'}`)}
                    active={housing === h}
                    onClick={() => setHousing(h)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Sort — mobile only */}
            <div className="lg:hidden">
              <FilterSection title={t('jobs.sortBy')}>
                <FilterDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS.map((key) => ({ value: key, label: t(`jobs.sort_${key}`) }))}
                />
              </FilterSection>
            </div>

            {/* Reset all */}
            {hasFilters && (
              <button
                className="w-full py-2 rounded-lg text-sm font-medium text-[#004AAD] hover:bg-[#004AAD]/5 transition-colors"
                onClick={handleReset}
              >
                {t('jobs.resetAll')}
              </button>
            )}
          </div>
        </aside>

        {/* ===== RIGHT: JOB CARDS ===== */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              {t('jobs.found', { count: filtered.length })}
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="🔍"
              title={t('jobs.noResults')}
              message={t('jobs.noResultsMessage')}
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((job) => {
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#004AAD]/20 hover:shadow-xs transition-all duration-200"
                  >
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 hover:text-[#004AAD] transition-colors cursor-pointer leading-snug">
                      {localize(job.title, lang)}
                    </h2>

                    {/* Salary + badges row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <span className="text-base font-semibold text-gray-900">
                        {formatSalary(job.salary.amount)} {job.salary.currency} / {t('jobs.month')}
                      </span>
                      {job.requirements.experienceMin > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                          {t('jobs.experience')}: {job.requirements.experienceMin}+ {t('jobs.years')}
                        </span>
                      )}
                      {job.requirements.gender && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                          {t(`jobs.gender_${job.requirements.gender}`)}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-[#004AAD]/10 text-xs font-medium text-[#004AAD]">
                        {t(`common:landing.${job.industry}`)}
                      </span>
                    </div>

                    {/* Employer */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <span className="text-sm text-gray-600 font-medium">
                        {job.employer.name}
                      </span>
                      <svg className="w-4 h-4 text-[#004AAD]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {/* Location */}
                    <p className="text-sm text-gray-400 mt-1">
                      {[localize(job.city, lang), COUNTRIES.find((c) => c.id === job.country)?.label || job.country].filter(Boolean).join(', ')}
                    </p>

                    {/* Benefits */}
                    {job.benefits && (
                      <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                        {localize(job.benefits, lang)}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100/60">
                      <button
                        className="px-5 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-semibold hover:bg-[#003d8f] hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                        onClick={() => openConfirmApply(job)}
                      >
                        {t('jobs.apply')}
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#004AAD]/40 hover:text-[#004AAD] hover:shadow-xs transition-all cursor-pointer"
                        onClick={() => openJobModal(job)}
                      >
                        {t('jobs.details')}
                      </button>
                      <div className="flex-1" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal — daisyUI */}
      <dialog ref={modalRef} className="modal" onClose={() => setSelectedJob(null)}>
        <div className="modal-box max-w-3xl">
          {selectedJob && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold">{localize(selectedJob.title, lang)}</h3>
                <button className="btn btn-sm btn-circle btn-ghost" onClick={closeJobModal}>✕</button>
              </div>

              <div className="mt-4 space-y-5">
                {/* Company & Location */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-700">{selectedJob.employer.name}</span>
                    <svg className="w-4 h-4 text-[#004AAD]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">
                    {[localize(selectedJob.city, lang), COUNTRIES.find((c) => c.id === selectedJob.country)?.label || selectedJob.country].filter(Boolean).join(', ')}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-base-200 rounded-xl p-3.5">
                    <p className="text-xs text-gray-400 mb-1">{t('jobs.salaryLevel')}</p>
                    <p className="text-sm font-semibold">{formatSalary(selectedJob.salary.amount)} {selectedJob.salary.currency} / {t('jobs.month')}</p>
                  </div>
                  <div className="bg-base-200 rounded-xl p-3.5">
                    <p className="text-xs text-gray-400 mb-1">{t('jobs.industry')}</p>
                    <p className="text-sm font-semibold">{t(`common:landing.${selectedJob.industry}`)}</p>
                  </div>
                  <div className="bg-base-200 rounded-xl p-3.5">
                    <p className="text-xs text-gray-400 mb-1">{t('jobs.experience')}</p>
                    <p className="text-sm font-semibold">
                      {selectedJob.requirements.experienceMin > 0
                        ? `${selectedJob.requirements.experienceMin}+ ${t('jobs.years')}`
                        : t('jobs.exp_none')}
                    </p>
                  </div>
                  <div className="bg-base-200 rounded-xl p-3.5">
                    <p className="text-xs text-gray-400 mb-1">{t('jobs.gender')}</p>
                    <p className="text-sm font-semibold">
                      {selectedJob.requirements.gender
                        ? t(`jobs.gender_${selectedJob.requirements.gender}`)
                        : t('jobs.gender_any')}
                    </p>
                  </div>
                  <div className="bg-base-200 rounded-xl p-3.5">
                    <p className="text-xs text-gray-400 mb-1">{t('jobs.country')}</p>
                    <p className="text-sm font-semibold">
                      {COUNTRIES.find((c) => c.id === selectedJob.country)?.label || selectedJob.country}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedJob.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('jobs.description', 'Description')}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{localize(selectedJob.description, lang)}</p>
                  </div>
                )}

                {/* Benefits */}
                {selectedJob.benefits && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('jobs.benefits', 'Benefits')}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{localize(selectedJob.benefits, lang)}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="modal-action">
                <button className="btn" onClick={closeJobModal}>{t('common:actions.close', 'Close')}</button>
                <button className="btn bg-[#004AAD] text-white hover:bg-[#003d8f] border-none" onClick={() => openConfirmApply(selectedJob)}>{t('jobs.apply')}</button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedJob(null)}>close</button>
        </form>
      </dialog>

      {/* Confirm Apply Modal — daisyUI */}
      <dialog ref={confirmRef} className="modal" onClose={() => setApplyingJob(null)}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">{t('jobs.confirmApplyTitle', 'Confirm Application')}</h3>
          {applyingJob && (
            <p className="py-4 text-sm text-gray-500">
              {t('jobs.confirmApplyMessage', {
                position: localize(applyingJob.title, lang),
                company: applyingJob.employer.name,
                defaultValue: `Are you sure you want to apply for "{{position}}" at {{company}}? Your profile will be shared with the employer.`,
              })}
            </p>
          )}
          <div className="modal-action">
            <button className="btn" onClick={() => { confirmRef.current?.close(); setApplyingJob(null) }}>
              {t('common:actions.cancel')}
            </button>
            <button className="btn bg-[#004AAD] text-white hover:bg-[#003d8f] border-none" onClick={handleConfirmApply}>
              {t('jobs.confirmApply', 'Yes, Apply')}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setApplyingJob(null)}>close</button>
        </form>
      </dialog>
    </div>
  )
}
