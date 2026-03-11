import clsx from 'clsx'
import { getSlaStatus } from '@shared/utils/slaCalculator'

export default function SlaIndicator({ date }) {
  const sla = getSlaStatus(date)

  const tip = sla.level === 'expired'
    ? `Expired ${Math.abs(sla.days)} days ago`
    : `${sla.days} days remaining (${sla.label})`

  return (
    <div title={tip}>
      <div className={clsx('w-3 h-3 rounded-full', sla.bg)} />
    </div>
  )
}
