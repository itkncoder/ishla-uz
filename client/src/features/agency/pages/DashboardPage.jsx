import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatsCard from '@shared/components/ui/StatsCard'
import ProgressBar from '@shared/components/ui/ProgressBar'
import { candidatesApi } from '@/api/candidates'
import { STATE_ORDER } from '@shared/utils/stateMachine'

const RECRUITER_INFO = [
  { id: 'r001', name: 'Рустам Файзуллаев' },
  { id: 'r002', name: 'Фарход Турсунов' },
]

export default function DashboardPage() {
  const { t } = useTranslation('agency')
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    candidatesApi.list().then((data) => setCandidates(Array.isArray(data) ? data : data.data || []))
  }, [])

  const MOCK_RECRUITERS = RECRUITER_INFO.map((r) => ({
    ...r,
    candidates: candidates.filter((c) => c.recruiterId === r.id),
  }))

  const totalRecruiters = MOCK_RECRUITERS.length
  const totalCandidates = candidates.length
  const deployed = candidates.filter((c) => c.currentState === 'completed').length
  const inProgress = candidates.filter((c) => c.currentState !== 'completed' && c.currentState !== 'registration').length

  return (
    <div>
      <PageHeader title={t('dashboard.title', 'Agency Dashboard')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon="👥" value={totalRecruiters} label={t('dashboard.totalRecruiters', 'Total Recruiters')} />
        <StatsCard icon="📋" value={totalCandidates} label={t('dashboard.totalCandidates', 'Total Candidates')} />
        <StatsCard icon="⚙" value={inProgress} label={t('dashboard.inProgress', 'In Progress')} />
        <StatsCard icon="✅" value={deployed} label={t('dashboard.deployed', 'Deployed')} />
      </div>

      {/* Recruiter Performance */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6">
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.recruiterPerformance', 'Recruiter Performance')}</h3>
          <div className="space-y-4">
            {MOCK_RECRUITERS.map((rec) => {
              const completed = rec.candidates.filter((c) => c.currentState === 'completed').length
              const total = rec.candidates.length
              return (
                <div key={rec.id} className="p-4 bg-[#f5f5f5] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{rec.name}</span>
                    <span className="text-sm text-gray-500">{total} candidates</span>
                  </div>
                  <ProgressBar value={completed} max={Math.max(total, 1)} label={`${completed} deployed / ${total} total`} color={completed > 0 ? 'success' : 'primary'} />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {STATE_ORDER.map((state) => {
                      const count = rec.candidates.filter((c) => c.currentState === state).length
                      if (count === 0) return null
                      return <span key={state} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-gray-200 text-gray-600">{t(`workflow:states.${state}`, state)}: {count}</span>
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
