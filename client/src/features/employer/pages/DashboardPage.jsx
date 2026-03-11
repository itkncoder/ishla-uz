import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import StatsCard from '@shared/components/ui/StatsCard'
import StatusBadge from '@shared/components/StatusBadge'
import EmptyState from '@shared/components/ui/EmptyState'
import Modal from '@shared/components/ui/Modal'
import useJobOrderStore from '@stores/jobOrderStore'
import useClassificationsStore from '@stores/classificationsStore'
import localize, { localizeLabel } from '@shared/utils/localize'
import { formatSalary } from '@shared/utils/formatSalary'

const MOCK_KYC_STATUS = 'verified'

const TABS = ['all', 'waiting_approve', 'active', 'declined']

export default function DashboardPage() {
  const { t, i18n } = useTranslation('employer')
  const lang = i18n.language
  const { countries: COUNTRIES, fetch: fetchClassifications } = useClassificationsStore()
  const loc = (item) => localizeLabel(item, lang)
  const rawJobOrders = useJobOrderStore((s) => s.jobOrders)
  const fetchJobOrders = useJobOrderStore((s) => s.fetch)
  const jobOrders = useMemo(() => rawJobOrders.map((jo) => ({
    ...jo,
    titleText: localize(jo.title, lang),
  })), [rawJobOrders, lang])
  const updateStatus = useJobOrderStore((s) => s.updateStatus)

  const activeOrders = jobOrders.filter((jo) => jo.status === 'active').length
  const pendingApprovals = jobOrders.filter((jo) => jo.status === 'draft').length

  useEffect(() => { fetchClassifications(); fetchJobOrders() }, [fetchClassifications, fetchJobOrders])

  const [activeTab, setActiveTab] = useState('all')
  const [cancelId, setCancelId] = useState(null)

  const handleConfirmCancel = async () => {
    if (!cancelId) return
    await updateStatus(cancelId, 'declined')
    setCancelId(null)
  }

  const filtered = activeTab === 'all' ? jobOrders : jobOrders.filter((jo) => jo.status === activeTab)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.title')}</h1>

      {/* KYC Warning */}
      {MOCK_KYC_STATUS !== 'verified' && (
        <div className="flex items-center gap-4 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900">{t('kyc.verificationRequired', 'KYC Verification Required')}</h3>
            <p className="text-sm text-amber-700 mt-0.5">{t('kyc.completeVerification', 'Please complete your company verification to access all features.')}</p>
          </div>
          <Link
            to="/employer/kyc"
            className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors shrink-0"
          >
            {t('kyc.goToKyc', 'Complete KYC')}
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>} value={activeOrders} label={t('dashboard.activeOrders')} />
        <StatsCard icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} value={pendingApprovals} label={t('dashboard.pendingApprovals')} />
      </div>

      {/* Tabs + Create */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {t(`jobOrders.tab_${tab}`, tab.charAt(0).toUpperCase() + tab.slice(1))}
              {tab !== 'all' && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab ? 'bg-[#e8f0fe] text-[#003275]' : 'bg-gray-200 text-gray-500'
                }`}>
                  {jobOrders.filter((jo) => jo.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <Link
          to="/employer/create-order"
          className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] hover:shadow-xs active:scale-[0.98] transition-all"
        >
          + {t('jobOrders.create')}
        </Link>
      </div>

      {/* Job Order Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title={t('jobOrders.noOrders', 'No job orders found')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((jo) => {
            return (
              <div key={jo.id} className="rounded-2xl border border-gray-100 bg-white p-5 hover:border-[#004AAD]/20 hover:shadow-xs transition-all">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">{jo.titleText}</h3>
                  <StatusBadge status={jo.status} />
                </div>

                <p className="text-base font-bold text-gray-900 mt-3">
                  {formatSalary(jo.salary.amount)} {jo.salary.currency}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {loc(COUNTRIES.find((c) => c.id === jo.country)) || jo.country}
                  </span>
                </div>

                {(jo.status === 'active' || jo.status === 'draft') && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    {jo.status === 'active' && (
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setCancelId(jo.id)}
                      >
                        {t('jobOrders.cancel', 'Cancel')}
                      </button>
                    )}
                    {jo.status === 'draft' && (
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#004AAD] text-white hover:bg-[#003d8f] transition-colors cursor-pointer"
                        onClick={() => updateStatus(jo.id, 'active')}
                      >
                        {t('jobOrders.activate', 'Activate')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        title={t('jobOrders.cancelConfirmTitle', 'Cancel Job Order')}
        actions={
          <>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setCancelId(null)}
            >
              {t('common:actions.back', 'Back')}
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
              onClick={handleConfirmCancel}
            >
              {t('jobOrders.confirmCancel', 'Yes, Cancel')}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">{t('jobOrders.cancelConfirmMessage', 'Are you sure you want to cancel this job order? This action cannot be undone.')}</p>
      </Modal>
    </div>
  )
}
