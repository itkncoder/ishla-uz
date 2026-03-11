import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatsCard from '@shared/components/ui/StatsCard'
import { adminApi } from '@/api/admin'
import { STATE_ORDER } from '@shared/utils/stateMachine'

const ROLE_ORDER = ['candidate', 'employer', 'recruiter', 'senior_manager', 'visa_officer', 'admin', 'agency']

export default function DashboardPage() {
  const { t } = useTranslation('admin')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <PageHeader title={t('dashboard.title')} />
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-[#004AAD]" />
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div>
        <PageHeader title={t('dashboard.title')} />
        <div className="text-center py-20 text-gray-500">{t('common:errors.loadFailed', 'Failed to load data')}</div>
      </div>
    )
  }

  const { users, candidates, jobOrders, recentUsers } = stats
  const maxRoleCount = Math.max(...ROLE_ORDER.map((r) => users.byRole[r] || 0), 1)

  return (
    <div>
      <PageHeader title={t('dashboard.title')} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon="👥" value={users.total} label={t('dashboard.totalUsers')} />
        <StatsCard icon="🟢" value={users.active} label={t('dashboard.activeUsers')} />
        <StatsCard icon="📋" value={jobOrders.byStatus.active || 0} label={t('dashboard.activeOrders', 'Active Orders')} />
        <StatsCard icon="✅" value={jobOrders.byStatus.filled || 0} label={t('dashboard.filledOrders', 'Filled Orders')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.usersByRole', 'Users by Role')}</h3>
            <div className="space-y-3">
              {ROLE_ORDER.map((role) => {
                const count = users.byRole[role] || 0
                return (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-sm">{t(`common:roles.${role === 'senior_manager' ? 'seniorManager' : role === 'visa_officer' ? 'visaOfficer' : role}`, role)}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-[#004AAD] transition-all" style={{ width: `${(count / maxRoleCount) * 100}%` }} />
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Candidates by Stage */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.candidatesByStage', 'Candidates by Stage')}</h3>
            <div className="space-y-3">
              {STATE_ORDER.map((state) => {
                const count = candidates.byState[state] || 0
                return (
                  <div key={state} className="flex items-center justify-between">
                    <span className="text-sm">{t(`workflow:states.${state}`, state)}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full bg-[#004AAD] transition-all" style={{ width: `${candidates.total ? (count / candidates.total) * 100 : 0}%` }} />
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Job Orders by Status */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.ordersByStatus', 'Job Orders by Status')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {['active', 'draft', 'filled', 'cancelled'].map((status) => {
                const count = jobOrders.byStatus[status] || 0
                const colors = { active: 'bg-green-50 text-green-600', draft: 'bg-amber-50 text-amber-600', filled: 'bg-blue-50 text-blue-600', cancelled: 'bg-red-50 text-red-600' }
                return (
                  <div key={status} className={`p-3 rounded-lg text-center ${colors[status]}`}>
                    <span className="text-2xl font-bold">{count}</span>
                    <p className="text-xs mt-1 capitalize">{status}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.recentUsers', 'Recent Users')}</h3>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-[#f5f5f5] rounded">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-700 capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
