import api from '@/config/axios'

export const adminApi = {
  getStats: () => api.get('/admin/stats').then((r) => r.data),
  getUsers: (params = {}) => api.get('/admin/users', { params }).then((r) => r.data),
  createUser: (data) => api.post('/admin/users', data).then((r) => r.data),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
}
