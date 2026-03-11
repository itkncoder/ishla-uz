import api from '@/config/axios'

export const employersApi = {
  getMyKyc: () => api.get('/employers/kyc/me').then((r) => r.data),
  submitKyc: (data) => api.put('/employers/kyc', data).then((r) => r.data),
  uploadKycDocument: (docType, file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('docType', docType)
    return api.post('/employers/kyc/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },
  // Admin/senior manager
  listAll: (params = {}) => api.get('/employers/kyc/all', { params }).then((r) => r.data),
  reviewKyc: (id, data) => api.patch(`/employers/kyc/${id}/review`, data).then((r) => r.data),
}
