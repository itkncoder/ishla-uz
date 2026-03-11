import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import FormInput from '@shared/components/ui/FormInput'
import FormSelect from '@shared/components/ui/FormSelect'

const INITIAL_CONFIG = {
  platformName: 'ISHLA.UZ',
  defaultLanguage: 'ru',
  emailNotifications: true,
  smsNotifications: false,
  maxFileSize: '10',
  sessionTimeout: '60',
  maintenanceMode: false,
}

export default function ConfigPage() {
  const { t } = useTranslation('admin')
  const [config, setConfig] = useState(INITIAL_CONFIG)
  const [saved, setSaved] = useState(false)

  const handleChange = (field) => (e) => {
    setConfig((prev) => ({ ...prev, [field]: e.target.value }))
    setSaved(false)
  }

  const handleToggle = (field) => () => {
    setConfig((prev) => ({ ...prev, [field]: !prev[field] }))
    setSaved(false)
  }

  const handleSave = () => setSaved(true)

  return (
    <div>
      <PageHeader title={t('config.title')} />

      {saved && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 text-sm">
          <span>{t('config.saved', 'Configuration saved successfully.')}</span>
        </div>
      )}

      {/* General Settings */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6">
        <div className="p-6">
          <h3 className="font-semibold mb-4">{t('config.general')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label={t('config.platformName', 'Platform Name')} name="platformName" value={config.platformName} onChange={handleChange('platformName')} />
            <FormSelect
              label={t('config.defaultLanguage', 'Default Language')}
              name="defaultLanguage"
              value={config.defaultLanguage}
              onChange={handleChange('defaultLanguage')}
              options={[
                { value: 'uz', label: t('config.langUzbek') },
                { value: 'ru', label: t('config.langRussian') },
                { value: 'en', label: t('config.langEnglish') },
              ]}
            />
            <FormInput label={t('config.maxFileSize', 'Max File Size (MB)')} name="maxFileSize" type="number" value={config.maxFileSize} onChange={handleChange('maxFileSize')} />
            <FormInput label={t('config.sessionTimeout', 'Session Timeout (min)')} name="sessionTimeout" type="number" value={config.sessionTimeout} onChange={handleChange('sessionTimeout')} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-gray-100 bg-white mb-6">
        <div className="p-6">
          <h3 className="font-semibold mb-4">{t('config.notifications')}</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center cursor-pointer gap-4">
                <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-gray-300 checked:bg-[#004AAD] transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-5" checked={config.emailNotifications} onChange={handleToggle('emailNotifications')} />
                <span className="text-sm text-gray-700">{t('config.emailNotifications', 'Email Notifications')}</span>
              </label>
            </div>
            <div>
              <label className="flex items-center cursor-pointer gap-4">
                <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-gray-300 checked:bg-[#004AAD] transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-5" checked={config.smsNotifications} onChange={handleToggle('smsNotifications')} />
                <span className="text-sm text-gray-700">{t('config.smsNotifications', 'SMS Notifications')}</span>
              </label>
            </div>
            <div>
              <label className="flex items-center cursor-pointer gap-4">
                <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-gray-300 checked:bg-amber-500 transition-colors cursor-pointer relative before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-5" checked={config.maintenanceMode} onChange={handleToggle('maintenanceMode')} />
                <span className="text-sm text-gray-700">{t('config.maintenanceMode', 'Maintenance Mode')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors cursor-pointer" onClick={handleSave}>{t('config.saveConfig')}</button>
      </div>
    </div>
  )
}
