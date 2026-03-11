import { create } from 'zustand'
import { classificationsApi } from '@/api/classifications'

const useClassificationsStore = create((set, get) => ({
  industries: [],
  specializations: {},
  skills: [],
  languages: [],
  languageLevels: [],
  countries: [],
  regions: [],
  loaded: false,
  loading: false,

  fetch: async () => {
    if (get().loaded || get().loading) return
    set({ loading: true })
    try {
      const data = await classificationsApi.getAll()
      set({
        industries: data.industries || [],
        specializations: data.specializations || {},
        skills: data.skills || [],
        languages: data.languages || [],
        languageLevels: data.languageLevels || [],
        countries: data.countries || [],
        regions: data.regions || [],
        loaded: true,
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },
}))

export default useClassificationsStore
