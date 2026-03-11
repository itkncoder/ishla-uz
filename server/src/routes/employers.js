import { Router } from 'express'
import multer from 'multer'
import { extname } from 'path'
import prisma from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { sendKycNotification } from '../lib/telegram.js'

const router = Router()

const KYC_EDITABLE_FIELDS = [
  'companyName', 'registrationNumber', 'country', 'city', 'address',
  'industry', 'website', 'contactName', 'contactPosition', 'contactPhone', 'contactEmail',
]

function pickFields(obj, fields) {
  const result = {}
  for (const f of fields) {
    if (obj[f] !== undefined) result[f] = obj[f]
  }
  return result
}

// Multer for KYC documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'kyc-' + unique + extname(file.originalname))
  },
})

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp']
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'))
    }
    cb(null, true)
  },
})

// GET /api/employers/kyc/me — get current employer's KYC
router.get('/kyc/me', authenticate, async (req, res, next) => {
  try {
    let employer = await prisma.employer.findUnique({ where: { userId: req.user.id } })
    if (!employer) {
      employer = await prisma.employer.create({
        data: {
          userId: req.user.id,
          contactName: req.user.name,
          contactEmail: req.user.email,
        },
      })
    }
    res.json(employer)
  } catch (err) {
    next(err)
  }
})

// PUT /api/employers/kyc — submit/update KYC
router.put('/kyc', authenticate, async (req, res, next) => {
  try {
    let employer = await prisma.employer.findUnique({ where: { userId: req.user.id } })

    if (employer && (employer.kycStatus === 'under_review' || employer.kycStatus === 'verified')) {
      return res.status(400).json({ message: 'Cannot update KYC while under review or already verified' })
    }

    const data = pickFields(req.body, KYC_EDITABLE_FIELDS)
    data.kycStatus = 'submitted'

    if (!employer) {
      employer = await prisma.employer.create({
        data: { userId: req.user.id, ...data },
      })
    } else {
      employer = await prisma.employer.update({
        where: { userId: req.user.id },
        data,
      })
    }

    // Send Telegram notification (non-blocking)
    sendKycNotification(employer).catch(() => {})

    res.json(employer)
  } catch (err) {
    next(err)
  }
})

// POST /api/employers/kyc/documents — upload KYC document (businessLicense or registrationCert)
router.post('/kyc/documents',
  authenticate,
  upload.single('file'),
  async (req, res, next) => {
    try {
      const { docType } = req.body
      if (!['businessLicense', 'registrationCert'].includes(docType)) {
        return res.status(400).json({ message: 'Invalid document type' })
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const field = docType === 'businessLicense' ? 'businessLicensePath' : 'registrationCertPath'
      const filePath = req.file.path.replace(/\\/g, '/')

      let employer = await prisma.employer.findUnique({ where: { userId: req.user.id } })
      if (!employer) {
        employer = await prisma.employer.create({
          data: { userId: req.user.id, [field]: filePath },
        })
      } else {
        employer = await prisma.employer.update({
          where: { userId: req.user.id },
          data: { [field]: filePath },
        })
      }

      res.json(employer)
    } catch (err) {
      next(err)
    }
  },
)

// PATCH /api/employers/kyc/:id/review — admin/senior_manager reviews KYC
router.patch('/kyc/:id/review',
  authenticate,
  authorize('senior_manager', 'admin'),
  async (req, res, next) => {
    try {
      const { status, rejectionNote } = req.body
      if (!['under_review', 'verified', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' })
      }

      const employer = await prisma.employer.update({
        where: { id: req.params.id },
        data: {
          kycStatus: status,
          rejectionNote: status === 'rejected' ? (rejectionNote || null) : null,
        },
      })

      res.json(employer)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ message: 'Employer not found' })
      next(err)
    }
  },
)

// GET /api/employers/kyc/all — admin/senior_manager list all KYC submissions
router.get('/kyc/all',
  authenticate,
  authorize('senior_manager', 'admin'),
  async (req, res, next) => {
    try {
      const { status } = req.query
      const where = {}
      if (status) where.kycStatus = status

      const employers = await prisma.employer.findMany({
        where,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { updatedAt: 'desc' },
      })
      res.json(employers)
    } catch (err) {
      next(err)
    }
  },
)

export default router
