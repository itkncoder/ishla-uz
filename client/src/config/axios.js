import axios from 'axios'
import { API_BASE_URL } from './constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Retry on network errors / timeouts (Render cold start)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    if (
      !config._retryCount &&
      (!error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED' || error.code === 'ERR_NETWORK')
    ) {
      config._retryCount = 1
      return api(config)
    }

    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      window.location.href = '/'
    }

    if (status === 403) {
      const message = error.response?.data?.message || ''
      // Account deactivated — force logout
      if (message.includes('deactivated')) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-user')
        window.location.href = '/'
      }
    }

    // Sanitize error message — never expose raw server internals to UI
    if (error.response?.data?.message) {
      error.response.data.message = sanitizeErrorMessage(error.response.data.message)
    }

    return Promise.reject(error)
  },
)

function sanitizeErrorMessage(msg) {
  if (typeof msg !== 'string') return 'An error occurred'
  // Strip potential HTML/script tags
  return msg.replace(/<[^>]*>/g, '').slice(0, 500)
}

export default api
