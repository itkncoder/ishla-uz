import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatusBadge from '@shared/components/StatusBadge'
import FileUpload from '@shared/components/ui/FileUpload'
import useCandidateProfileStore from '@stores/candidateProfileStore'

const DOCUMENT_TYPES = ['passport', 'education', 'medical', 'photo', 'resume']

const DOC_ICONS = {
  passport: '🛂',
  education: '🎓',
  medical: '🏥',
  photo: '📷',
  resume: '📄',
}

const STATUS_MAP = {
  not_uploaded: 'draft',
  uploaded: 'pending',
  under_review: 'reviewing',
  approved: 'approved',
  rejected: 'rejected',
}

export default function DocumentsPage() {
  const { t } = useTranslation('candidate')
  const documents = useCandidateProfileStore((s) => s.documents)
  const uploadDocument = useCandidateProfileStore((s) => s.uploadDocument)

  const getDocByType = (type) => documents.find((d) => d.type === type) || { type, status: 'not_uploaded' }

  const counts = {
    approved: documents.filter((d) => d.status === 'approved').length,
    pending: documents.filter((d) => ['uploaded', 'under_review'].includes(d.status)).length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
    total: DOCUMENT_TYPES.length,
  }

  return (
    <div>
      <PageHeader title={t('documents.title')} />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl border border-[#a8c7f5] bg-[#e8f0fe]/50 p-3 text-center">
          <span className="text-2xl font-bold text-[#003275]">{counts.approved}</span>
          <span className="block text-xs text-[#003275]">{t('documents.approved')}</span>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3 text-center">
          <span className="text-2xl font-bold text-amber-700">{counts.pending}</span>
          <span className="block text-xs text-amber-700">{t('documents.pending')}</span>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3 text-center">
          <span className="text-2xl font-bold text-red-500">{counts.rejected}</span>
          <span className="block text-xs text-red-500">{t('documents.rejected')}</span>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center">
          <span className="text-2xl font-bold text-gray-900">{counts.approved}/{counts.total}</span>
          <span className="block text-xs text-gray-500">{t('documents.total', 'Total')}</span>
        </div>
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCUMENT_TYPES.map((type) => {
          const doc = getDocByType(type)
          const badgeStatus = STATUS_MAP[doc.status] || 'draft'
          const isRejected = doc.status === 'rejected'
          const needsUpload = doc.status === 'not_uploaded' || isRejected

          return (
            <div key={type} className={`rounded-2xl border bg-white p-5 ${isRejected ? 'border-red-200' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{DOC_ICONS[type]}</span>
                  <h4 className="font-medium text-gray-900">{t(`documents:types.${type}`)}</h4>
                </div>
                <StatusBadge status={badgeStatus} />
              </div>

              {doc.fileName && (
                <p className="text-sm text-gray-500 mb-2 truncate">{doc.fileName}</p>
              )}

              {isRejected && doc.reviewNote && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-red-600 mb-1">{t('documents.rejectionReason', 'Rejection reason')}:</p>
                  <p className="text-sm text-red-700">{doc.reviewNote}</p>
                </div>
              )}

              {needsUpload && (
                <FileUpload
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(file) => uploadDocument(type, file.name)}
                  label={isRejected ? t('documents.reupload') : t('documents.upload')}
                />
              )}

              {doc.uploadedAt && (
                <p className="text-xs text-gray-400 mt-2">
                  {t('documents.uploadedAt', 'Uploaded')}: {doc.uploadedAt}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
