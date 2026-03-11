import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewing: 'bg-blue-50 text-blue-600 border-blue-200',
  approved: 'bg-[#e8f0fe] text-[#004AAD] border-[#a8c7f5]',
  rejected: 'bg-red-50 text-red-600 border-red-200',
  active: 'bg-[#e8f0fe] text-[#004AAD] border-[#a8c7f5]',
  inactive: 'bg-gray-100 text-gray-500',
  closed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-[#e8f0fe] text-[#004AAD] border-[#a8c7f5]',
  in_progress: 'bg-blue-50 text-blue-600 border-blue-200',
  on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
  // Candidate workflow states
  registration: 'bg-blue-50 text-blue-600 border-blue-200',
  assessment: 'bg-amber-50 text-amber-700 border-amber-200',
  showcase: 'bg-purple-50 text-purple-600 border-purple-200',
  hard_lock: 'bg-orange-50 text-orange-600 border-orange-200',
  contracting: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  work_permit: 'bg-blue-50 text-blue-600 border-blue-200',
  visa: 'bg-amber-50 text-amber-700 border-amber-200',
  deployment: 'bg-[#e8f0fe] text-[#004AAD] border-[#a8c7f5]',
  filled: 'bg-[#e8f0fe] text-[#004AAD] border-[#a8c7f5]',
  uploaded: 'bg-blue-50 text-blue-600 border-blue-200',
  under_review: 'bg-amber-50 text-amber-700 border-amber-200',
  submitted: 'bg-blue-50 text-blue-600 border-blue-200',
  verified: 'bg-[#e8f0fe] text-[#004AAD] border-[#a8c7f5]',
  waiting_approve: 'bg-amber-50 text-amber-700 border-amber-200',
  declined: 'bg-red-50 text-red-600 border-red-200',
}

export default function StatusBadge({ status, className }) {
  const { t } = useTranslation()

  const styles = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', styles, className)}>
      {t(`workflow:states.${status}`)}
    </span>
  )
}
