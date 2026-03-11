import api from '@/config/axios'

export const jobOrdersApi = {
  list: (params = {}) => api.get('/job-orders', { params }).then((r) => r.data),
  getById: (id) => api.get(`/job-orders/${id}`).then((r) => r.data),
  create: (data) => api.post('/job-orders', data).then((r) => r.data),
  update: (id, data) => api.put(`/job-orders/${id}`, data).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/job-orders/${id}/status`, { status }).then((r) => r.data),
  remove: (id) => api.delete(`/job-orders/${id}`).then((r) => r.data),
}
