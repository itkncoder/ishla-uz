import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import DataTable from '@shared/components/ui/DataTable'
import StatusBadge from '@shared/components/StatusBadge'
import Modal from '@shared/components/ui/Modal'
import FormInput from '@shared/components/ui/FormInput'
import FormSelect from '@shared/components/ui/FormSelect'
import FormTextarea from '@shared/components/ui/FormTextarea'

const MOCK_VISA_APPS = [
  { id: 'va001', appId: 'V-2026-001', candidateName: 'Зарина Абдуллаева', destination: 'Turkey', visaType: 'Work Visa', submissionDate: '2026-01-15', expiryDate: '2026-04-15', status: 'in_progress' },
  { id: 'va002', appId: 'V-2026-002', candidateName: 'Улугбек Ташматов', destination: 'South Korea', visaType: 'Work Visa (E-9)', submissionDate: '2026-01-20', expiryDate: '2026-04-20', status: 'pending' },
  { id: 'va003', appId: 'V-2026-003', candidateName: 'Нодира Хасанова', destination: 'Germany', visaType: 'Work Visa', submissionDate: '2026-02-01', expiryDate: '2026-05-01', status: 'pending' },
  { id: 'va004', appId: 'V-2026-004', candidateName: 'Бахтиёр Рахимов', destination: 'Saudi Arabia', visaType: 'Work Visa', submissionDate: '2025-12-20', expiryDate: '2026-03-20', status: 'approved' },
  { id: 'va005', appId: 'V-2026-005', candidateName: 'Гульнора Рахматова', destination: 'Germany', visaType: 'Work Visa', submissionDate: '2026-02-10', expiryDate: '2026-05-10', status: 'pending' },
  { id: 'va006', appId: 'V-2026-006', candidateName: 'Жасур Нурматов', destination: 'Saudi Arabia', visaType: 'Work Visa', submissionDate: '2025-11-10', expiryDate: '2026-02-10', status: 'approved' },
]

export default function VisaFormsPage() {
  const { t } = useTranslation('visaOfficer')
  const [apps, setApps] = useState(MOCK_VISA_APPS)
  const [selectedApp, setSelectedApp] = useState(null)
  const [note, setNote] = useState('')

  const handleAction = (id, status) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
    setSelectedApp(null)
    setNote('')
  }

  const columns = [
    { header: t('visaForms.applicationId'), accessor: 'appId', sortable: true },
    { header: t('visaForms.candidateName'), accessor: 'candidateName', sortable: true },
    { header: t('visaForms.destination'), accessor: 'destination', sortable: true },
    { header: t('visaForms.visaType'), accessor: 'visaType' },
    { header: t('visaForms.submissionDate'), accessor: 'submissionDate', sortable: true },
    { header: t('visaForms.expiryDate'), accessor: 'expiryDate', sortable: true },
    {
      header: t('visaForms.status'),
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: '',
      render: (row) => row.status === 'pending' || row.status === 'in_progress' ? (
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); handleAction(row.id, 'approved') }}>
            {t('visaForms.approve')}
          </button>
          <button className="px-3 py-1 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedApp(row) }}>
            {t('visaForms.reject')}
          </button>
        </div>
      ) : null,
    },
  ]

  return (
    <div>
      <PageHeader title={t('visaForms.title')} />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl border border-gray-100 bg-amber-50"><div className="p-3 text-center"><span className="text-2xl font-bold text-amber-600">{apps.filter((a) => a.status === 'pending').length}</span><span className="text-xs">Pending</span></div></div>
        <div className="rounded-2xl border border-gray-100 bg-blue-50"><div className="p-3 text-center"><span className="text-2xl font-bold text-blue-600">{apps.filter((a) => a.status === 'in_progress').length}</span><span className="text-xs">In Progress</span></div></div>
        <div className="rounded-2xl border border-gray-100 bg-green-50"><div className="p-3 text-center"><span className="text-2xl font-bold text-green-600">{apps.filter((a) => a.status === 'approved').length}</span><span className="text-xs">Approved</span></div></div>
        <div className="rounded-2xl border border-gray-100 bg-red-50"><div className="p-3 text-center"><span className="text-2xl font-bold text-red-600">{apps.filter((a) => a.status === 'rejected').length}</span><span className="text-xs">Rejected</span></div></div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <DataTable columns={columns} data={apps} searchable pageSize={10} />
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={t('visaForms.reject')}
        actions={
          <>
            <button className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setSelectedApp(null)}>{t('common:actions.cancel')}</button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer" onClick={() => handleAction(selectedApp?.id, 'rejected')}>{t('visaForms.reject')}</button>
          </>
        }
      >
        {selectedApp && (
          <div>
            <p className="mb-2"><strong>{selectedApp.candidateName}</strong> — {selectedApp.destination}</p>
            <FormTextarea label="Reason" name="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          </div>
        )}
      </Modal>
    </div>
  )
}
