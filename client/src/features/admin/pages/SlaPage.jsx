import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import FormInput from '@shared/components/ui/FormInput'
import { STATE_ORDER } from '@shared/utils/stateMachine'

const INITIAL_SLA = {
  registration: { target: 7, warning: 5, escalation: 'recruiter@ishla.uz' },
  assessment: { target: 14, warning: 10, escalation: 'recruiter@ishla.uz' },
  showcase: { target: 21, warning: 14, escalation: 'manager@ishla.uz' },
  hard_lock: { target: 7, warning: 5, escalation: 'manager@ishla.uz' },
  contracting: { target: 14, warning: 10, escalation: 'legal@ishla.uz' },
  work_permit: { target: 30, warning: 21, escalation: 'visa@ishla.uz' },
  visa: { target: 30, warning: 21, escalation: 'visa@ishla.uz' },
  deployment: { target: 14, warning: 10, escalation: 'operations@ishla.uz' },
  completed: { target: 0, warning: 0, escalation: '' },
}

export default function SlaPage() {
  const { t } = useTranslation('admin')
  const [sla, setSla] = useState(INITIAL_SLA)
  const [saved, setSaved] = useState(false)

  const handleChange = (state, field) => (e) => {
    setSla((prev) => ({
      ...prev,
      [state]: { ...prev[state], [field]: e.target.value },
    }))
    setSaved(false)
  }

  return (
    <div>
      <PageHeader title={t('sla.title')} />

      {saved && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 text-sm">
          <span>{t('sla.saved', 'SLA settings saved successfully.')}</span>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th>{t('sla.processStep')}</th>
                  <th>{t('sla.targetDuration')}</th>
                  <th>{t('sla.warningThreshold')}</th>
                  <th>{t('sla.escalationContact')}</th>
                </tr>
              </thead>
              <tbody>
                {STATE_ORDER.filter((s) => s !== 'completed').map((state) => (
                  <tr key={state}>
                    <td className="font-medium">
                      {t(`workflow:states.${state}`, state)}
                    </td>
                    <td>
                      <FormInput
                        name={`${state}_target`}
                        type="number"
                        value={sla[state]?.target || ''}
                        onChange={handleChange(state, 'target')}
                        className="w-24"
                      />
                    </td>
                    <td>
                      <FormInput
                        name={`${state}_warning`}
                        type="number"
                        value={sla[state]?.warning || ''}
                        onChange={handleChange(state, 'warning')}
                        className="w-24"
                      />
                    </td>
                    <td>
                      <FormInput
                        name={`${state}_escalation`}
                        type="email"
                        value={sla[state]?.escalation || ''}
                        onChange={handleChange(state, 'escalation')}
                        className="w-48"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors cursor-pointer" onClick={() => setSaved(true)}>{t('sla.saveSla')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
