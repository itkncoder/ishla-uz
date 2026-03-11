import { create } from 'zustand'
import api from '@config/axios'
import { validateStoredUser, safeJsonParse, sanitizeString, isValidEmail } from '@shared/utils/sanitize'

function getInitialUser() {
  const raw = safeJsonParse(localStorage.getItem('auth-user'))
  return validateStoredUser(raw)
}

function getInitialToken() {
  const token = localStorage.getItem('auth-token')
  if (!token || typeof token !== 'string' || token.length < 10) {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
    return null
  }
  return token
}

const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isLoading: false,
  isAuthChecked: false,

  sendOtp: async (email) => {
    if (!isValidEmail(email)) {
      throw { response: { data: { message: 'Invalid email format' } } }
    }
    set({ isLoading: true })
    try {
      await api.post('/auth/send-otp', { email })
    } finally {
      set({ isLoading: false })
    }
  },

  login: async ({ email, otp }) => {
    if (!isValidEmail(email)) {
      throw { response: { data: { message: 'Invalid email format' } } }
    }
    if (typeof otp !== 'string' || otp.length < 5) {
      throw { response: { data: { message: 'Invalid OTP code.' } } }
    }

    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/login', {
        email: sanitizeString(email),
        otp,
      })

      const user = validateStoredUser(data.user)
      if (!user || !data.token) {
        throw { response: { data: { message: 'Invalid server response' } } }
      }

      localStorage.setItem('auth-token', data.token)
      localStorage.setItem('auth-user', JSON.stringify(user))
      set({ user, token: data.token, isLoading: false, isAuthChecked: true })
      return { user, token: data.token }
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  register: async ({ name, email, role, otp }) => {
    if (!isValidEmail(email)) {
      throw { response: { data: { message: 'Invalid email format' } } }
    }
    if (typeof otp !== 'string' || otp.length < 5) {
      throw { response: { data: { message: 'Invalid OTP code.' } } }
    }

    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/register', {
        name: sanitizeString(name),
        email: sanitizeString(email),
        role,
        otp,
      })

      const user = validateStoredUser(data.user)
      if (!user || !data.token) {
        throw { response: { data: { message: 'Invalid server response' } } }
      }

      localStorage.setItem('auth-token', data.token)
      localStorage.setItem('auth-user', JSON.stringify(user))
      set({ user, token: data.token, isLoading: false, isAuthChecked: true })
      return { user, token: data.token }
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  checkAuth: async () => {
    const token = get().token
    if (!token) {
      set({ user: null, isAuthChecked: true })
      return
    }

    try {
      const { data } = await api.get('/auth/me')
      const user = validateStoredUser(data.user)
      if (!user) {
        throw new Error('Invalid user data')
      }
      // Update stored user with server-verified data
      localStorage.setItem('auth-user', JSON.stringify(user))
      set({ user, isAuthChecked: true })
    } catch {
      // Token invalid/expired — clear everything
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      set({ user: null, token: null, isAuthChecked: true })
    }
  },

  googleLogin: async ({ access_token, role }) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/google', { accessToken: access_token, role })

      const user = validateStoredUser(data.user)
      if (!user || !data.token) {
        throw { response: { data: { message: 'Invalid server response' } } }
      }

      localStorage.setItem('auth-token', data.token)
      localStorage.setItem('auth-user', JSON.stringify(user))
      set({ user, token: data.token, isLoading: false, isAuthChecked: true })
      return { user, token: data.token }
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  completeProfile: async (profileData) => {
    set({ isLoading: true })
    try {
      const { data } = await api.put('/auth/complete-profile', profileData)

      const user = validateStoredUser(data.user)
      if (!user) {
        throw { response: { data: { message: 'Invalid server response' } } }
      }

      localStorage.setItem('auth-user', JSON.stringify(user))
      set({ user, isLoading: false })
      return { user }
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  // Demo helper — logs in as a predefined role via the real API
  loginAsRole: async (role) => {
    const DEMO_EMAILS = {
      candidate: 'candidate@ishla.uz',
      employer: 'employer@ishla.uz',
      recruiter: 'recruiter@ishla.uz',
      senior_manager: 'manager@ishla.uz',
      visa_officer: 'visa@ishla.uz',
      admin: 'admin@ishla.uz',
      agency: 'agency@ishla.uz',
    }
    const email = DEMO_EMAILS[role]
    if (!email) return
    return get().login({ email, otp: '12345' })
  },

  switchRole: async (activeRole) => {
    const current = get().user
    if (current?.activeRole === activeRole) return
    const token = get().token
    if (token) {
      try {
        const { data } = await api.patch('/auth/me', { activeRole })
        const user = validateStoredUser(data.user)
        if (user) {
          localStorage.setItem('auth-user', JSON.stringify(user))
          set({ user })
        }
      } catch {
        // fallback: update locally
      }
    }
    // Also update locally for non-authenticated users
    if (current) {
      const updated = { ...current, activeRole }
      localStorage.setItem('auth-user', JSON.stringify(updated))
      set({ user: updated })
    }
  },

  logout: () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
    set({ user: null, token: null, isAuthChecked: false })
  },
}))

export default useAuthStore
