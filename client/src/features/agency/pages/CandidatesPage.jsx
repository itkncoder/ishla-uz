import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import DataTable from '@shared/components/ui/DataTable'
import StatusBadge from '@shared/components/StatusBadge'
import FormSelect from '@shared/components/ui/FormSelect'
import ProgressBar from '@shared/components/ui/ProgressBar'
import { candidatesApi } from '@/api/candidates'
import useClassificationsStore from '@stores/classificationsStore'
import { STATE_ORDER } from '@shared/utils/stateMachine'

const RECRUITER_MAP = {
  r001: 'Рустам Файзуллаев',
  r002: 'Фарход Турсунов',
}

export default function CandidatesPage() {
  const { t } = useTranslation('agency')
  const { industries: INDUSTRIES, fetch: fetchClassifications } = useClassificationsStore()
  const [allCandidates, setAllCandidates] = useState([])

  useEffect(() => {
    fetchClassifications()
    candidatesApi.list().then((data) => setAllCandidates(Array.isArray(data) ? data : data.data || []))
  }, [fetchClassifications])

  const [filterRecruiter, setFilterRecruiter] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')

  let candidates = [...allCandidates]
  if (filterRecruiter) candidates = candidates.filter((c) => c.recruiterId === filterRecruiter)
  if (filterStage) candidates = candidates.filter((c) => c.currentState === filterStage)
  if (filterIndustry) candidates = candidates.filter((c) => c.industry === filterIndustry)

  const columns = [
    { header: t('candidates.name', 'Name'), accessor: 'name', sortable: true },
    {
      header: t('candidates.recruiter', 'Recruiter'),
      accessor: 'recruiterId',
      render: (row) => RECRUITER_MAP[row.recruiterId] || row.recruiterId,
    },
    { header: t('candidates.specialization', 'Specialization'), accessor: 'specialization' },
    { header: t('candidates.industry', 'Industry'), accessor: 'industry' },
    {
      header: t('candidates.stage', 'Stage'),
      accessor: 'currentState',
      render: (row) => <StatusBadge status={row.currentState} />,
    },
    {
      header: t('candidates.progress', 'Profile'),
      accessor: 'profileComplete',
      render: (row) => <ProgressBar value={row.profileComplete} size="sm" showPercent className="w-24" />,
    },
    { header: t('candidates.registered', 'Registered'), accessor: 'createdAt', sortable: true },
  ]

  return (
    <div>
      <PageHeader title={t('candidates.title', 'Candidates')} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <FormSelect
          name="filterRecruiter"
          value={filterRecruiter}
          onChange={(e) => setFilterRecruiter(e.target.value)}
          options={[{ value: '', label: 'All Recruiters' }, ...Object.entries(RECRUITER_MAP).map(([id, name]) => ({ value: id, label: name }))]}
          className="w-48"
        />
        <FormSelect
          name="filterStage"
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          options={[{ value: '', label: 'All Stages' }, ...STATE_ORDER.map((s) => ({ value: s, label: t(`workflow:states.${s}`, s) }))]}
          className="w-48"
        />
        <FormSelect
          name="filterIndustry"
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          options={[{ value: '', label: 'All Industries' }, ...INDUSTRIES.map((i) => ({ value: i.id, label: i.label }))]}
          className="w-48"
        />
        <span className="flex items-center text-sm text-gray-500">{candidates.length} candidates</span>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <DataTable columns={columns} data={candidates} searchable pageSize={15} />
        </div>
      </div>
    </div>
  )
}
