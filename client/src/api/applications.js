import api from '@/config/axios'

export const applicationsApi = {
  list: (params = {}) => api.get('/applications', { params }).then((r) => r.data),
  create: (data) => api.post('/applications', data).then((r) => r.data),
}
