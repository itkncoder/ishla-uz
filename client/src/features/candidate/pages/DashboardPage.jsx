import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatsCard from '@shared/components/ui/StatsCard'
import ProgressBar from '@shared/components/ui/ProgressBar'

import useAuthStore from '@stores/authStore'
import useCandidateProfileStore from '@stores/candidateProfileStore'
import { STATE_ORDER } from '@shared/utils/stateMachine'

const NEXT_STEPS = {
  registration: [
    { key: 'completeProfile', icon: '👤' },
    { key: 'uploadDocuments', icon: '📄' },
  ],
  assessment: [
    { key: 'waitAssessment', icon: '✅' },
    { key: 'prepareMedical', icon: '🏥' },
  ],
  showcase: [
    { key: 'waitEmployer', icon: '🖼' },
  ],
  hard_lock: [
    { key: 'confirmEmployer', icon: '🔒' },
  ],
  contracting: [
    { key: 'reviewContract', icon: '📝' },
    { key: 'signContract', icon: '✍' },
  ],
  work_permit: [
    { key: 'waitWorkPermit', icon: '📋' },
  ],
  visa: [
    { key: 'waitVisa', icon: '🛂' },
  ],
  deployment: [
    { key: 'prepareTravel', icon: '✈' },
  ],
  completed: [
    { key: 'deployed', icon: '🎉' },
  ],
}

export default function DashboardPage() {
  const { t } = useTranslation('candidate')
  const user = useAuthStore((s) => s.user)
  const profile = useCandidateProfileStore((s) => s.profile)
  const documents = useCandidateProfileStore((s) => s.documents)
  const getProfileCompleteness = useCandidateProfileStore((s) => s.getProfileCompleteness)

  const completeness = getProfileCompleteness()
  const currentState = profile.currentState
  const stateIdx = STATE_ORDER.indexOf(currentState)
  const progress = Math.round((stateIdx / (STATE_ORDER.length - 1)) * 100)

  const docCounts = {
    approved: documents.filter((d) => d.status === 'approved').length,
    pending: documents.filter((d) => ['uploaded', 'under_review'].includes(d.status)).length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  }

  const steps = NEXT_STEPS[currentState] || []

  return (
    <div>
      <PageHeader title={t('dashboard.title')} />

      {/* Welcome Banner */}
      <div className="rounded-2xl bg-[#004AAD] p-6 mb-6">
        <h2 className="text-xl font-bold text-white">
          {t('dashboard.welcome', { name: user?.name || profile.name })}
        </h2>
        <p className="text-white/90 mt-1">{t('dashboard.welcomeMessage', 'Your recruitment journey is in progress. Keep track of your status below.')}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon="📊"
          value={`${progress}%`}
          label={t('dashboard.currentStatus')}
        />
        <StatsCard
          icon="✅"
          value={docCounts.approved}
          label={t('documents.approved')}
        />
        <StatsCard
          icon="⏳"
          value={docCounts.pending}
          label={t('documents.pending')}
        />
        <StatsCard
          icon="❌"
          value={docCounts.rejected}
          label={t('documents.rejected')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Progress */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6">
          <h3 className="text-base font-semibold text-gray-900">{t('dashboard.currentStatus')}</h3>
          <div className="flex items-center gap-3 mt-3 mb-4">
            <span className="text-sm text-gray-500">
              {t('dashboard.step', `Step ${stateIdx + 1} of ${STATE_ORDER.length}`)}
            </span>
          </div>
          <ProgressBar value={progress} color="success" />

          {/* Workflow Steps */}
          <div className="mt-5 flex items-center overflow-x-auto">
            {STATE_ORDER.map((state, i) => (
              <div key={state} className="flex items-center flex-1 last:flex-none min-w-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                      i <= stateIdx
                        ? 'bg-[#004AAD] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < stateIdx ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium text-center hidden sm:block ${i <= stateIdx ? 'text-[#004AAD]' : 'text-gray-400'}`}>
                    {t(`workflow:states.${state}`, state)}
                  </span>
                </div>
                {i < STATE_ORDER.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mt-[-1rem] sm:mt-[-1.25rem] ${i < stateIdx ? 'bg-[#004AAD]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h3 className="text-base font-semibold text-gray-900">{t('dashboard.profileCompleteness', 'Profile Completeness')}</h3>
          <div className="flex justify-center my-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={completeness === 100 ? '#004AAD' : completeness >= 60 ? '#004AAD' : '#eab308'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${completeness * 3.52} 352`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900">{completeness}%</span>
            </div>
          </div>
          {completeness < 100 && (
            <p className="text-sm text-gray-500 text-center">
              {t('dashboard.completeProfile', 'Complete your profile to proceed to the next stage.')}
            </p>
          )}
        </div>
      </div>

      {/* Next Steps */}
      {steps.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('dashboard.nextStep')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div key={step.key} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-4 hover:border-[#004AAD]/30 transition-colors">
                <span className="text-3xl">{step.icon}</span>
                <p className="font-medium text-gray-900">{t(`dashboard.steps.${step.key}`, step.key)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
