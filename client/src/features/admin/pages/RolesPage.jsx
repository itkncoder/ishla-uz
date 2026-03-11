import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import { ROLES } from '@config/roles'

const ROLE_PERMISSIONS = {
  candidate: ['view_own_profile', 'edit_own_profile', 'upload_documents', 'view_contract', 'view_timeline'],
  employer: ['view_dashboard', 'manage_kyc', 'manage_job_orders', 'view_showcase', 'confirm_candidates'],
  recruiter: ['view_dashboard', 'manage_candidates', 'conduct_assessments', 'review_documents', 'register_candidates'],
  senior_manager: ['view_dashboard', 'approve_actions', 'view_reports', 'view_audit_log', 'override_workflow'],
  visa_officer: ['view_dashboard', 'manage_visa_forms', 'batch_monitoring', 'approve_visas'],
  admin: ['full_access', 'manage_users', 'manage_config', 'manage_roles', 'manage_sla'],
}

const ROLE_COLORS = {
  candidate: 'bg-blue-50 text-blue-600',
  employer: 'bg-green-50 text-green-700',
  recruiter: 'bg-amber-50 text-amber-700',
  senior_manager: 'bg-gray-100 text-gray-700',
  visa_officer: 'bg-purple-50 text-purple-600',
  admin: 'bg-red-50 text-red-600',
}

export default function RolesPage() {
  const { t } = useTranslation('admin')

  return (
    <div>
      <PageHeader title={t('roles.title')} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(ROLES).map((role) => (
          <div key={role} className="rounded-2xl border border-gray-100 bg-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold capitalize">
                  {t(`common:roles.${role === 'senior_manager' ? 'seniorManager' : role === 'visa_officer' ? 'visaOfficer' : role}`, role)}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role]}`}>{role}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">{t('roles.permissions')}:</p>
                <div className="flex flex-wrap gap-1">
                  {(ROLE_PERMISSIONS[role] || []).map((perm) => (
                    <span key={perm} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-gray-200 text-gray-600">{perm.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button className="px-2 py-1 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">{t('roles.editRole')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
