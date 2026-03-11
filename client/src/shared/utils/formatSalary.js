/**
 * Format a number with space-separated thousands: 7000000 → "7 000 000"
 */
export function formatSalary(value) {
  if (value === '' || value === null || value === undefined) return ''
  const num = String(value).replace(/\s/g, '').replace(/[^0-9]/g, '')
  if (!num) return ''
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Remove formatting and return raw number string: "7 000 000" → "7000000"
 */
export function parseSalary(formatted) {
  if (!formatted) return ''
  return String(formatted).replace(/\s/g, '')
}
