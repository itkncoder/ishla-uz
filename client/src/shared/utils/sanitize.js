const VALID_ROLES = ['candidate', 'employer', 'recruiter', 'senior_manager', 'visa_officer', 'admin', 'agency']

/**
 * Validate that a user object from localStorage has the expected shape.
 * Returns null if invalid.
 */
export function validateStoredUser(data) {
  if (!data || typeof data !== 'object') return null
  if (typeof data.id !== 'string' || !data.id) return null
  if (typeof data.name !== 'string' || !data.name) return null
  if (typeof data.email !== 'string' || !data.email.includes('@')) return null
  if (!VALID_ROLES.includes(data.role)) return null

  // Return only expected fields — strip anything extra
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: typeof data.avatar === 'string' ? data.avatar : null,
    profileCompleted: !!data.profileCompleted,
    activeRole: ['candidate', 'employer'].includes(data.activeRole) ? data.activeRole : 'candidate',
  }
}

/**
 * Safely parse JSON from localStorage. Returns null on failure.
 */
export function safeJsonParse(str) {
  if (!str || typeof str !== 'string') return null
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

/**
 * Sanitize a string input — trim and strip HTML tags.
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return ''
  return str.trim().replace(/<[^>]*>/g, '')
}

/**
 * Validate email format.
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate file before upload.
 */
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateFile(file) {
  if (!file) return 'No file selected'

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Invalid file type. Allowed: PDF, JPG, PNG, WebP'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File too large. Maximum 10MB'
  }

  // Check extension matches MIME
  const ext = file.name.toLowerCase().split('.').pop()
  const validExts = ['pdf', 'jpg', 'jpeg', 'png', 'webp']
  if (!validExts.includes(ext)) {
    return 'Invalid file extension'
  }

  return null // valid
}
