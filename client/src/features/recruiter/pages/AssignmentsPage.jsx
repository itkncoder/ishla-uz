import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatusBadge from '@shared/components/StatusBadge'
import DataTable from '@shared/components/ui/DataTable'
import useJobOrderStore from '@stores/jobOrderStore'
import useClassificationsStore from '@stores/classificationsStore'
import { candidatesApi } from '@/api/candidates'
import localize from '@shared/utils/localize'

export default function AssignmentsPage() {
  const { t, i18n } = useTranslation('recruiter')
  const lang = i18n.language

  const { jobOrders: rawJobOrders, fetch: fetchJobOrders } = useJobOrderStore()
  const { countries, fetch: fetchClassifications } = useClassificationsStore()
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    fetchJobOrders()
    fetchClassifications()
    candidatesApi.list().then(data => setCandidates(Array.isArray(data) ? data : data.data || []))
  }, [])

  const jobOrders = rawJobOrders.map((jo) => ({ ...jo, titleText: localize(jo.title, lang) }))

  const columns = [
    { header: t('assignments.jobOrder'), accessor: 'titleText', sortable: true },
    {
      header: t('assignments.employer'),
      accessor: 'employer',
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row.employer.name}</p>
          <p className="text-xs text-gray-400">{countries.find((c) => c.id === row.employer.country)?.label}</p>
        </div>
      ),
    },
    {
      header: t('jobOrders.status', 'Status'),
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <div>
      <PageHeader title={t('assignments.title')} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-4 text-center">
            <span className="text-2xl font-bold">{jobOrders.filter((j) => j.status === 'active').length}</span>
            <span className="text-sm text-gray-500">{t('assignments.active', 'Active Assignments')}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-4 text-center">
            <span className="text-2xl font-bold">{jobOrders.filter((j) => j.status === 'waiting_approve').length}</span>
            <span className="text-sm text-gray-500">{t('assignments.pending', 'Pending')}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-4 text-center">
            <span className="text-2xl font-bold">{jobOrders.filter((j) => j.status === 'filled').length}</span>
            <span className="text-sm text-gray-500">{t('assignments.filled', 'Filled')}</span>
          </div>
        </div>
      </div>

      {/* Job Orders Table */}
      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <DataTable
            columns={columns}
            data={jobOrders}
            searchable
            searchPlaceholder={t('common:actions.search')}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  )
}
