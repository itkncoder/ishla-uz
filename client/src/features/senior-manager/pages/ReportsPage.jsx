import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import FormSelect from '@shared/components/ui/FormSelect'
import FormInput from '@shared/components/ui/FormInput'
import ProgressBar from '@shared/components/ui/ProgressBar'
import { candidatesApi } from '@/api/candidates'
import { jobOrdersApi } from '@/api/jobOrders'
import { STATE_ORDER } from '@shared/utils/stateMachine'

export default function ReportsPage() {
  const { t } = useTranslation('seniorManager')
  const [candidates, setCandidates] = useState([])
  const [jobOrders, setJobOrders] = useState([])
  const [reportType, setReportType] = useState('pipeline')
  const [dateFrom, setDateFrom] = useState('2025-10-01')
  const [dateTo, setDateTo] = useState('2026-02-27')

  useEffect(() => {
    candidatesApi.list().then((data) => setCandidates(Array.isArray(data) ? data : data.data || []))
    jobOrdersApi.list().then((data) => setJobOrders(Array.isArray(data) ? data : data.data || []))
  }, [])

  const stateCounts = {}
  STATE_ORDER.forEach((s) => { stateCounts[s] = 0 })
  candidates.forEach((c) => { if (stateCounts[c.currentState] !== undefined) stateCounts[c.currentState]++ })

  return (
    <div>
      <PageHeader title={t('reports.title')} />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <FormSelect
          name="reportType"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          options={[
            { value: 'pipeline', label: t('reports.candidatePipeline') },
            { value: 'deployment', label: t('reports.deploymentStats') },
            { value: 'sla', label: t('reports.slaReport') },
          ]}
          className="w-60"
        />
        <FormInput name="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
        <FormInput name="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
        <div className="flex gap-2 ml-auto">
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">{t('reports.exportPdf')}</button>
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">{t('reports.exportExcel')}</button>
        </div>
      </div>

      {/* Pipeline Report */}
      {reportType === 'pipeline' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white">
            <div className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">{t('reports.candidatePipeline')}</h3>
              <div className="space-y-3">
                {STATE_ORDER.map((state) => (
                  <div key={state} className="flex items-center gap-3">
                    <span className="text-sm w-40 truncate">{t(`workflow:states.${state}`, state)}</span>
                    <ProgressBar value={stateCounts[state]} max={candidates.length} showPercent={false} className="flex-1" />
                    <span className="text-sm font-bold w-6 text-right">{stateCounts[state]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                Total candidates in pipeline: <span className="font-bold text-gray-900">{candidates.length}</span>
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
                      <th>Completed</th>
                      <th>Avg. Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Рустам Файзуллаев', id: 'r001', candidates: candidates.filter((c) => c.recruiterId === 'r001') },
                      { name: 'Фарход Турсунов', id: 'r002', candidates: candidates.filter((c) => c.recruiterId === 'r002') },
                    ].map((rec) => {
                      const completed = rec.candidates.filter((c) => c.currentState === 'completed').length
                      const avgProgress = Math.round(rec.candidates.reduce((s, c) => s + c.profileComplete, 0) / rec.candidates.length)
                      return (
                        <tr key={rec.id}>
                          <td className="font-medium">{rec.name}</td>
                          <td>{rec.candidates.length}</td>
                          <td>{completed}</td>
                          <td><ProgressBar value={avgProgress} size="sm" showPercent /></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Stats */}
      {reportType === 'deployment' && (
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('reports.deploymentStats')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <span className="text-3xl font-bold text-green-600">{candidates.filter((c) => c.currentState === 'completed').length}</span>
                <p className="text-sm mt-1">Deployed</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <span className="text-3xl font-bold text-blue-600">{candidates.filter((c) => c.currentState === 'deployment').length}</span>
                <p className="text-sm mt-1">In Deployment</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg text-center">
                <span className="text-3xl font-bold text-amber-600">{jobOrders.filter((j) => j.status === 'active').length}</span>
                <p className="text-sm mt-1">Active Orders</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th>Employer</th>
                    <th>Country</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobOrders.filter((j) => j.status !== 'cancelled').map((jo) => (
                    <tr key={jo.id}>
                      <td>{jo.employer.name}</td>
                      <td>{jo.country.toUpperCase()}</td>
                      <td>{jo.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SLA Report */}
      {reportType === 'sla' && (
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('reports.slaReport')}</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <span className="text-3xl font-bold text-green-600">82%</span>
                <p className="text-sm mt-1">On Track</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg text-center">
                <span className="text-3xl font-bold text-amber-600">12%</span>
                <p className="text-sm mt-1">At Risk</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <span className="text-3xl font-bold text-red-600">6%</span>
                <p className="text-sm mt-1">Breached</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th>Stage</th>
                    <th>Target (days)</th>
                    <th>Avg. Actual</th>
                    <th>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {STATE_ORDER.filter((s) => s !== 'completed').map((state) => {
                    const target = { registration: 7, assessment: 14, showcase: 21, hard_lock: 7, contracting: 14, work_permit: 30, visa: 30, deployment: 14 }[state] || 14
                    const actual = Math.round(target * (0.7 + Math.random() * 0.6))
                    const compliance = Math.min(100, Math.round((target / actual) * 100))
                    return (
                      <tr key={state}>
                        <td>{t(`workflow:states.${state}`, state)}</td>
                        <td>{target}</td>
                        <td className={actual > target ? 'text-red-600 font-bold' : ''}>{actual}</td>
                        <td><ProgressBar value={compliance} size="sm" color={compliance >= 80 ? 'success' : compliance >= 60 ? 'warning' : 'error'} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
