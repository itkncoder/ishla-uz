import { create } from 'zustand'
import { jobOrdersApi } from '@/api/jobOrders'

const useJobOrderStore = create((set, get) => ({
  jobOrders: [],
  loading: false,
  loaded: false,

  fetch: async (params = {}) => {
    set({ loading: true })
    try {
      const data = await jobOrdersApi.list(params)
      set({ jobOrders: Array.isArray(data) ? data : data.jobOrders || data.data || [], loaded: true, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  getById: (id) => get().jobOrders.find((jo) => jo.id === id) || null,

  getByStatus: (status) => {
    if (!status || status === 'all') return get().jobOrders
    return get().jobOrders.filter((jo) => jo.status === status)
  },

  getByEmployer: (employerId) => get().jobOrders.filter((jo) => jo.employer?.id === employerId),

  getByRecruiter: (recruiterId) => get().jobOrders.filter((jo) => jo.recruiterId === recruiterId),

  create: async (data) => {
    const newOrder = await jobOrdersApi.create(data)
    set((state) => ({ jobOrders: [...state.jobOrders, newOrder] }))
    return newOrder
  },

  update: async (id, data) => {
    const updated = await jobOrdersApi.update(id, data)
    set((state) => ({
      jobOrders: state.jobOrders.map((jo) => (jo.id === id ? updated : jo)),
    }))
  },

  updateStatus: async (id, status) => {
    const updated = await jobOrdersApi.updateStatus(id, status)
    set((state) => ({
      jobOrders: state.jobOrders.map((jo) => (jo.id === id ? updated : jo)),
    }))
  },

  remove: async (id) => {
    await jobOrdersApi.remove(id)
    set((state) => ({
      jobOrders: state.jobOrders.filter((jo) => jo.id !== id),
    }))
  },
}))

export default useJobOrderStore
