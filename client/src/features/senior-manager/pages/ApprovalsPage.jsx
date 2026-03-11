import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import DataTable from '@shared/components/ui/DataTable'
import Modal from '@shared/components/ui/Modal'
import FormTextarea from '@shared/components/ui/FormTextarea'

const MOCK_APPROVALS = [
  { id: 'ap001', type: 'kyc', description: 'KYC Verification — Al-Bina Construction', requester: 'Ahmed Al-Rashid', date: '2026-02-25', priority: 'high', status: 'pending' },
  { id: 'ap002', type: 'kyc', description: 'KYC Verification — Emirates Hospitality Group', requester: 'Dubai Office', date: '2026-02-24', priority: 'high', status: 'pending' },
  { id: 'ap003', type: 'workflow', description: 'Skip assessment for Candidate #2849 (experienced worker)', requester: 'Рустам Файзуллаев', date: '2026-02-26', priority: 'medium', status: 'pending' },
  { id: 'ap004', type: 'document', description: 'Accept expired passport for Candidate #2850 (renewal in process)', requester: 'Фарход Турсунов', date: '2026-02-27', priority: 'low', status: 'pending' },
  { id: 'ap005', type: 'document', description: 'Override photo requirement for Candidate #2851', requester: 'Рустам Файзуллаев', date: '2026-02-23', priority: 'low', status: 'pending' },
  { id: 'ap006', type: 'document', description: 'Accept medical certificate from private clinic', requester: 'Фарход Турсунов', date: '2026-02-22', priority: 'low', status: 'pending' },
  { id: 'ap007', type: 'contract', description: 'Approve contract for Candidate #2852 — salary exception', requester: 'HR Department', date: '2026-02-26', priority: 'high', status: 'pending' },
  { id: 'ap008', type: 'kyc', description: 'KYC Re-verification — Turkish Hotels Association', requester: 'Ankara Office', date: '2026-02-20', priority: 'medium', status: 'approved' },
  { id: 'ap009', type: 'workflow', description: 'Rollback Candidate #2858 from contracting to showcase', requester: 'Рустам Файзуллаев', date: '2026-02-18', priority: 'medium', status: 'rejected' },
]

export default function ApprovalsPage() {
  const { t } = useTranslation('seniorManager')
  const [approvals, setApprovals] = useState(MOCK_APPROVALS)
  const [reviewItem, setReviewItem] = useState(null)
  const [note, setNote] = useState('')
  const [filter, setFilter] = useState('pending')

  const filtered = filter === 'all' ? approvals : approvals.filter((a) => a.status === filter)

  const handleAction = (id, action) => {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: action } : a))
    setReviewItem(null)
    setNote('')
  }

  const columns = [
    {
      header: t('approvals.type', 'Type'),
      accessor: 'type',
      render: (row) => <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700 capitalize">{row.type}</span>,
    },
    { header: t('approvals.description', 'Description'), accessor: 'description' },
    { header: t('approvals.requester', 'Requester'), accessor: 'requester' },
    { header: t('approvals.date', 'Date'), accessor: 'date', sortable: true },
    {
      header: t('approvals.priority', 'Priority'),
      accessor: 'priority',
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.priority === 'high' ? 'bg-red-50 text-red-600' : row.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
          {t(`approvals.${row.priority}`, row.priority)}
        </span>
      ),
    },
    {
      header: t('approvals.status', 'Status'),
      accessor: 'status',
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'approved' ? 'bg-green-50 text-green-700' : row.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
          {t(`approvals.${row.status}`)}
        </span>
      ),
    },
    {
      header: '',
      render: (row) => row.status === 'pending' ? (
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); handleAction(row.id, 'approved') }}>{t('approvals.approve')}</button>
          <button className="px-3 py-1 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setReviewItem(row) }}>{t('approvals.reject')}</button>
        </div>
      ) : null,
    },
  ]

  return (
    <div>
      <PageHeader title={t('approvals.title')} />

      {/* Filters */}
      <div className="flex gap-1 p-1 bg-[#f5f5f5] rounded-xl mb-6 w-fit">
        {['pending', 'approved', 'rejected', 'all'].map((tab) => (
          <button key={tab} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setFilter(tab)}>
            {t(`approvals.${tab}`)}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 ml-1">{tab === 'all' ? approvals.length : approvals.filter((a) => a.status === tab).length}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <DataTable columns={columns} data={filtered} searchable pageSize={10} />
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        open={!!reviewItem}
        onClose={() => setReviewItem(null)}
        title={t('approvals.rejectReason', 'Rejection Reason')}
        actions={
          <>
            <button className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setReviewItem(null)}>{t('common:actions.cancel')}</button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer" onClick={() => handleAction(reviewItem?.id, 'rejected')}>{t('approvals.reject')}</button>
          </>
        }
      >
        <p className="mb-3 text-sm">{reviewItem?.description}</p>
        <FormTextarea label={t('approvals.comments')} name="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('approvals.rejectionPlaceholder')} rows={3} />
      </Modal>
    </div>
  )
}
