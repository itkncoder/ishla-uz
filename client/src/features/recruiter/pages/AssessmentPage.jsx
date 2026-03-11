import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import FormSelect from '@shared/components/ui/FormSelect'
import FormTextarea from '@shared/components/ui/FormTextarea'
import FormInput from '@shared/components/ui/FormInput'
import StatusBadge from '@shared/components/StatusBadge'
import ProgressBar from '@shared/components/ui/ProgressBar'
import Modal from '@shared/components/ui/Modal'
import { candidatesApi } from '@/api/candidates'
import { assessmentsApi } from '@/api/assessments'

export default function AssessmentPage() {
  const { t } = useTranslation('recruiter')

  const ASSESSMENT_TYPES = [
    { value: 'skill', label: t('assessment.skillEvaluation') },
    { value: 'language', label: t('assessment.languageTest') },
    { value: 'medical', label: t('assessment.medicalCheck') },
    { value: 'interview', label: t('assessment.interview') },
  ]
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ candidateId: '', type: '', category: '', score: '', maxScore: '100', passed: '', notes: '' })

  const [candidates, setCandidates] = useState([])
  const [allAssessments, setAllAssessments] = useState([])

  useEffect(() => {
    candidatesApi.list().then(data => setCandidates(Array.isArray(data) ? data : data.data || []))
    assessmentsApi.list().then(data => setAllAssessments(Array.isArray(data) ? data : data.data || []))
  }, [])

  const pendingCandidates = candidates.filter((c) => c.currentState === 'assessment')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div>
      <PageHeader title={t('assessment.title')} />

      {/* Pending Assessments */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-900">{t('assessment.pendingCandidates', 'Candidates Pending Assessment')}</h3>
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#004AAD] text-white hover:bg-[#003d8f] transition-colors cursor-pointer" onClick={() => setShowModal(true)}>+ {t('assessment.newAssessment', 'New Assessment')}</button>
          </div>
          {pendingCandidates.length === 0 ? (
            <p className="text-gray-400 text-sm">{t('assessment.noPending', 'No candidates pending assessment.')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingCandidates.map((c) => (
                <div key={c.id} className="p-3 bg-[#f5f5f5] rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.specialization}</p>
                    </div>
                    <StatusBadge status="assessment" />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.skills.slice(0, 3).map((s) => <span key={s} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-gray-200 text-gray-600">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assessment History */}
      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">{t('assessment.history', 'Assessment History')}</h3>
          <div className="space-y-3">
            {allAssessments.map((a) => {
              const candidate = candidates.find((c) => c.id === a.candidateId)
              return (
                <div key={a.id} className="flex items-center gap-4 p-3 bg-[#f5f5f5] rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{candidate?.name || a.candidateId}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{a.type}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${a.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {a.passed ? t('assessment.pass') : t('assessment.fail')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{a.category}</p>
                  </div>
                  <div className="w-32">
                    {a.score !== null && (
                      <ProgressBar value={a.score} max={a.maxScore} size="sm" color={a.passed ? 'success' : 'error'} />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{a.assessedAt}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* New Assessment Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t('assessment.newAssessment', 'New Assessment')}
        actions={
          <>
            <button className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setShowModal(false)}>{t('common:actions.cancel')}</button>
            <button className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors cursor-pointer" onClick={() => setShowModal(false)}>{t('assessment.submitAssessment')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <FormSelect
            label={t('assessment.candidate', 'Candidate')}
            name="candidateId"
            value={form.candidateId}
            onChange={handleChange('candidateId')}
            options={candidates.map((c) => ({ value: c.id, label: `${c.name} (${c.specialization})` }))}
            placeholder={t('assessment.selectCandidate')}
            required
          />
          <FormSelect
            label={t('assessment.type', 'Assessment Type')}
            name="type"
            value={form.type}
            onChange={handleChange('type')}
            options={ASSESSMENT_TYPES}
            placeholder={t('assessment.selectType')}
            required
          />
          <FormInput label={t('assessment.category', 'Category')} name="category" value={form.category} onChange={handleChange('category')} placeholder={t('assessment.categoryPlaceholder')} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label={t('assessment.score', 'Score')} name="score" type="number" value={form.score} onChange={handleChange('score')} />
            <FormInput label={t('assessment.maxScore', 'Max Score')} name="maxScore" type="number" value={form.maxScore} onChange={handleChange('maxScore')} />
          </div>
          <FormSelect
            label={t('assessment.result', 'Result')}
            name="passed"
            value={form.passed}
            onChange={handleChange('passed')}
            options={[
              { value: 'true', label: t('assessment.pass') },
              { value: 'false', label: t('assessment.fail') },
            ]}
            placeholder={t('assessment.selectResult')}
          />
          <FormTextarea label={t('assessment.notes', 'Notes')} name="notes" value={form.notes} onChange={handleChange('notes')} rows={3} />
        </div>
      </Modal>
    </div>
  )
}
