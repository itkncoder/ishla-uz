import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '@shared/components/PageHeader'
import DataTable from '@shared/components/ui/DataTable'
import StatusBadge from '@shared/components/StatusBadge'
import Modal from '@shared/components/ui/Modal'
import FormInput from '@shared/components/ui/FormInput'
import FormSelect from '@shared/components/ui/FormSelect'
import { adminApi } from '@/api/admin'

export default function UsersPage() {
  const { t } = useTranslation('admin')
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const fetchUsers = useCallback(() => {
    setLoading(true)
    const params = {}
    if (roleFilter) params.role = roleFilter
    adminApi.getUsers(params)
      .then((data) => {
        setUsers(data.users || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [roleFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleToggle = async (id) => {
    try {
      const updated = await adminApi.toggleUser(id)
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: updated.isActive } : u))
    } catch {
      // ignore
    }
  }

  const handleCreate = async () => {
    setError('')
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.role) {
      setError(t('users.fillAllFields', 'Please fill all fields'))
      return
    }
    setCreating(true)
    try {
      await adminApi.createUser(newUser)
      setShowModal(false)
      setNewUser({ name: '', email: '', role: '' })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || t('users.errorCreating'))
    } finally {
      setCreating(false)
    }
  }

  const columns = [
    { header: t('users.username'), accessor: 'name', sortable: true },
    { header: t('users.email'), accessor: 'email', sortable: true },
    {
      header: t('users.role'),
      accessor: 'role',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-700 capitalize">
          {t(`common:roles.${row.role === 'senior_manager' ? 'seniorManager' : row.role === 'visa_officer' ? 'visaOfficer' : row.role}`, row.role)}
        </span>
      ),
    },
    {
      header: t('users.status'),
      accessor: 'isActive',
      render: (row) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} />,
    },
    {
      header: t('users.createdAt', 'Created'),
      accessor: 'createdAt',
      sortable: true,
      render: (row) => <span className="text-sm text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: '',
      render: (row) => (
        <div className="flex gap-1">
          {row.isActive ? (
            <button className="px-2 py-1 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); handleToggle(row.id) }}>{t('users.deactivateUser')}</button>
          ) : (
            <button className="px-2 py-1 rounded-lg text-xs text-green-600 hover:bg-green-50 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); handleToggle(row.id) }}>{t('users.activateUser')}</button>
          )}
        </div>
      ),
    },
  ]

  const activeCount = users.filter((u) => u.isActive).length

  return (
    <div>
      <PageHeader title={t('users.title')} />

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">{total} {t('users.usersCount', 'users')}</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">{activeCount} {t('users.activeCount', 'active')}</span>
          <select
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 bg-white cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">{t('users.allRoles', 'All Roles')}</option>
            {['candidate', 'employer', 'recruiter', 'senior_manager', 'visa_officer', 'admin', 'agency'].map((r) => (
              <option key={r} value={r}>{t(`common:roles.${r === 'senior_manager' ? 'seniorManager' : r === 'visa_officer' ? 'visaOfficer' : r}`, r)}</option>
            ))}
          </select>
        </div>
        <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#004AAD] text-white hover:bg-[#003d8f] transition-colors cursor-pointer" onClick={() => setShowModal(true)}>+ {t('users.addUser')}</button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-[#004AAD]" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              searchable
              searchPlaceholder={t('common:actions.search')}
              pageSize={10}
            />
          )}
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setError('') }}
        title={t('users.addUser')}
        actions={
          <>
            <button className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => { setShowModal(false); setError('') }}>{t('common:actions.cancel')}</button>
            <button
              className="px-4 py-2 rounded-lg bg-[#004AAD] text-white text-sm font-medium hover:bg-[#003d8f] transition-colors cursor-pointer disabled:opacity-50"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? '...' : t('common:actions.save')}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <FormInput label={t('users.username')} name="name" value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} required />
          <FormInput label={t('users.email')} name="email" type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} required />
          <FormSelect
            label={t('users.role')}
            name="role"
            value={newUser.role}
            onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}
            options={[
              { value: 'candidate', label: t('common:roles.candidate') },
              { value: 'employer', label: t('common:roles.employer') },
              { value: 'recruiter', label: t('common:roles.recruiter') },
              { value: 'senior_manager', label: t('common:roles.seniorManager') },
              { value: 'visa_officer', label: t('common:roles.visaOfficer') },
              { value: 'admin', label: t('common:roles.admin') },
              { value: 'agency', label: t('common:roles.agency', 'Agency') },
            ]}
            placeholder={t('users.selectRole', 'Select role')}
            required
          />
        </div>
      </Modal>
    </div>
  )
}
