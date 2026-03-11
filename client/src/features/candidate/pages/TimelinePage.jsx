import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatusBadge from '@shared/components/StatusBadge'
import useCandidateProfileStore from '@stores/candidateProfileStore'
import { STATE_ORDER, TRANSITIONS } from '@shared/utils/stateMachine'

const STATE_DATES = {
  registration: '2025-11-01',
  assessment: '2025-11-08',
  showcase: '2025-11-15',
  hard_lock: null,
  contracting: null,
  work_permit: null,
  visa: null,
  deployment: null,
  completed: null,
}

const STATE_ICONS = {
  registration: '📝',
  assessment: '✅',
  showcase: '🖼',
  hard_lock: '🔒',
  contracting: '📝',
  work_permit: '📋',
  visa: '🛂',
  deployment: '✈',
  completed: '🎉',
}

export default function TimelinePage() {
  const { t } = useTranslation('candidate')
  const profile = useCandidateProfileStore((s) => s.profile)
  const currentState = profile.currentState
  const currentIdx = STATE_ORDER.indexOf(currentState)

  return (
    <div>
      <PageHeader title={t('timeline.title')} />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-[#a8c7f5] bg-[#e8f0fe]/50 p-3 text-center">
          <span className="text-2xl font-bold text-[#003275]">{currentIdx}</span>
          <span className="block text-xs text-[#003275]">{t('timeline.completed')}</span>
        </div>
        <div className="rounded-2xl border border-[#a8c7f5] bg-[#e8f0fe]/30 p-3 text-center">
          <span className="text-2xl font-bold text-[#004AAD]">1</span>
          <span className="block text-xs text-[#004AAD]">{t('timeline.inProgress')}</span>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center">
          <span className="text-2xl font-bold text-gray-400">{STATE_ORDER.length - currentIdx - 1}</span>
          <span className="block text-xs text-gray-500">{t('timeline.upcoming')}</span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="relative">
          {STATE_ORDER.map((state, i) => {
            const isPast = i < currentIdx
            const isCurrent = i === currentIdx
            const isFuture = i > currentIdx
            const transition = TRANSITIONS[state]
            const date = STATE_DATES[state]

            return (
              <div key={state} className="flex gap-4 pb-8 last:pb-0">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isPast ? 'bg-[#004AAD] text-white' : isCurrent ? 'bg-[#004AAD] text-white ring-4 ring-[#004AAD]/20' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isPast ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm">{STATE_ICONS[state]}</span>
                    )}
                  </div>
                  {i < STATE_ORDER.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-1 ${isPast ? 'bg-[#004AAD]' : 'bg-gray-200'}`} />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-2 ${isFuture ? 'opacity-50' : ''}`}>
                  <div className={`rounded-xl p-4 ${isCurrent ? 'border border-[#a8c7f5] bg-[#e8f0fe]/20' : ''}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{t(`workflow:states.${state}`)}</span>
                      {isCurrent && <StatusBadge status="in_progress" />}
                      {isPast && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e8f0fe] text-[#003275] border border-[#a8c7f5]">
                          {t('timeline.completed')}
                        </span>
                      )}
                    </div>
                    {date && (
                      <p className="text-xs text-gray-400 mt-1">{date}</p>
                    )}
                    {!date && isFuture && (
                      <p className="text-xs text-gray-400 mt-1">{t('timeline.upcoming')}</p>
                    )}
                    {transition && isCurrent && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">{t('timeline.conditions', 'Required conditions')}:</p>
                        <ul className="text-xs space-y-1">
                          {transition.conditions.map((cond) => (
                            <li key={cond} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              <span className="text-gray-600">{t(`workflow:conditions.${cond}`, cond)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
