import api from '@/config/axios'

export const documentsApi = {
  list: (params = {}) => api.get('/documents', { params }).then((r) => r.data),
  getById: (id) => api.get(`/documents/${id}`).then((r) => r.data),
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data),
  review: (id, data) => api.patch(`/documents/${id}/review`, data).then((r) => r.data),
}
