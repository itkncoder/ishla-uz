import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import DataTable from '@shared/components/ui/DataTable'
import FormSelect from '@shared/components/ui/FormSelect'

const MOCK_AUDIT_LOG = [
  { id: 1, action: 'user.login', performedBy: 'Admin', target: 'admin@ishla.uz', timestamp: '2026-02-27 09:15', details: 'Login from 192.168.1.1' },
  { id: 2, action: 'candidate.transition', performedBy: 'Рустам Файзуллаев', target: 'Candidate #2847', timestamp: '2026-02-27 08:30', details: 'showcase → hard_lock' },
  { id: 3, action: 'document.approve', performedBy: 'Фарход Турсунов', target: 'Candidate #2849 — passport', timestamp: '2026-02-26 16:45', details: 'Document approved' },
  { id: 4, action: 'document.reject', performedBy: 'Рустам Файзуллаев', target: 'Candidate #2848 — education', timestamp: '2026-02-26 14:20', details: 'Poor scan quality' },
  { id: 5, action: 'kyc.submit', performedBy: 'Ahmed Al-Rashid', target: 'Al-Bina Construction', timestamp: '2026-02-25 11:00', details: 'KYC documents submitted' },
  { id: 6, action: 'job_order.create', performedBy: 'Ahmed Al-Rashid', target: 'Job Order: Строительные рабочие', timestamp: '2026-02-25 10:30', details: '10 workers needed' },
  { id: 7, action: 'candidate.register', performedBy: 'Рустам Файзуллаев', target: 'Шахзод Мирзаев', timestamp: '2026-02-24 09:00', details: 'New candidate registered by recruiter' },
  { id: 8, action: 'assessment.submit', performedBy: 'Рустам Файзуллаев', target: 'Candidate #2847 — Welding', timestamp: '2026-02-23 15:30', details: 'Score: 92/100, Passed' },
  { id: 9, action: 'user.create', performedBy: 'Admin', target: 'Малика Исмаилова', timestamp: '2026-02-22 13:00', details: 'New visa officer account created' },
  { id: 10, action: 'approval.approve', performedBy: 'Анвар Хакимов', target: 'KYC — Turkish Hotels', timestamp: '2026-02-20 17:00', details: 'KYC verification approved' },
  { id: 11, action: 'candidate.transition', performedBy: 'System', target: 'Candidate #2853', timestamp: '2026-02-19 12:00', details: 'visa → deployment (auto)' },
  { id: 12, action: 'config.update', performedBy: 'Admin', target: 'SLA Settings', timestamp: '2026-02-18 10:00', details: 'Updated registration SLA to 7 days' },
  { id: 13, action: 'user.deactivate', performedBy: 'Admin', target: 'john@emirates.ae', timestamp: '2026-02-15 09:30', details: 'Account deactivated' },
  { id: 14, action: 'approval.reject', performedBy: 'Анвар Хакимов', target: 'Rollback #2858', timestamp: '2026-02-14 16:00', details: 'Insufficient justification' },
  { id: 15, action: 'job_order.update', performedBy: 'Emirates HR', target: 'Job Order: Повара', timestamp: '2026-02-13 11:30', details: 'Increased workers needed to 5' },
]

const ACTION_TYPES = [
  'user.login', 'user.create', 'user.deactivate',
  'candidate.register', 'candidate.transition',
  'document.approve', 'document.reject',
  'assessment.submit',
  'job_order.create', 'job_order.update',
  'kyc.submit',
  'approval.approve', 'approval.reject',
  'config.update',
]

export default function AuditLogPage() {
  const { t } = useTranslation('seniorManager')
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')

  let filtered = MOCK_AUDIT_LOG
  if (filterUser) filtered = filtered.filter((l) => l.performedBy.toLowerCase().includes(filterUser.toLowerCase()))
  if (filterAction) filtered = filtered.filter((l) => l.action === filterAction)

  const uniqueUsers = [...new Set(MOCK_AUDIT_LOG.map((l) => l.performedBy))]

  const columns = [
    { header: t('auditLog.timestamp'), accessor: 'timestamp', sortable: true },
    {
      header: t('auditLog.action'),
      accessor: 'action',
      render: (row) => {
        const colors = {
          approve: 'bg-green-50 text-green-700',
          reject: 'bg-red-50 text-red-600',
          create: 'bg-blue-50 text-blue-600',
          login: 'bg-gray-100 text-gray-600',
          submit: 'bg-amber-50 text-amber-700',
          update: 'bg-[#e8f0fe] text-[#004AAD]',
          transition: 'bg-purple-50 text-purple-600',
          register: 'bg-blue-50 text-blue-600',
          deactivate: 'bg-red-50 text-red-600',
        }
        const actionPart = row.action.split('.')[1]
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[actionPart] || 'bg-gray-100 text-gray-600'}`}>{row.action}</span>
      },
    },
    { header: t('auditLog.performedBy'), accessor: 'performedBy', sortable: true },
    { header: t('auditLog.target', 'Target'), accessor: 'target' },
    { header: t('auditLog.details'), accessor: 'details' },
  ]

  return (
    <div>
      <PageHeader title={t('auditLog.title')} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <FormSelect
          name="filterUser"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          options={[{ value: '', label: t('auditLog.filterByUser') }, ...uniqueUsers.map((u) => ({ value: u, label: u }))]}
          className="w-48"
        />
        <FormSelect
          name="filterAction"
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          options={[{ value: '', label: t('auditLog.filterByAction') }, ...ACTION_TYPES.map((a) => ({ value: a, label: a }))]}
          className="w-48"
        />
        <span className="flex items-center text-sm text-gray-500">{filtered.length} entries</span>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <DataTable columns={columns} data={filtered} searchable pageSize={15} />
        </div>
      </div>
    </div>
  )
}
