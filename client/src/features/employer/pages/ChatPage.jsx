import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { applicationsApi } from '@/api/applications'
import useAuthStore from '@stores/authStore'

const DEFAULT_CONTACTS = []

const INITIAL_MESSAGES = {}

function ProfileCard({ profile, t }) {
  if (!profile) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-xs lg:max-w-sm shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#004AAD] text-white flex items-center justify-center text-sm font-bold">
          {(profile.name || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{profile.name || '—'}</p>
          <p className="text-xs text-gray-400">{profile.phone || profile.email || ''}</p>
        </div>
      </div>
      <div className="space-y-1.5 text-xs text-gray-600">
        {profile.gender && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t('chat.profileGender', 'Gender')}</span>
            <span className="font-medium capitalize">{profile.gender}</span>
          </div>
        )}
        {profile.dob && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t('chat.profileDob', 'Birth Year')}</span>
            <span className="font-medium">{profile.dob}</span>
          </div>
        )}
        {profile.region && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t('chat.profileRegion', 'Region')}</span>
            <span className="font-medium">{profile.region}</span>
          </div>
        )}
        {profile.industry && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t('chat.profileIndustry', 'Industry')}</span>
            <span className="font-medium">{profile.industry}</span>
          </div>
        )}
        {profile.specialization && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t('chat.profileSpecialization', 'Specialization')}</span>
            <span className="font-medium">{profile.specialization}</span>
          </div>
        )}
        {profile.languages?.length > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">{t('chat.profileLanguages', 'Languages')}</span>
            <span className="font-medium">{profile.languages.map((l) => l.id || l).join(', ')}</span>
          </div>
        )}
        {profile.workExperience?.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-400 mb-1">{t('chat.profileExperience', 'Experience')}</p>
            {profile.workExperience.map((w, i) => (
              <p key={i} className="font-medium">{w.position} — {w.company} ({w.years} {t('chat.profileYears', 'yrs')})</p>
            ))}
          </div>
        )}
        {profile.education?.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-400 mb-1">{t('chat.profileEducation', 'Education')}</p>
            {profile.education.map((e, i) => (
              <p key={i} className="font-medium">{e.degree} — {e.institution}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EmployerChatPage() {
  const { t } = useTranslation('employer')
  const messagesEndRef = useRef(null)
  const user = useAuthStore((s) => s.user)

  const [contacts, setContacts] = useState(DEFAULT_CONTACTS)
  const [activeContact, setActiveContact] = useState(null)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [mobileShowChat, setMobileShowChat] = useState(false)

  const addApplication = (app) => {
    const { candidate, jobTitle } = app
    if (!candidate) return

    const contactId = `candidate_${candidate.id || candidate.name?.replace(/\s/g, '_') || app.timestamp}`
    const time = app.timestamp
      ? new Date(app.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setContacts((prev) => {
      if (prev.some((c) => c.id === contactId)) return prev
      return [...prev, { id: contactId, name: candidate.name || 'Candidate', avatar: '👤', online: true }]
    })

    setMessages((prev) => {
      if (prev[contactId]) return prev
      return {
        ...prev,
        [contactId]: [
          {
            id: (app.timestamp || Date.now()),
            from: 'them',
            text: `📋 ${t('chat.candidateApplied', { position: jobTitle, defaultValue: 'Applied for "{{position}}"' })}`,
            time,
          },
          {
            id: (app.timestamp || Date.now()) + 1,
            from: 'them',
            type: 'profile',
            profile: candidate,
            time,
          },
        ],
      }
    })

    return contactId
  }

  // Load applications from API on mount
  useEffect(() => {
    applicationsApi.list({ employerId: user?.employerId || user?.id })
      .then((apps) => {
        if (!Array.isArray(apps) || apps.length === 0) return

        let lastContactId = null
        apps.forEach((app) => {
          lastContactId = addApplication({
            candidate: app.candidateProfile,
            jobTitle: app.jobTitle,
            timestamp: new Date(app.createdAt).getTime(),
          })
        })

        if (lastContactId) {
          setActiveContact(lastContactId)
        }
      })
      .catch(() => {})
  }, [])

  // Listen for real-time applications via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('ishla_applications')
    const handler = (e) => {
      const contactId = addApplication(e.data)
      if (contactId) {
        setActiveContact(contactId)
        setMobileShowChat(true)
      }
    }

    channel.addEventListener('message', handler)
    return () => { channel.close() }
  }, [t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeContact])

  const currentMessages = messages[activeContact] || []
  const currentContact = contacts.find((c) => c.id === activeContact)

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), newMsg],
    }))
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('chat.title', 'Chat')}</h1>
      <p className="text-gray-500 mb-6">{t('chat.subtitle', 'Communicate with candidates and support')}</p>

      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Contact list */}
          <div className={`w-full md:w-1/4 border-r border-gray-100 flex flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">{t('chat.contacts', 'Contacts')}</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                    activeContact === contact.id ? 'bg-[#e8f0fe]/50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveContact(contact.id)
                    setMobileShowChat(true)
                  }}
                >
                  <div className="text-2xl">{contact.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{contact.name}</p>
                    <p className="text-xs text-gray-400">
                      {contact.online ? t('chat.online', 'Online') : t('chat.offline', 'Offline')}
                    </p>
                  </div>
                  {contact.online && <span className="w-2 h-2 rounded-full bg-[#004AAD]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            {!currentContact ? (
              <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">
                {contacts.length === 0
                  ? t('chat.noContacts', 'No conversations yet. Candidates will appear here when they apply.')
                  : t('chat.selectContact', 'Select a conversation')}
              </div>
            ) : (
            <>
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <button
                className="md:hidden text-gray-400 hover:text-gray-700 cursor-pointer"
                onClick={() => setMobileShowChat(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div className="text-2xl">{currentContact.avatar}</div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{currentContact.name}</p>
                <p className="text-xs text-[#004AAD]">{t('chat.online', 'Online')}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div>
                    {msg.type === 'profile' ? (
                      <ProfileCard profile={msg.profile} t={t} />
                    ) : (
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        msg.from === 'me'
                          ? 'bg-[#004AAD] text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-700 rounded-bl-md'
                      }`}>
                        {msg.text}
                      </div>
                    )}
                    <p className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-right' : 'text-left'} text-gray-400`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 h-9 rounded-lg border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 focus:bg-white"
                  placeholder={t('chat.placeholder', 'Type a message...')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="px-3 py-1.5 rounded-lg bg-[#004AAD] text-white hover:bg-[#003275] transition-colors cursor-pointer"
                  onClick={handleSend}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
