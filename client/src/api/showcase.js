import api from '@/config/axios'

export const showcaseApi = {
  list: (params = {}) => api.get('/showcase', { params }).then((r) => r.data),
}
