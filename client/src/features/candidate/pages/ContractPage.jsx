import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import EmptyState from '@shared/components/ui/EmptyState'
import StatusBadge from '@shared/components/StatusBadge'
import useCandidateProfileStore from '@stores/candidateProfileStore'

// Mock contract for candidates in contracting+ states
const MOCK_CONTRACT = {
  id: 'ctr001',
  employer: 'Al-Bina Construction',
  position: 'Сварщик',
  country: 'Саудовская Аравия',
  city: 'Эр-Рияд',
  salary: '$1,500/мес',
  contractDuration: '24 месяца',
  startDate: '2026-03-01',
  endDate: '2028-02-28',
  benefits: 'Проживание, питание, медицинская страховка, авиабилеты',
  signingStatus: 'pending',
  documentUrl: '#',
}

const CONTRACT_STATES = ['contracting', 'work_permit', 'visa', 'deployment', 'completed']

export default function ContractPage() {
  const { t } = useTranslation('candidate')
  const profile = useCandidateProfileStore((s) => s.profile)
  const hasContract = CONTRACT_STATES.includes(profile.currentState)

  if (!hasContract) {
    return (
      <div>
        <PageHeader title={t('contract.title')} />
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <EmptyState
            icon="📝"
            title={t('contract.noContract', 'No contract yet')}
            message={t('contract.noContractMessage', "You'll see contract details here once you're assigned to an employer and a contract is prepared.")}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={t('contract.title')} />

      {/* Contract Status */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">{t('contract.contractDetails', 'Contract Details')}</h3>
          <StatusBadge status={MOCK_CONTRACT.signingStatus === 'signed' ? 'approved' : 'pending'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">{t('contract.employer', 'Employer')}</label>
            <p className="font-medium text-gray-900">{MOCK_CONTRACT.employer}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('contract.position', 'Position')}</label>
            <p className="font-medium text-gray-900">{MOCK_CONTRACT.position}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('contract.country', 'Country')}</label>
            <p className="font-medium text-gray-900">{MOCK_CONTRACT.country}, {MOCK_CONTRACT.city}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('contract.salary', 'Salary')}</label>
            <p className="font-medium text-gray-900">{MOCK_CONTRACT.salary}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('contract.duration', 'Duration')}</label>
            <p className="font-medium text-gray-900">{MOCK_CONTRACT.contractDuration}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('contract.dates', 'Dates')}</label>
            <p className="font-medium text-gray-900">{MOCK_CONTRACT.startDate} — {MOCK_CONTRACT.endDate}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">{t('contract.benefits', 'Benefits')}</label>
            <p className="font-medium text-gray-900">{MOCK_CONTRACT.benefits}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('contract.actions', 'Actions')}</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            {t('contract.viewContract')}
          </button>
          {MOCK_CONTRACT.signingStatus === 'pending' && (
            <button className="px-5 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003275] hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer">
              {t('contract.signContract')}
            </button>
          )}
          {MOCK_CONTRACT.signingStatus === 'signed' && (
            <div className="flex items-center gap-2 text-[#003275]">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{t('contract.signed')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
