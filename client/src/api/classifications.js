import api from '@/config/axios'

export const classificationsApi = {
  getAll: () => api.get('/classifications').then((r) => r.data),
  getIndustries: () => api.get('/classifications/industries').then((r) => r.data),
  getSpecializations: (industry) => api.get('/classifications/specializations', { params: { industry } }).then((r) => r.data),
  getSkills: () => api.get('/classifications/skills').then((r) => r.data),
  getLanguages: () => api.get('/classifications/languages').then((r) => r.data),
  getCountries: () => api.get('/classifications/countries').then((r) => r.data),
  getRegions: () => api.get('/classifications/regions').then((r) => r.data),
}
