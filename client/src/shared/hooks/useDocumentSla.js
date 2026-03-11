import { useMemo } from 'react'
import { getSlaStatus } from '@shared/utils/slaCalculator'

export default function useDocumentSla(documents) {
  return useMemo(() => {
    const items = documents.map(doc => ({
      ...doc,
      sla: getSlaStatus(doc.expiryDate),
    }))

    const summary = items.reduce(
      (acc, item) => {
        acc.total++
        if (item.sla.level === 'ok') acc.green++
        else if (item.sla.level === 'warning') acc.yellow++
        else if (item.sla.level === 'critical') acc.red++
        else acc.gray++
        return acc
      },
      { total: 0, green: 0, yellow: 0, red: 0, gray: 0 }
    )

    return { items, summary }
  }, [documents])
}
