import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import PageHeader from '@shared/components/PageHeader'
import StatsCard from '@shared/components/ui/StatsCard'
import StatusBadge from '@shared/components/StatusBadge'
import { candidatesApi } from '@/api/candidates'
import { STATE_ORDER } from '@shared/utils/stateMachine'

export default function DashboardPage() {
  const { t } = useTranslation(['recruiter', 'workflow'])

  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    candidatesApi.list().then(data => setCandidates(Array.isArray(data) ? data : data.data || []))
  }, [])
  const stateCounts = {}
  STATE_ORDER.forEach((s) => { stateCounts[s] = 0 })
  candidates.forEach((c) => { if (stateCounts[c.currentState] !== undefined) stateCounts[c.currentState]++ })

  const totalAssigned = candidates.length
  const pendingAssessment = candidates.filter((c) => c.currentState === 'assessment').length
  const pendingDocs = candidates.filter((c) => c.currentState === 'registration').length
  const completed = candidates.filter((c) => c.currentState === 'completed').length

  return (
    <div>
      <PageHeader title={t('recruiter:dashboard.title')} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon="👥" value={totalAssigned} label={t('recruiter:dashboard.totalAssigned', 'Total Assigned')} />
        <StatsCard icon="✅" value={pendingAssessment} label={t('recruiter:dashboard.pendingAssessments')} />
        <StatsCard icon="📄" value={pendingDocs} label={t('recruiter:dashboard.pendingDocs', 'Pending Docs')} />
        <StatsCard icon="🎉" value={completed} label={t('recruiter:dashboard.completedThisMonth')} />
      </div>

      {/* Pipeline Bar Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6">
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">{t('recruiter:dashboard.pipelineOverview', 'Pipeline Overview')}</h3>
          <div className="flex gap-1 h-32 items-end">
            {STATE_ORDER.map((state) => {
              const count = stateCounts[state]
              const maxCount = Math.max(...Object.values(stateCounts), 1)
              const height = Math.max((count / maxCount) * 100, 4)
              return (
                <div key={state} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold">{count}</span>
                  <div
                    className="w-full bg-[#004AAD]/80 rounded-t-sm transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-gray-400 text-center leading-tight">
                    {t(`workflow:states.${state}`)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions + Kanban */}
      <div className="flex gap-3 mb-6">
        <Link to="/recruiter/register-candidate" className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#004AAD] text-white hover:bg-[#003d8f] transition-colors cursor-pointer">+ {t('recruiter:dashboard.registerCandidate', 'Register Candidate')}</Link>
        <Link to="/recruiter/assessment" className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">{t('recruiter:dashboard.startAssessment', 'Start Assessment')}</Link>
      </div>

      {/* Kanban-style Pipeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: `${STATE_ORDER.length * 200}px` }}>
          {STATE_ORDER.map((state) => {
            const stateCandidates = candidates.filter((c) => c.currentState === state)
            return (
              <div key={state} className="w-52 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={state} />
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{stateCandidates.length}</span>
                </div>
                <div className="space-y-2">
                  {stateCandidates.map((c) => (
                    <Link
                      key={c.id}
                      to={`/recruiter/candidates/${c.id}`}
                      className="rounded-2xl border border-gray-100 bg-white hover:border-[#004AAD]/30 transition-colors"
                    >
                      <div className="p-3">
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.specialization}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-[#004AAD] transition-all" style={{ width: `${c.profileComplete}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{c.profileComplete}%</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {stateCandidates.length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-300">{t('recruiter:dashboard.empty')}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
