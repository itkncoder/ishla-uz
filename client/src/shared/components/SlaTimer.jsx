import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { TIMER_TYPES } from '@config/constants'
import useSlaTimer from '@shared/hooks/useSlaTimer'

export default function SlaTimer({ date, type = TIMER_TYPES.B, onExpired, onThresholdCrossed }) {
  const { days, hours, minutes, slaStatus, isExpired } = useSlaTimer(date)
  const prevLevelRef = useRef(slaStatus.level)
  const isManaged = type === TIMER_TYPES.A

  useEffect(() => {
    if (!isManaged) return

    if (isExpired && onExpired) {
      onExpired()
    }
  }, [isExpired, isManaged, onExpired])

  useEffect(() => {
    if (!isManaged || !onThresholdCrossed) return

    const prev = prevLevelRef.current
    const curr = slaStatus.level

    if (prev !== curr && (curr === 'warning' || curr === 'critical')) {
      onThresholdCrossed(curr)
    }

    prevLevelRef.current = curr
  }, [slaStatus.level, isManaged, onThresholdCrossed])

  const prefix = isExpired ? '-' : ''
  const countdownText = `${prefix}${days}d ${hours}h ${minutes}m`

  return (
    <span
      className={clsx(
        'font-mono text-sm font-semibold px-2 py-0.5 rounded',
        slaStatus.bg,
        slaStatus.text,
        isManaged && slaStatus.level === 'critical' && 'animate-pulse',
      )}
    >
      {countdownText}
    </span>
  )
}
