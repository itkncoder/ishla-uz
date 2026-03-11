import { create } from 'zustand'
import { showcaseApi } from '@/api/showcase'

const useShowcaseStore = create((set, get) => ({
  candidates: [],
  shortlisted: [],
  confirmed: [],
  loading: false,

  fetch: async (filters = {}) => {
    set({ loading: true })
    try {
      const data = await showcaseApi.list(filters)
      set({ candidates: Array.isArray(data) ? data : data.data || [], loading: false })
    } catch {
      set({ loading: false })
    }
  },

  getShowcaseCandidates: (filters = {}) => {
    let candidates = get().candidates
    if (filters.industry) {
      candidates = candidates.filter((c) => c.industry === filters.industry)
    }
    if (filters.minExperience) {
      candidates = candidates.filter((c) => c.experienceYears >= filters.minExperience)
    }
    if (filters.skills?.length) {
      candidates = candidates.filter((c) =>
        filters.skills.some((s) => c.skills?.includes(s))
      )
    }
    if (filters.gender) {
      candidates = candidates.filter((c) => c.gender === filters.gender)
    }
    return candidates
  },

  shortlist: (candidateId) => {
    set((state) => {
      if (state.shortlisted.includes(candidateId)) return state
      return { shortlisted: [...state.shortlisted, candidateId] }
    })
  },

  removeFromShortlist: (candidateId) => {
    set((state) => ({
      shortlisted: state.shortlisted.filter((id) => id !== candidateId),
    }))
  },

  confirm: (candidateId) => {
    set((state) => {
      if (state.confirmed.includes(candidateId)) return state
      return {
        confirmed: [...state.confirmed, candidateId],
        shortlisted: state.shortlisted.filter((id) => id !== candidateId),
      }
    })
  },

  isShortlisted: (candidateId) => get().shortlisted.includes(candidateId),
  isConfirmed: (candidateId) => get().confirmed.includes(candidateId),
}))

export default useShowcaseStore
