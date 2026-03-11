import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatusBadge from '@shared/components/StatusBadge'
import DataTable from '@shared/components/ui/DataTable'
import FormSelect from '@shared/components/ui/FormSelect'
import Modal from '@shared/components/ui/Modal'
import FormTextarea from '@shared/components/ui/FormTextarea'
import { documentsApi } from '@/api/documents'
import { candidatesApi } from '@/api/candidates'

const DOCUMENT_TYPES = ['passport', 'education', 'medical', 'photo', 'resume']

const STATUS_MAP = {
  not_uploaded: 'draft',
  uploaded: 'pending',
  under_review: 'reviewing',
  approved: 'approved',
  rejected: 'rejected',
}

export default function DocumentsPage() {
  const { t } = useTranslation(['recruiter', 'documents'])
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [reviewDoc, setReviewDoc] = useState(null)
  const [reviewNote, setReviewNote] = useState('')

  const [allDocs, setAllDocs] = useState([])
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    documentsApi.list().then(data => setAllDocs(Array.isArray(data) ? data : data.data || []))
    candidatesApi.list().then(data => setCandidates(Array.isArray(data) ? data : data.data || []))
  }, [])

  const reviewable = allDocs.filter((d) => d.status === 'uploaded' || d.status === 'under_review')

  let filtered = allDocs
  if (filterType) filtered = filtered.filter((d) => d.type === filterType)
  if (filterStatus) filtered = filtered.filter((d) => d.status === filterStatus)

  const getCandidateName = (candidateId) => {
    const c = candidates.find((c) => c.id === candidateId)
    return c?.name || candidateId
  }

  const columns = [
    {
      header: t('documents:types.candidate', 'Candidate'),
      accessor: 'candidateId',
      render: (row) => <span className="font-medium text-sm">{getCandidateName(row.candidateId)}</span>,
    },
    {
      header: t('recruiter:documents.type', 'Document Type'),
      accessor: 'type',
      render: (row) => t(`documents:types.${row.type}`),
    },
    {
      header: t('recruiter:documents.fileName', 'File'),
      accessor: 'fileName',
      render: (row) => <span className="text-sm">{row.fileName || '—'}</span>,
    },
    {
      header: t('recruiter:documents.status', 'Status'),
      accessor: 'status',
      render: (row) => <StatusBadge status={STATUS_MAP[row.status] || row.status} />,
    },
    {
      header: t('recruiter:documents.uploadedAt', 'Uploaded'),
      accessor: 'uploadedAt',
      sortable: true,
    },
    {
      header: t('recruiter:documents.actions', 'Actions'),
      render: (row) => {
        if (row.status === 'uploaded' || row.status === 'under_review') {
          return (
            <div className="flex gap-1">
              <button className="px-2 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setReviewDoc({ ...row, action: 'approve' }) }}>
                {t('recruiter:documents.verify')}
              </button>
              <button className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setReviewDoc({ ...row, action: 'reject' }) }}>
                {t('recruiter:documents.requestReupload')}
              </button>
            </div>
          )
        }
        return null
      },
    },
  ]

  return (
    <div>
      <PageHeader title={t('recruiter:documents.title')} />

      {/* Pending Review Queue */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6">
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">{t('recruiter:documents.pendingReview', 'Pending Review')} ({reviewable.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {reviewable.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{getCandidateName(doc.candidateId)}</p>
                  <p className="text-xs text-gray-400">{t(`documents:types.${doc.type}`)} — {doc.fileName}</p>
                </div>
                <div className="flex gap-1">
                  <button className="px-2 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors cursor-pointer" onClick={() => setReviewDoc({ ...doc, action: 'approve' })}>✓</button>
                  <button className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer" onClick={() => setReviewDoc({ ...doc, action: 'reject' })}>✕</button>
                </div>
              </div>
            ))}
            {reviewable.length === 0 && (
              <p className="text-sm text-gray-400 col-span-full">{t('recruiter:documents.noPending', 'No documents pending review.')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <FormSelect
          name="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          options={[{ value: '', label: t('recruiter:documents.allTypes') }, ...DOCUMENT_TYPES.map((dt) => ({ value: dt, label: dt }))]}
          className="w-40"
        />
        <FormSelect
          name="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: '', label: t('recruiter:documents.allStatuses') },
            { value: 'not_uploaded', label: t('recruiter:documents.notUploaded') },
            { value: 'uploaded', label: t('recruiter:documents.uploaded') },
            { value: 'under_review', label: t('recruiter:documents.underReview') },
            { value: 'approved', label: t('recruiter:documents.approved') },
            { value: 'rejected', label: t('recruiter:documents.rejected') },
          ]}
          className="w-40"
        />
      </div>

      {/* All Documents Table */}
      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <DataTable columns={columns} data={filtered} searchable pageSize={10} />
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        open={!!reviewDoc}
        onClose={() => { setReviewDoc(null); setReviewNote('') }}
        title={reviewDoc?.action === 'approve' ? t('recruiter:documents.verify') : t('recruiter:documents.requestReupload')}
        actions={
          <>
            <button className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => { setReviewDoc(null); setReviewNote('') }}>{t('common:actions.cancel')}</button>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${reviewDoc?.action === 'approve' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`} onClick={() => { setReviewDoc(null); setReviewNote('') }}>
              {t('common:actions.confirm')}
            </button>
          </>
        }
      >
        {reviewDoc && (
          <div>
            <p className="mb-2"><strong>{t('recruiter:documents.candidateLabel')}:</strong> {getCandidateName(reviewDoc.candidateId)}</p>
            <p className="mb-4"><strong>{t('recruiter:documents.documentLabel')}:</strong> {t(`documents:types.${reviewDoc.type}`)} — {reviewDoc.fileName}</p>
            <FormTextarea
              label={t('recruiter:documents.addNote')}
              name="reviewNote"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder={reviewDoc.action === 'reject' ? t('recruiter:documents.rejectionReason') : t('recruiter:documents.optionalNote')}
              rows={3}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
