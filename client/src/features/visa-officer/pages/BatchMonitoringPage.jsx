import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import ProgressBar from '@shared/components/ui/ProgressBar'
import DataTable from '@shared/components/ui/DataTable'

const MOCK_BATCHES = [
  {
    id: 'b001',
    batchId: 'B-2026-SA-001',
    employer: 'Al-Bina Construction',
    country: 'Saudi Arabia',
    totalCandidates: 10,
    processed: 8,
    pending: 2,
    departureDate: '2026-04-01',
    candidates: ['Азизбек Каримов', 'Бахтиёр Рахимов', 'Жасур Нурматов'],
  },
  {
    id: 'b002',
    batchId: 'B-2026-AE-001',
    employer: 'Emirates Hospitality Group',
    country: 'UAE',
    totalCandidates: 5,
    processed: 2,
    pending: 3,
    departureDate: '2026-05-15',
    candidates: ['Дилнора Усманова', 'Камола Нуриллаева'],
  },
  {
    id: 'b003',
    batchId: 'B-2026-KR-001',
    employer: 'Samsung Engineering Korea',
    country: 'South Korea',
    totalCandidates: 12,
    processed: 4,
    pending: 8,
    departureDate: '2026-06-01',
    candidates: ['Улугбек Ташматов'],
  },
  {
    id: 'b004',
    batchId: 'B-2026-DE-001',
    employer: 'German Medical Center',
    country: 'Germany',
    totalCandidates: 4,
    processed: 1,
    pending: 3,
    departureDate: '2026-07-01',
    candidates: ['Нодира Хасанова', 'Гульнора Рахматова'],
  },
  {
    id: 'b005',
    batchId: 'B-2026-TR-001',
    employer: 'Turkish Hotels Association',
    country: 'Turkey',
    totalCandidates: 15,
    processed: 7,
    pending: 8,
    departureDate: '2026-05-01',
    candidates: ['Зарина Абдуллаева'],
  },
]

export default function BatchMonitoringPage() {
  const { t } = useTranslation('visaOfficer')

  const columns = [
    { header: t('batchMonitoring.batchId'), accessor: 'batchId', sortable: true },
    { header: t('batchMonitoring.employer', 'Employer'), accessor: 'employer', sortable: true },
    { header: t('batchMonitoring.country', 'Country'), accessor: 'country', sortable: true },
    { header: t('batchMonitoring.totalCandidates'), accessor: 'totalCandidates', sortable: true },
    {
      header: t('batchMonitoring.progress'),
      render: (row) => (
        <div className="w-32">
          <ProgressBar value={row.processed} max={row.totalCandidates} size="sm" color={row.processed === row.totalCandidates ? 'success' : 'primary'} showPercent={false} />
          <span className="text-xs">{row.processed}/{row.totalCandidates}</span>
        </div>
      ),
    },
    { header: t('batchMonitoring.pending'), accessor: 'pending' },
    { header: t('batchMonitoring.departurDate'), accessor: 'departureDate', sortable: true },
  ]

  const totalCandidates = MOCK_BATCHES.reduce((s, b) => s + b.totalCandidates, 0)
  const totalProcessed = MOCK_BATCHES.reduce((s, b) => s + b.processed, 0)

  return (
    <div>
      <PageHeader title={t('batchMonitoring.title')} />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-4 text-center">
            <span className="text-2xl font-bold">{MOCK_BATCHES.length}</span>
            <span className="text-sm text-gray-500">{t('batchMonitoring.activeBatches', 'Active Batches')}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-4 text-center">
            <span className="text-2xl font-bold">{totalCandidates}</span>
            <span className="text-sm text-gray-500">{t('batchMonitoring.totalCandidates')}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-4 text-center">
            <span className="text-2xl font-bold text-green-600">{totalProcessed}</span>
            <span className="text-sm text-gray-500">{t('batchMonitoring.processed')}</span>
          </div>
        </div>
      </div>

      {/* Batch Table */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6">
        <div className="p-6">
          <DataTable columns={columns} data={MOCK_BATCHES} searchable pageSize={10} />
        </div>
      </div>

      {/* Batch Detail Cards */}
      <h3 className="text-lg font-semibold mb-4">{t('batchMonitoring.viewBatch')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_BATCHES.map((batch) => (
          <div key={batch.id} className="rounded-2xl border border-gray-100 bg-white">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{batch.batchId}</h4>
                  <p className="text-sm text-gray-500">{batch.employer} — {batch.country}</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{batch.departureDate}</span>
              </div>
              <ProgressBar value={batch.processed} max={batch.totalCandidates} label={`${batch.processed}/${batch.totalCandidates} processed`} color={batch.processed === batch.totalCandidates ? 'success' : 'primary'} />
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Candidates in batch:</p>
                <div className="flex flex-wrap gap-1">
                  {batch.candidates.map((name) => (
                    <span key={name} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs border border-gray-300 text-gray-600">{name}</span>
                  ))}
                  {batch.totalCandidates > batch.candidates.length && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">+{batch.totalCandidates - batch.candidates.length} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
