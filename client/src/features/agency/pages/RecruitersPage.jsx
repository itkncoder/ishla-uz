import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import DataTable from '@shared/components/ui/DataTable'
import Modal from '@shared/components/ui/Modal'
import FormInput from '@shared/components/ui/FormInput'
import { candidatesApi } from '@/api/candidates'

const MOCK_AGENCY_RECRUITERS = [
  { id: 'r001', name: 'Рустам Файзуллаев', email: 'rustam.f@ishla.uz', phone: '+998901111111', status: 'active', joinedAt: '2025-06-01' },
  { id: 'r002', name: 'Фарход Турсунов', email: 'farhod.t@ishla.uz', phone: '+998902222222', status: 'active', joinedAt: '2025-07-15' },
  { id: 'r003', name: 'Сардор Алимов', email: 'sardor.a@ishla.uz', phone: '+998903333333', status: 'inactive', joinedAt: '2025-08-20' },
]

export default function RecruitersPage() {
  const { t } = useTranslation('agency')
  const [candidates, setCandidates] = useState([])
  const [recruiters, setRecruiters] = useState(MOCK_AGENCY_RECRUITERS)

  useEffect(() => {
    candidatesApi.list().then((data) => setCandidates(Array.isArray(data) ? data : data.data || []))
  }, [])
  const [showModal, setShowModal] = useState(false)

  const columns = [
    { header: t('recruiters.name', 'Name'), accessor: 'name', sortable: true },
    { header: t('recruiters.email', 'Email'), accessor: 'email' },
    { header: t('recruiters.phone', 'Phone'), accessor: 'phone' },
    {
      header: t('recruiters.candidates', 'Candidates'),
      render: (row) => candidates.filter((c) => c.recruiterId === row.id).length,
    },
    {
      header: t('recruiters.status', 'Status'),
      accessor: 'status',
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{row.status}</span>
      ),
    },
    { header: t('recruiters.joined', 'Joined'), accessor: 'joinedAt', sortable: true },
    {
      header: '',
      render: (row) => (
        <button
          className={`px-2 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${row.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
          onClick={(e) => {
            e.stopPropagation()
            setRecruiters((prev) => prev.map((r) => r.id === row.id ? { ...r, status: row.status === 'active' ? 'inactive' : 'active' } : r))
          }}
        >
          {row.status === 'active' ? t('recruiters.remove', 'Remove') : t('recruiters.activate', 'Activate')}
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title={t('recruiters.title', 'Recruiters')} />

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">{recruiters.length} total</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">{recruiters.filter((r) => r.status === 'active').length} active</span>
        </div>
        <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#004AAD] text-white hover:bg-[#003d8f] transition-colors cursor-pointer" onClick={() => setShowModal(true)}>+ {t('recruiters.add', 'Add Recruiter')}</button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <DataTable columns={columns} data={recruiters} searchable pageSize={10} />
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t('recruiters.add', 'Add Recruiter')}
        actions={
          <>
            <button className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setShowModal(false)}>{t('common:actions.cancel')}</button>
            <button className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors cursor-pointer" onClick={() => setShowModal(false)}>{t('common:actions.save')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label={t('recruiters.name', 'Full Name')} name="name" required />
          <FormInput label={t('recruiters.email', 'Email')} name="email" type="email" required />
          <FormInput label={t('recruiters.phone', 'Phone')} name="phone" type="tel" placeholder="+998" />
        </div>
      </Modal>
    </div>
  )
}
