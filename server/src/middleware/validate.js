import { unlink } from 'fs/promises'

// Validate that :id param is a valid UUID
export function validateId(req, res, next) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuid.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }
  next()
}

// Sanitize pagination params
export function sanitizePagination(req, res, next) {
  const page = Math.max(1, Math.floor(Number(req.query.page)) || 1)
  const limit = Math.min(100, Math.max(1, Math.floor(Number(req.query.limit)) || 20))
  req.pagination = { page, limit, skip: (page - 1) * limit }
  next()
}

// Strip dangerous fields from req.body
export function stripFields(...fields) {
  return (req, res, next) => {
    for (const field of fields) {
      delete req.body[field]
    }
    next()
  }
}

// Validate required fields
export function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => req.body[f] == null || req.body[f] === '')
    if (missing.length) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(', ')}`,
      })
    }
    next()
  }
}

// Validate allowed file types for upload
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp']

export function validateFileType(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  const ext = req.file.originalname.toLowerCase().slice(req.file.originalname.lastIndexOf('.'))
  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    unlink(req.file.path).catch(() => {})
    return res.status(400).json({
      message: 'Invalid file type. Allowed: PDF, JPG, PNG, WebP',
    })
  }

  next()
}
