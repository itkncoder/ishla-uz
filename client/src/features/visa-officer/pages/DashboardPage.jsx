import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatsCard from '@shared/components/ui/StatsCard'
import { candidatesApi } from '@/api/candidates'

export default function DashboardPage() {
  const { t } = useTranslation('visaOfficer')
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    candidatesApi.list().then((data) => setCandidates(Array.isArray(data) ? data : data.data || []))
  }, [])

  const VISA_CANDIDATES = candidates.filter((c) => c.currentState === 'visa')
  const WORK_PERMIT_CANDIDATES = candidates.filter((c) => c.currentState === 'work_permit')

  return (
    <div>
      <PageHeader title={t('dashboard.title')} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon="📋" value={VISA_CANDIDATES.length + WORK_PERMIT_CANDIDATES.length} label={t('dashboard.pendingApplications')} />
        <StatsCard icon="⚙" value={VISA_CANDIDATES.length} label={t('dashboard.inProcessing')} />
        <StatsCard icon="✅" value={3} label={t('dashboard.approvedToday')} trendUp trend="+2" />
        <StatsCard icon="❌" value={0} label={t('dashboard.rejectedToday')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visa Queue */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.visaQueue', 'Visa Queue')}</h3>
            {VISA_CANDIDATES.length === 0 ? (
              <p className="text-gray-400 text-sm">{t('dashboard.noVisaCandidates')}</p>
            ) : (
              <div className="space-y-3">
                {VISA_CANDIDATES.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.specialization}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">{t('dashboard.visaStage')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Work Permit Queue */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.workPermitQueue', 'Work Permit Queue')}</h3>
            {WORK_PERMIT_CANDIDATES.length === 0 ? (
              <p className="text-gray-400 text-sm">{t('dashboard.noWorkPermitCandidates')}</p>
            ) : (
              <div className="space-y-3">
                {WORK_PERMIT_CANDIDATES.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.specialization}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">{t('dashboard.workPermit')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Processing Stats */}
        <div className="rounded-2xl border border-gray-100 bg-white lg:col-span-2">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.processingTimes', 'Processing Times')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th>{t('dashboard.country')}</th>
                    <th>{t('dashboard.avgWorkPermitDays')}</th>
                    <th>{t('dashboard.avgVisaDays')}</th>
                    <th>{t('dashboard.activeApplications')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { country: 'Saudi Arabia', workPermit: 18, visa: 12, active: 4 },
                    { country: 'UAE', workPermit: 14, visa: 10, active: 2 },
                    { country: 'South Korea', workPermit: 25, visa: 15, active: 1 },
                    { country: 'Germany', workPermit: 30, visa: 20, active: 1 },
                    { country: 'Turkey', workPermit: 10, visa: 7, active: 1 },
                  ].map((row) => (
                    <tr key={row.country}>
                      <td className="font-medium">{row.country}</td>
                      <td>{row.workPermit}</td>
                      <td>{row.visa}</td>
                      <td><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{row.active}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
