import { create } from 'zustand'
import { candidatesApi } from '@/api/candidates'
import { documentsApi } from '@/api/documents'

const useCandidateProfileStore = create((set, get) => ({
  profile: null,
  documents: [],
  loading: false,
  loaded: false,

  fetch: async (candidateId) => {
    if (get().loading) return
    set({ loading: true })
    try {
      const [profile, docs] = await Promise.all([
        candidatesApi.getById(candidateId),
        documentsApi.list({ candidateId }),
      ])
      set({
        profile,
        documents: Array.isArray(docs) ? docs : docs.data || [],
        loaded: true,
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },

  fetchMe: async () => {
    if (get().loading || get().loaded) return
    set({ loading: true })
    try {
      const profile = await candidatesApi.getMe()
      const docs = await documentsApi.list({ candidateId: profile.id }).catch(() => [])
      set({
        profile,
        documents: Array.isArray(docs) ? docs : docs.data || [],
        loaded: true,
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },

  updateField: (field, value) => {
    const profile = get().profile
    if (!profile) return
    set({ profile: { ...profile, [field]: value } })
    candidatesApi.updateProfile(profile.id, { [field]: value }).catch(() => {})
  },

  addEducation: async (edu) => {
    const profile = get().profile
    if (!profile) return
    const education = [...(profile.education || []), { ...edu, id: Date.now() }]
    set({ profile: { ...profile, education } })
    candidatesApi.updateProfile(profile.id, { education }).catch(() => {})
  },

  removeEducation: async (index) => {
    const profile = get().profile
    if (!profile) return
    const education = profile.education.filter((_, i) => i !== index)
    set({ profile: { ...profile, education } })
    candidatesApi.updateProfile(profile.id, { education }).catch(() => {})
  },

  addWorkExperience: async (exp) => {
    const profile = get().profile
    if (!profile) return
    const workExperience = [...(profile.workExperience || []), { ...exp, id: Date.now() }]
    set({ profile: { ...profile, workExperience } })
    candidatesApi.updateProfile(profile.id, { workExperience }).catch(() => {})
  },

  removeWorkExperience: async (index) => {
    const profile = get().profile
    if (!profile) return
    const workExperience = profile.workExperience.filter((_, i) => i !== index)
    set({ profile: { ...profile, workExperience } })
    candidatesApi.updateProfile(profile.id, { workExperience }).catch(() => {})
  },

  addLanguage: async (lang) => {
    const profile = get().profile
    if (!profile) return
    const languages = [...(profile.languages || []), lang]
    set({ profile: { ...profile, languages } })
    candidatesApi.updateProfile(profile.id, { languages }).catch(() => {})
  },

  removeLanguage: async (index) => {
    const profile = get().profile
    if (!profile) return
    const languages = profile.languages.filter((_, i) => i !== index)
    set({ profile: { ...profile, languages } })
    candidatesApi.updateProfile(profile.id, { languages }).catch(() => {})
  },

  uploadDocument: async (type, file) => {
    const profile = get().profile
    if (!profile) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('candidateId', profile.id)
    const doc = await documentsApi.upload(formData)
    set((state) => {
      const docs = [...state.documents]
      const idx = docs.findIndex((d) => d.type === type)
      if (idx >= 0) {
        docs[idx] = doc
      } else {
        docs.push(doc)
      }
      return { documents: docs }
    })
  },

  getProfileCompleteness: () => {
    const p = get().profile
    if (!p) return 0
    let filled = 0
    const total = 9
    if (p.name) filled++
    if (p.dob) filled++
    if (p.gender) filled++
    if (p.phone) filled++
    if (p.region) filled++
    if (p.industry) filled++
    if (p.specialization) filled++
    if (p.workExperience?.length > 0) filled++
    if (p.languages?.length > 0) filled++
    return Math.round((filled / total) * 100)
  },
}))

export default useCandidateProfileStore
