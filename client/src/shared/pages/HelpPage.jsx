import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

export default function HelpPage() {
  const { t } = useTranslation('common')
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.subject.trim() || !form.message.trim()) return
    setSubmitted(true)
    setForm({ subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="max-w-[840px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('help.title')}</h1>
      <p className="text-gray-500 text-sm mb-8">{t('help.subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left: FAQ ── */}
        <div className="lg:col-span-3">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#004AAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            {t('help.faqTitle')}
          </h2>
          <div className="space-y-2">
            {FAQ_KEYS.map((key) => {
              const isOpen = openFaq === key
              return (
                <div key={key} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : key)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer group"
                  >
                    <span className="text-sm font-medium text-gray-900 group-hover:text-[#003275] transition-colors pr-4">
                      {t(`help.faq.${key}.question`)}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {t(`help.faq.${key}.answer`)}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right: Contact + Report ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contacts */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#004AAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {t('help.contactsTitle')}
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: t('help.email'),
                  value: 'info@ishla.uz',
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
                },
                {
                  label: t('help.phone'),
                  value: '+998 71 200 00 00',
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
                },
                {
                  label: 'Telegram',
                  value: '@ishla_uz',
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>,
                },
                {
                  label: t('help.address'),
                  value: t('help.addressValue'),
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center text-[#004AAD] shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report a Problem */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#004AAD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {t('help.reportTitle')}
            </h2>

            {submitted ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#e8f0fe] border border-[#a8c7f5]">
                <svg className="w-5 h-5 text-[#004AAD] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-[#003275] font-medium">{t('help.reportSent')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">{t('help.reportSubject')}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder={t('help.reportSubjectPlaceholder')}
                    required
                    className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">{t('help.reportMessage')}</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t('help.reportMessagePlaceholder')}
                    required
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 focus:bg-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003275] hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                >
                  {t('help.reportSend')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
