import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { getSlaStatus } from '@shared/utils/slaCalculator'

export default function useSlaTimer(date) {
  const [now, setNow] = useState(() => dayjs())

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!date) {
    return { days: 0, hours: 0, minutes: 0, slaStatus: getSlaStatus(null), isExpired: true }
  }

  const target = dayjs(date)
  const diffMs = target.diff(now)
  const isExpired = diffMs <= 0

  const absDiff = Math.abs(diffMs)
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))

  return {
    days,
    hours,
    minutes,
    slaStatus: getSlaStatus(date),
    isExpired,
  }
}
