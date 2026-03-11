import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@shared/components/styled/FormElements'
import EmptyState from '@shared/components/ui/EmptyState'
import useShowcaseStore from '@stores/showcaseStore'
import useJobOrderStore from '@stores/jobOrderStore'
import useClassificationsStore from '@stores/classificationsStore'
import localize from '@shared/utils/localize'

export default function ShowcasePage() {
  const { t, i18n } = useTranslation('employer')
  const lang = i18n.language
  const { industries: INDUSTRIES, languages: LANGUAGES, fetch: fetchClassifications } = useClassificationsStore()
  const fetchShowcase = useShowcaseStore((s) => s.fetch)
  const fetchJobOrders = useJobOrderStore((s) => s.fetch)
  const jobOrders = useJobOrderStore((s) => s.jobOrders)

  useEffect(() => {
    fetchClassifications()
    fetchShowcase()
    fetchJobOrders()
  }, [fetchClassifications, fetchShowcase, fetchJobOrders])

  const getShowcaseCandidates = useShowcaseStore((s) => s.getShowcaseCandidates)
  const shortlist = useShowcaseStore((s) => s.shortlist)
  const confirm = useShowcaseStore((s) => s.confirm)
  const shortlisted = useShowcaseStore((s) => s.shortlisted)
  const confirmed = useShowcaseStore((s) => s.confirmed)

  const [selectedOrder, setSelectedOrder] = useState('')
  const [industry, setIndustry] = useState('')

  const activeOrders = jobOrders.filter((jo) => jo.status === 'active')
  const candidates = getShowcaseCandidates({
    industry: industry || undefined,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('showcase.title')}</h1>

      {/* Filters row */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label={t('showcase.selectJobOrder', 'Job Order')}
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            options={activeOrders.map((jo) => ({ value: jo.id, label: localize(jo.title, lang) }))}
            placeholder={t('showcase.allCandidates', 'All candidates')}
          />
          <Select
            label={t('showcase.industry', 'Industry')}
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            options={[{ value: '', label: t('showcase.all', 'All') }, ...INDUSTRIES.map((i) => ({ value: i.id, label: i.label }))]}
          />
          <div className="flex items-end">
            <p className="text-sm text-gray-500 pb-2">
              {t('showcase.found', 'Found')}: <span className="font-semibold text-gray-900">{candidates.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Candidates */}
      {candidates.length === 0 ? (
        <EmptyState
          icon="🖼"
          title={t('showcase.noCandidates', 'No candidates available')}
          message={t('showcase.noCandidatesMessage', 'No candidates match the current filters.')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((c) => {
            const isShortlisted = shortlisted.includes(c.id)
            const isConfirmed = confirmed.includes(c.id)

            return (
              <div
                key={c.id}
                className={`rounded-2xl border bg-white p-5 transition-colors ${
                  isConfirmed
                    ? 'border-[#004AAD] bg-[#e8f0fe]/20'
                    : isShortlisted
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{t('showcase.candidateId', 'Candidate')} #{c.displayId}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{c.specialization}</p>
                  </div>
                  <span className={`text-sm font-bold ${c.matchScore >= 80 ? 'text-[#004AAD]' : c.matchScore >= 60 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {c.matchScore}%
                  </span>
                </div>

                {/* Info */}
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  <span>{c.experienceYears} {t('showcase.yearsExp', 'yrs exp')}</span>
                  <span>{c.education[0]?.degree}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {c.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#003275] text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {c.skills.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                      +{c.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {c.languages.map((l) => (
                    <span key={l.id} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs">
                      {LANGUAGES.find((lang) => lang.id === l.id)?.label || l.id}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <div className="mt-4">
                  {!isConfirmed && !isShortlisted && (
                    <button
                      className="w-full py-2 rounded-lg text-xs font-medium border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                      onClick={() => shortlist(c.id)}
                    >
                      {t('showcase.shortlist')}
                    </button>
                  )}
                  {isShortlisted && !isConfirmed && (
                    <button
                      className="w-full py-2 rounded-lg text-xs font-medium bg-[#004AAD] text-white hover:bg-[#003d8f] transition-colors cursor-pointer"
                      onClick={() => confirm(c.id)}
                    >
                      {t('showcase.confirm', 'Confirm')}
                    </button>
                  )}
                  {isConfirmed && (
                    <div className="flex items-center justify-center gap-1 py-2 text-xs font-medium text-[#004AAD]">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('showcase.confirmed', 'Confirmed')}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
