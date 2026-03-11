import clsx from 'clsx'
import SlaIndicator from '@shared/components/SlaIndicator'
import { formatDate } from '@shared/utils/dateFormatter'
import { getSlaStatus } from '@shared/utils/slaCalculator'

export default function DocumentTimelineItem({ document }) {
  const { name, type, expiryDate, status, progress } = document
  const sla = getSlaStatus(expiryDate)

  return (
    <div className="flex items-start gap-4 rounded-xl bg-white border border-gray-100 p-4">
      <div className="flex flex-col items-center gap-1 pt-1">
        <SlaIndicator date={expiryDate} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-sm text-gray-400">{formatDate(expiryDate)}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', sla.bg, sla.text)}>
            {type}
          </span>
          <span className="text-xs text-gray-400">{status}</span>
        </div>
        <div className="mt-2 w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#004AAD] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
