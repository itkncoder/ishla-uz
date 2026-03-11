import { create } from 'zustand'
import i18next from 'i18next'

const useUiStore = create((set) => ({
  sidebarOpen: true,
  theme: 'light',
  language: localStorage.getItem('i18nextLng') || 'ru',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setTheme: (theme) => set({ theme }),

  setLanguage: (language) => {
    i18next.changeLanguage(language)
    localStorage.setItem('i18nextLng', language)
    set({ language })
  },

}))

export default useUiStore
