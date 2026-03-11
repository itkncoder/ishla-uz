import api from '@/config/axios'

export const candidatesApi = {
  list: (params = {}) => api.get('/candidates', { params }).then((r) => r.data),
  getMe: () => api.get('/candidates/me').then((r) => r.data),
  getById: (id) => api.get(`/candidates/${id}`).then((r) => r.data),
  create: (data) => api.post('/candidates', data).then((r) => r.data),
  update: (id, data) => api.put(`/candidates/${id}`, data).then((r) => r.data),
  updateProfile: (id, data) => api.patch(`/candidates/${id}/profile`, data).then((r) => r.data),
  transition: (id, data) => api.post(`/candidates/${id}/transition`, data).then((r) => r.data),
  rollback: (id, data) => api.post(`/candidates/${id}/rollback`, data).then((r) => r.data),
  remove: (id) => api.delete(`/candidates/${id}`).then((r) => r.data),
}
