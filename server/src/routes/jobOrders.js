import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateId, sanitizePagination, stripFields } from '../middleware/validate.js'
import { sendJobOrderNotification } from '../lib/telegram.js'

const router = Router()

const VALID_STATUSES = ['waiting_approve', 'active', 'declined']

// GET /api/job-orders
router.get('/', sanitizePagination, async (req, res, next) => {
  try {
    const { status, industry, country, recruiterId } = req.query
    const where = {}

    if (status && status !== 'all' && VALID_STATUSES.includes(status)) where.status = status
    if (industry && typeof industry === 'string') where.industry = industry
    if (country && typeof country === 'string') where.country = country
    if (recruiterId && typeof recruiterId === 'string') where.recruiterId = recruiterId

    const { skip, limit, page } = req.pagination
    const [jobOrders, total] = await Promise.all([
      prisma.jobOrder.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.jobOrder.count({ where }),
    ])

    res.json({ jobOrders, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
})

// GET /api/job-orders/:id
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const jobOrder = await prisma.jobOrder.findUnique({ where: { id: req.params.id } })
    if (!jobOrder) {
      return res.status(404).json({ message: 'Job order not found' })
    }
    res.json(jobOrder)
  } catch (err) {
    next(err)
  }
})

// POST /api/job-orders
router.post('/',
  authenticate,
  authorize('employer', 'recruiter', 'admin'),
  stripFields('id'),
  async (req, res, next) => {
    try {
      const jobOrder = await prisma.jobOrder.create({
        data: {
          title: req.body.title || {},
          employer: req.body.employer || {},
          industry: req.body.industry,
          specialization: req.body.specialization || {},
          country: req.body.country,
          city: req.body.city || {},
          description: req.body.description || {},
          requirements: req.body.requirements || {},
          salary: req.body.salary || {},
          benefits: req.body.benefits || {},
          status: 'waiting_approve',
          recruiterId: req.body.recruiterId,
        },
      })
      // Send Telegram notification
      sendJobOrderNotification(jobOrder).catch(() => {})

      res.status(201).json(jobOrder)
    } catch (err) {
      next(err)
    }
  },
)

// PUT /api/job-orders/:id
router.put('/:id',
  authenticate,
  authorize('employer', 'recruiter', 'admin'),
  validateId,
  stripFields('id'),
  async (req, res, next) => {
    try {
      const jobOrder = await prisma.jobOrder.update({
        where: { id: req.params.id },
        data: req.body,
      })
      res.json(jobOrder)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ message: 'Job order not found' })
      next(err)
    }
  },
)

// PATCH /api/job-orders/:id/status
router.patch('/:id/status',
  authenticate,
  authorize('employer', 'recruiter', 'admin'),
  validateId,
  async (req, res, next) => {
    try {
      const { status } = req.body
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Allowed: ${VALID_STATUSES.join(', ')}` })
      }

      const jobOrder = await prisma.jobOrder.update({
        where: { id: req.params.id },
        data: { status },
      })
      res.json(jobOrder)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ message: 'Job order not found' })
      next(err)
    }
  },
)

// DELETE /api/job-orders/:id
router.delete('/:id', authenticate, authorize('admin'), validateId, async (req, res, next) => {
  try {
    await prisma.jobOrder.delete({ where: { id: req.params.id } })
    res.json({ message: 'Job order deleted' })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Job order not found' })
    next(err)
  }
})

export default router
