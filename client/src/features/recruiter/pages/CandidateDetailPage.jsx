import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import StatusBadge from '@shared/components/StatusBadge'
import ProgressBar from '@shared/components/ui/ProgressBar'
import EmptyState from '@shared/components/ui/EmptyState'
import { candidatesApi } from '@/api/candidates'
import { documentsApi } from '@/api/documents'
import { assessmentsApi } from '@/api/assessments'
import useClassificationsStore from '@stores/classificationsStore'
import { STATE_ORDER, TRANSITIONS } from '@shared/utils/stateMachine'

const TABS = ['profile', 'documents', 'assessments', 'workflow', 'notes']

const STATUS_MAP = {
  not_uploaded: 'draft',
  uploaded: 'pending',
  under_review: 'reviewing',
  approved: 'approved',
  rejected: 'rejected',
}

export default function CandidateDetailPage() {
  const { t } = useTranslation(['recruiter', 'workflow', 'documents'])
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('profile')
  const [notes, setNotes] = useState([
    { id: 1, text: 'Candidate seems very motivated. Good communication skills.', date: '2025-11-10', author: 'Recruiter' },
  ])
  const [newNote, setNewNote] = useState('')

  const [candidate, setCandidate] = useState(null)
  const [docs, setDocs] = useState([])
  const [assessments, setAssessments] = useState([])
  const { languages: LANGUAGES, languageLevels: LANGUAGE_LEVELS, fetch: fetchClassifications } = useClassificationsStore()

  useEffect(() => {
    fetchClassifications()
    candidatesApi.get(id).then(data => setCandidate(data))
    documentsApi.list({ candidateId: id }).then(data => setDocs(Array.isArray(data) ? data : data.data || []))
    assessmentsApi.list({ candidateId: id }).then(data => setAssessments(Array.isArray(data) ? data : data.data || []))
  }, [id])

  if (!candidate) {
    return <EmptyState icon="❓" title={t('recruiter:candidateDetail.candidateNotFound')} />
  }
  const stateIdx = STATE_ORDER.indexOf(candidate.currentState)
  const progress = Math.round((stateIdx / (STATE_ORDER.length - 1)) * 100)
  const transition = TRANSITIONS[candidate.currentState]

  const handleAddNote = () => {
    if (!newNote.trim()) return
    setNotes((prev) => [...prev, { id: Date.now(), text: newNote, date: new Date().toISOString().split('T')[0], author: 'Recruiter' }])
    setNewNote('')
  }

  return (
    <div>
      <PageHeader title={`${candidate.name} — ${t('recruiter:candidateDetail.title')}`} />

      {/* Header Card */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              <p className="text-sm text-gray-400">{candidate.specialization} | {candidate.region}</p>
              <p className="text-sm text-gray-400">{candidate.email} | {candidate.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#004AAD" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${candidate.profileComplete * 1.508} 150.8`} />
                  </svg>
                  <span className="absolute text-xs font-medium">{candidate.profileComplete}%</span>
                </div>
                <p className="text-xs mt-1">{t('recruiter:candidateDetail.profile')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {t(`recruiter:candidateDetail.${tab}`, tab)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white">
            <div className="p-6">
              <h3 className="font-semibold mb-3">{t('recruiter:candidateDetail.personalInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-400">DOB:</span> <span className="font-medium">{candidate.dob}</span></div>
                <div><span className="text-gray-400">Gender:</span> <span className="font-medium">{candidate.gender}</span></div>
                <div><span className="text-gray-400">Region:</span> <span className="font-medium">{candidate.region}, {candidate.district}</span></div>
                <div><span className="text-gray-400">Industry:</span> <span className="font-medium">{candidate.industry}</span></div>
                <div><span className="text-gray-400">Experience:</span> <span className="font-medium">{candidate.experienceYears} years</span></div>
                <div><span className="text-gray-400">Specialization:</span> <span className="font-medium">{candidate.specialization}</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white">
              <div className="p-6">
                <h3 className="font-semibold mb-3">{t('recruiter:candidateDetail.education')}</h3>
                {candidate.education.map((edu, i) => (
                  <div key={i} className="mb-2 p-2 bg-[#f5f5f5] rounded">
                    <p className="font-medium text-sm">{edu.institution}</p>
                    <p className="text-xs text-gray-400">{edu.degree} — {edu.field} ({edu.year})</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white">
              <div className="p-6">
                <h3 className="font-semibold mb-3">{t('recruiter:candidateDetail.skillsAndLanguages')}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {candidate.skills.map((s) => <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-gray-300 text-gray-600">{s}</span>)}
                </div>
                {candidate.languages.map((lang, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{LANGUAGES.find((l) => l.id === lang.id)?.label || lang.id}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#e8f0fe] text-[#004AAD]">{LANGUAGE_LEVELS.find((l) => l.value === lang.level)?.label || lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="font-semibold mb-3">{t('recruiter:candidateDetail.documentStatus')}</h3>
            {docs.length === 0 ? (
              <EmptyState icon="📄" title={t('recruiter:candidateDetail.noDocuments')} message={t('recruiter:candidateDetail.noDocumentsMessage')} />
            ) : (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📄</span>
                      <div>
                        <p className="font-medium text-sm">{t(`documents:types.${doc.type}`)}</p>
                        <p className="text-xs text-gray-400">{doc.fileName || t('recruiter:candidateDetail.notUploaded')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={STATUS_MAP[doc.status] || doc.status} />
                      {doc.status === 'uploaded' || doc.status === 'under_review' ? (
                        <div className="flex gap-1">
                          <button className="px-2 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors cursor-pointer">{t('recruiter:documents.verify')}</button>
                          <button className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer">{t('recruiter:documents.requestReupload')}</button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assessments Tab */}
      {activeTab === 'assessments' && (
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">{t('recruiter:candidateDetail.assessmentHistory')}</h3>
              <button className="px-3 py-1.5 rounded-lg bg-[#004AAD] text-white text-xs font-medium hover:bg-[#003d8f] transition-colors cursor-pointer">{t('recruiter:candidateDetail.newAssessment')}</button>
            </div>
            {assessments.length === 0 ? (
              <EmptyState icon="✅" title={t('recruiter:candidateDetail.noAssessments')} message={t('recruiter:candidateDetail.noAssessmentsMessage')} />
            ) : (
              <div className="space-y-3">
                {assessments.map((a) => (
                  <div key={a.id} className="p-3 bg-[#f5f5f5] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-sm">{a.category}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ml-2">{a.type}</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${a.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {a.passed ? t('recruiter:assessment.pass') : t('recruiter:assessment.fail')}
                      </span>
                    </div>
                    {a.score !== null && (
                      <ProgressBar value={a.score} max={a.maxScore} size="sm" color={a.passed ? 'success' : 'error'} showPercent label={`${a.score}/${a.maxScore}`} />
                    )}
                    <p className="text-xs text-gray-400 mt-2">{a.notes}</p>
                    <p className="text-xs text-gray-300 mt-1">{a.assessedAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workflow Tab */}
      {activeTab === 'workflow' && (
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="font-semibold mb-3">{t('recruiter:candidateDetail.timeline')}</h3>
            <div className="mb-4">
              <ProgressBar value={progress} label={`Stage ${stateIdx + 1} of ${STATE_ORDER.length}`} />
            </div>
            <div className="flex flex-col gap-0">
              {STATE_ORDER.map((state, i) => (
                <div key={state} className="flex items-start gap-3 relative pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${i <= stateIdx ? 'bg-[#004AAD] border-[#004AAD]' : 'bg-white border-gray-300'}`} />
                    {i < STATE_ORDER.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${i < stateIdx ? 'bg-[#004AAD]' : 'bg-gray-200'}`} style={{ minHeight: '24px' }} />}
                  </div>
                  <div className="-mt-0.5">
                    <span className="font-medium text-sm">{t(`workflow:states.${state}`)}</span>
                    {i === stateIdx && transition && (
                      <div className="mt-1 space-y-1">
                        {transition.conditions.map((cond) => (
                          <div key={cond} className="flex items-center gap-1 text-xs">
                            <span>○</span>
                            <span>{t(`workflow:conditions.${cond}`, cond)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer" disabled={stateIdx === 0}>{t('recruiter:candidateDetail.rollback')}</button>
              <button className="px-3 py-1.5 rounded-lg bg-[#004AAD] text-white text-xs font-medium hover:bg-[#003d8f] transition-colors cursor-pointer">{t('recruiter:candidateDetail.advance')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="p-6">
            <h3 className="font-semibold mb-3">{t('recruiter:candidateDetail.notes')}</h3>
            <div className="space-y-3 mb-4">
              {notes.map((note) => (
                <div key={note.id} className="p-3 bg-[#f5f5f5] rounded-lg">
                  <p className="text-sm">{note.text}</p>
                  <p className="text-xs text-gray-300 mt-1">{note.author} — {note.date}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD]"
                placeholder={t('recruiter:documents.addNote')}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button className="px-3 py-1.5 rounded-lg bg-[#004AAD] text-white text-xs font-medium hover:bg-[#003d8f] transition-colors cursor-pointer" onClick={handleAddNote}>{t('common:actions.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
