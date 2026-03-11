import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import ProgressBar from '@shared/components/ui/ProgressBar'
import StatsCard from '@shared/components/ui/StatsCard'
import { candidatesApi } from '@/api/candidates'
import { STATE_ORDER } from '@shared/utils/stateMachine'

const RECRUITER_MAP = {
  r001: 'Рустам Файзуллаев',
  r002: 'Фарход Турсунов',
}

export default function ReportsPage() {
  const { t } = useTranslation('agency')
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    candidatesApi.list().then((data) => setCandidates(Array.isArray(data) ? data : data.data || []))
  }, [])

  const totalCandidates = candidates.length
  const deployed = candidates.filter((c) => c.currentState === 'completed').length
  const avgProgress = totalCandidates ? Math.round(candidates.reduce((s, c) => s + c.profileComplete, 0) / totalCandidates) : 0
  const deploymentRate = totalCandidates ? Math.round((deployed / totalCandidates) * 100) : 0

  const stateCounts = {}
  STATE_ORDER.forEach((s) => { stateCounts[s] = 0 })
  candidates.forEach((c) => { if (stateCounts[c.currentState] !== undefined) stateCounts[c.currentState]++ })

  const recruiterStats = Object.entries(RECRUITER_MAP).map(([id, name]) => {
    const candidates = candidates.filter((c) => c.recruiterId === id)
    const comp = candidates.filter((c) => c.currentState === 'completed').length
    return { id, name, total: candidates.length, completed: comp }
  })

  return (
    <div>
      <PageHeader title={t('reports.title', 'Reports')} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon="📋" value={totalCandidates} label={t('reports.totalCandidates', 'Total Candidates')} />
        <StatsCard icon="✅" value={deployed} label={t('reports.deployed', 'Deployed')} />
        <StatsCard icon="📊" value={`${avgProgress}%`} label={t('reports.avgProfile', 'Avg. Profile %')} />
        <StatsCard icon="🎯" value={`${deploymentRate}%`} label={t('reports.deploymentRate', 'Deployment Rate')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('reports.pipeline', 'Candidate Pipeline')}</h3>
            <div className="space-y-3">
              {STATE_ORDER.map((state) => (
                <div key={state} className="flex items-center gap-3">
                  <span className="text-sm w-36 truncate">{t(`workflow:states.${state}`, state)}</span>
                  <ProgressBar value={stateCounts[state]} max={totalCandidates} showPercent={false} className="flex-1" />
                  <span className="text-sm font-bold w-6 text-right">{stateCounts[state]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recruiter Performance */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('reports.recruiterPerformance', 'Recruiter Performance')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th>Recruiter</th>
                    <th>Candidates</th>
                    <th>Deployed</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiterStats.map((rec) => (
                    <tr key={rec.id}>
                      <td className="font-medium">{rec.name}</td>
                      <td>{rec.total}</td>
                      <td>{rec.completed}</td>
                      <td>
                        <ProgressBar value={rec.completed} max={Math.max(rec.total, 1)} size="sm" color={rec.completed > 0 ? 'success' : 'primary'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Deployment by Industry */}
        <div className="rounded-2xl border border-gray-100 bg-white lg:col-span-2">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('reports.byIndustry', 'By Industry')}</h3>
            <div className="flex flex-wrap gap-4">
              {['construction', 'hospitality', 'healthcare', 'manufacturing', 'logistics', 'agriculture', 'it', 'retail'].map((ind) => {
                const count = candidates.filter((c) => c.industry === ind).length
                if (count === 0) return null
                return (
                  <div key={ind} className="p-3 bg-[#f5f5f5] rounded-lg text-center min-w-20">
                    <span className="text-xl font-bold">{count}</span>
                    <p className="text-xs text-gray-500 capitalize">{ind}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-3">
        <button className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Export PDF</button>
        <button className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Export CSV</button>
      </div>
    </div>
  )
}
