import dayjs from 'dayjs'
import { SLA_THRESHOLDS } from '@config/constants'

export function daysUntilExpiry(date) {
  if (!date) return null
  return dayjs(date).diff(dayjs(), 'day')
}

export function getSlaStatus(date) {
  const days = daysUntilExpiry(date)

  if (days === null || days < SLA_THRESHOLDS.CRITICAL) {
    return { bg: 'bg-neutral', text: 'text-neutral-content', label: 'expired', days: days ?? 0, level: 'expired' }
  }
  if (days <= SLA_THRESHOLDS.WARNING) {
    return { bg: 'bg-error', text: 'text-error-content', label: 'critical', days, level: 'critical' }
  }
  if (days <= SLA_THRESHOLDS.OK) {
    return { bg: 'bg-warning', text: 'text-warning-content', label: 'warning', days, level: 'warning' }
  }
  return { bg: 'bg-success', text: 'text-success-content', label: 'ok', days, level: 'ok' }
}
