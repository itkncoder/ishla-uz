import api from '@/config/axios'

export const assessmentsApi = {
  list: (params = {}) => api.get('/assessments', { params }).then((r) => r.data),
  create: (data) => api.post('/assessments', data).then((r) => r.data),
  update: (id, data) => api.put(`/assessments/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/assessments/${id}`).then((r) => r.data),
}
