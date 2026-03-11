import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from '@shared/components/ui/DataTable'
import StatusBadge from '@shared/components/StatusBadge'
import Modal from '@shared/components/ui/Modal'
import { Input, Select, Textarea } from '@shared/components/styled/FormElements'
import useJobOrderStore from '@stores/jobOrderStore'
import useClassificationsStore from '@stores/classificationsStore'
import localize from '@shared/utils/localize'
import { formatSalary, parseSalary } from '@shared/utils/formatSalary'

const TABS = ['all', 'active', 'declined', 'waiting_approve']

const EMPTY_ORDER = {
  title: '',
  description: '',
  industry: '',
  country: '',
  city: '',
  experienceMin: '',
  gender: '',
  salaryAmount: '',
  salaryCurrency: 'USD',
  benefits: '',
}

export default function JobOrdersPage() {
  const { t, i18n } = useTranslation('employer')
  const lang = i18n.language
  const { industries: INDUSTRIES, countries: COUNTRIES, fetch: fetchClassifications } = useClassificationsStore()
  const rawJobOrders = useJobOrderStore((s) => s.jobOrders)
  const fetchJobOrders = useJobOrderStore((s) => s.fetch)
  const jobOrders = useMemo(() => rawJobOrders.map((jo) => ({
    ...jo,
    titleText: localize(jo.title, lang),
  })), [rawJobOrders, lang])
  const createOrder = useJobOrderStore((s) => s.create)
  const updateStatus = useJobOrderStore((s) => s.updateStatus)

  useEffect(() => { fetchClassifications(); fetchJobOrders() }, [fetchClassifications, fetchJobOrders])

  const [activeTab, setActiveTab] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_ORDER })

  const filtered = activeTab === 'all' ? jobOrders : jobOrders.filter((jo) => jo.status === activeTab)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleCreate = () => {
    createOrder({
      title: form.title,
      description: form.description,
      employer: { id: 'e001', name: 'Al-Bina Construction', country: form.country },
      industry: form.industry,
      country: form.country,
      city: form.city,
      requirements: {
        experienceMin: Number(form.experienceMin) || 0,
        skills: [],
        languages: [],
        gender: form.gender || null,
        ageMin: 18,
        ageMax: 65,
      },
      salary: { amount: Number(form.salaryAmount), currency: form.salaryCurrency },
      benefits: form.benefits,
      recruiterId: 'r001',
    })
    setShowModal(false)
    setForm({ ...EMPTY_ORDER })
  }

  const columns = [
    { header: t('jobOrders.position'), accessor: 'titleText', sortable: true },
    {
      header: t('jobOrders.salary'),
      accessor: 'salary',
      render: (row) => `${formatSalary(row.salary.amount)} ${row.salary.currency}`,
    },
    {
      header: t('jobOrders.status'),
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: '',
      render: (row) => (
        <div className="flex gap-1">
          {row.status === 'waiting_approve' && (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium text-amber-600">
              {t('jobOrders.tab_waiting_approve', 'Waiting')}
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('jobOrders.title')}</h1>

      {/* Tabs + Create */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {t(`jobOrders.tab_${tab}`, tab.charAt(0).toUpperCase() + tab.slice(1))}
              {tab !== 'all' && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab ? 'bg-[#e8f0fe] text-[#003275]' : 'bg-gray-200 text-gray-500'
                }`}>
                  {jobOrders.filter((jo) => jo.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          + {t('jobOrders.create')}
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <DataTable
          columns={columns}
          data={filtered}
          searchable
          searchPlaceholder={t('common:actions.search')}
          pageSize={10}
          emptyMessage={t('jobOrders.noOrders', 'No job orders found')}
        />
      </div>

      {/* Create Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t('jobOrders.create')}
        size="lg"
        actions={
          <>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              {t('common:actions.cancel')}
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] hover:shadow-xs transition-all cursor-pointer"
              onClick={handleCreate}
            >
              {t('common:actions.save')}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label={t('jobOrders.position')} value={form.title} onChange={handleChange('title')} required />
          <Textarea label={t('jobOrders.description', 'Description')} value={form.description} onChange={handleChange('description')} rows={3} />

          <div className="grid grid-cols-2 gap-4">
            <Select label={t('jobOrders.industry', 'Industry')} value={form.industry} onChange={handleChange('industry')} options={INDUSTRIES.map((i) => ({ value: i.id, label: i.label }))} placeholder="Select" />
            <Select label={t('jobOrders.country', 'Country')} value={form.country} onChange={handleChange('country')} options={COUNTRIES.map((c) => ({ value: c.id, label: c.label }))} placeholder="Select" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label={t('jobOrders.city', 'City')} value={form.city} onChange={handleChange('city')} />
            <Select label={t('jobOrders.gender', 'Gender')} value={form.gender} onChange={handleChange('gender')} options={[{ value: '', label: 'Any' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label={t('jobOrders.salaryAmount', 'Salary')} value={formatSalary(form.salaryAmount)} onChange={(e) => setForm((prev) => ({ ...prev, salaryAmount: parseSalary(e.target.value) }))} placeholder="7 000 000" />
            <Select label={t('jobOrders.currency', 'Currency')} value={form.salaryCurrency} onChange={handleChange('salaryCurrency')} options={[{ value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'SAR', label: 'SAR' }]} />
            <Input label={t('jobOrders.experienceMin', 'Min Exp (yrs)')} type="number" value={form.experienceMin} onChange={handleChange('experienceMin')} />
          </div>

          <Textarea label={t('jobOrders.benefits', 'Benefits')} value={form.benefits} onChange={handleChange('benefits')} rows={2} />

        </div>
      </Modal>
    </div>
  )
}
