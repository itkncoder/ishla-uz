import dayjs from 'dayjs'

export function formatDate(date, format = 'DD.MM.YYYY') {
  if (!date) return '\u2014'
  return dayjs(date).format(format)
}

export function formatDateTime(date) {
  return formatDate(date, 'DD.MM.YYYY HH:mm')
}

export function formatRelative(date) {
  if (!date) return '\u2014'
  const days = dayjs(date).diff(dayjs(), 'day')
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days > 0) return `In ${days} days`
  return `${Math.abs(days)} days ago`
}
