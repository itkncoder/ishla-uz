import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatsCard from '@shared/components/ui/StatsCard'
import { candidatesApi } from '@/api/candidates'
import { jobOrdersApi } from '@/api/jobOrders'
import { STATE_ORDER } from '@shared/utils/stateMachine'

const MOCK_SLA_BREACHES = 3
const MOCK_PENDING_APPROVALS = 7

export default function DashboardPage() {
  const { t } = useTranslation('seniorManager')
  const [candidates, setCandidates] = useState([])
  const [jobOrders, setJobOrders] = useState([])

  useEffect(() => {
    candidatesApi.list().then((data) => setCandidates(Array.isArray(data) ? data : data.data || []))
    jobOrdersApi.list().then((data) => setJobOrders(Array.isArray(data) ? data : data.data || []))
  }, [])

  const totalCandidates = candidates.length
  const activePipelines = jobOrders.filter((j) => j.status === 'active').length
  const slaCompliance = Math.round(((totalCandidates - MOCK_SLA_BREACHES) / totalCandidates) * 100)

  const stateCounts = {}
  STATE_ORDER.forEach((s) => { stateCounts[s] = 0 })
  candidates.forEach((c) => { if (stateCounts[c.currentState] !== undefined) stateCounts[c.currentState]++ })

  return (
    <div>
      <PageHeader title={t('dashboard.title')} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon="⏳" value={MOCK_PENDING_APPROVALS} label={t('dashboard.pendingApprovals')} />
        <StatsCard icon="📊" value={activePipelines} label={t('dashboard.activePipelines')} />
        <StatsCard icon="✅" value={`${slaCompliance}%`} label={t('dashboard.slaCompliance')} trendUp={slaCompliance >= 80} trend={slaCompliance >= 80 ? 'Good' : 'Low'} />
        <StatsCard icon="🚨" value={MOCK_SLA_BREACHES} label={t('dashboard.slaBreaches', 'SLA Breaches')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.overallProgress')}</h3>
            <div className="space-y-2">
              {STATE_ORDER.map((state) => (
                <div key={state} className="flex items-center gap-3">
                  <span className="text-sm w-36 truncate">{t(`workflow:states.${state}`, state)}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#004AAD] rounded-full" style={{ width: `${totalCandidates ? (stateCounts[state] / totalCandidates) * 100 : 0}%` }} /></div>
                  <span className="text-sm font-bold w-6 text-right">{stateCounts[state]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Approvals Summary */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.pendingApprovals')}</h3>
            <div className="space-y-3">
              {[
                { type: 'KYC Verification', count: 2, priority: 'high' },
                { type: 'Workflow Override', count: 1, priority: 'medium' },
                { type: 'Document Override', count: 3, priority: 'low' },
                { type: 'Contract Approval', count: 1, priority: 'high' },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.type}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.priority === 'high' ? 'bg-red-50 text-red-600' : item.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                      {item.priority}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
