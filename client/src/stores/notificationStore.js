import { create } from 'zustand'

let notificationId = 0

const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: ({ type, message, duration = 5000 }) => {
    const id = ++notificationId
    set((state) => ({
      notifications: [...state.notifications, { id, type, message, duration }],
    }))
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      }, duration)
    }
    return id
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}))

export default useNotificationStore
