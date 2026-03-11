import { Router } from 'express'
import multer from 'multer'
import { extname } from 'path'
import { unlink } from 'fs/promises'
import prisma from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateId } from '../middleware/validate.js'
import { uploadLimiter } from '../middleware/rateLimiter.js'

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp']
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]
const VALID_DOC_TYPES = ['passport', 'education', 'medical', 'photo', 'resume', 'contract']

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase()
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error('Invalid file type. Allowed: PDF, JPG, PNG, WebP'))
    }
    cb(null, true)
  },
})

const router = Router()

// GET /api/documents?candidateId=xxx
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { candidateId } = req.query
    const where = {}
    if (candidateId && typeof candidateId === 'string') where.candidateId = candidateId

    const documents = await prisma.document.findMany({ where, orderBy: { createdAt: 'desc' } })
    res.json(documents)
  } catch (err) {
    next(err)
  }
})

// GET /api/documents/:id
router.get('/:id', authenticate, validateId, async (req, res, next) => {
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } })
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' })
    }
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// POST /api/documents/upload
router.post('/upload',
  authenticate,
  uploadLimiter,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum 10MB' })
        }
        return res.status(400).json({ message: err.message })
      }
      if (err) {
        return res.status(400).json({ message: err.message })
      }
      next()
    })
  },
  async (req, res, next) => {
    try {
      const { candidateId, type } = req.body

      if (!candidateId || !type) {
        if (req.file) await unlink(req.file.path).catch(() => {})
        return res.status(400).json({ message: 'candidateId and type are required' })
      }

      if (!VALID_DOC_TYPES.includes(type)) {
        if (req.file) await unlink(req.file.path).catch(() => {})
        return res.status(400).json({ message: `Invalid document type. Allowed: ${VALID_DOC_TYPES.join(', ')}` })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const now = new Date().toISOString().split('T')[0]
      const slaDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const existing = await prisma.document.findFirst({ where: { candidateId, type } })
      let doc
      if (existing) {
        if (existing.filePath) await unlink(existing.filePath).catch(() => {})

        doc = await prisma.document.update({
          where: { id: existing.id },
          data: {
            fileName: req.file.originalname,
            filePath: req.file.path,
            status: 'uploaded',
            uploadedAt: now,
            reviewedAt: null,
            reviewedBy: null,
            reviewNote: null,
            slaDeadline,
          },
        })
      } else {
        doc = await prisma.document.create({
          data: {
            candidateId,
            type,
            fileName: req.file.originalname,
            filePath: req.file.path,
            status: 'uploaded',
            uploadedAt: now,
            slaDeadline,
          },
        })
      }

      res.status(201).json(doc)
    } catch (err) {
      if (req.file) await unlink(req.file.path).catch(() => {})
      next(err)
    }
  },
)

// PATCH /api/documents/:id/review
router.patch('/:id/review',
  authenticate,
  authorize('recruiter', 'senior_manager', 'admin'),
  validateId,
  async (req, res, next) => {
    try {
      const { status, reviewNote } = req.body
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Status must be approved or rejected' })
      }

      try {
        const doc = await prisma.document.update({
          where: { id: req.params.id },
          data: {
            status,
            reviewNote: typeof reviewNote === 'string' ? reviewNote.slice(0, 1000) : null,
            reviewedAt: new Date().toISOString().split('T')[0],
            reviewedBy: req.user.id,
          },
        })
        res.json(doc)
      } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Document not found' })
        throw err
      }
    } catch (err) {
      next(err)
    }
  },
)

export default router
