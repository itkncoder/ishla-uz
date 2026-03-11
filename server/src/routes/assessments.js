import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateId, stripFields, requireFields } from '../middleware/validate.js'

const router = Router()

const VALID_TYPES = ['skill', 'language', 'medical', 'interview']

// GET /api/assessments?candidateId=xxx
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { candidateId } = req.query
    const where = {}
    if (candidateId && typeof candidateId === 'string') where.candidateId = candidateId

    const assessments = await prisma.assessment.findMany({ where, orderBy: { assessedAt: 'desc' } })
    res.json(assessments)
  } catch (err) {
    next(err)
  }
})

// POST /api/assessments
router.post('/',
  authenticate,
  authorize('recruiter', 'senior_manager', 'admin'),
  stripFields('id'),
  requireFields('candidateId', 'type', 'category'),
  async (req, res, next) => {
    try {
      if (!VALID_TYPES.includes(req.body.type)) {
        return res.status(400).json({ message: `Invalid type. Allowed: ${VALID_TYPES.join(', ')}` })
      }

      const assessment = await prisma.assessment.create({
        data: {
          candidateId: req.body.candidateId,
          type: req.body.type,
          category: req.body.category,
          score: req.body.score ?? null,
          maxScore: req.body.maxScore ?? null,
          passed: req.body.passed ?? false,
          notes: req.body.notes,
          assessedBy: req.body.assessedBy || req.user.id,
          assessedAt: req.body.assessedAt || new Date().toISOString().split('T')[0],
        },
      })
      res.status(201).json(assessment)
    } catch (err) {
      next(err)
    }
  },
)

// PUT /api/assessments/:id
router.put('/:id',
  authenticate,
  authorize('recruiter', 'senior_manager', 'admin'),
  validateId,
  stripFields('id'),
  async (req, res, next) => {
    try {
      if (req.body.type && !VALID_TYPES.includes(req.body.type)) {
        return res.status(400).json({ message: `Invalid type. Allowed: ${VALID_TYPES.join(', ')}` })
      }

      const data = {}
      if (req.body.type) data.type = req.body.type
      if (req.body.category) data.category = req.body.category
      if (req.body.score !== undefined) data.score = req.body.score
      if (req.body.maxScore !== undefined) data.maxScore = req.body.maxScore
      if (req.body.passed !== undefined) data.passed = req.body.passed
      if (req.body.notes !== undefined) data.notes = req.body.notes
      if (req.body.assessedBy) data.assessedBy = req.body.assessedBy
      if (req.body.assessedAt) data.assessedAt = req.body.assessedAt

      const assessment = await prisma.assessment.update({
        where: { id: req.params.id },
        data,
      })
      res.json(assessment)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ message: 'Assessment not found' })
      next(err)
    }
  },
)

// DELETE /api/assessments/:id
router.delete('/:id', authenticate, authorize('admin'), validateId, async (req, res, next) => {
  try {
    await prisma.assessment.delete({ where: { id: req.params.id } })
    res.json({ message: 'Assessment deleted' })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Assessment not found' })
    next(err)
  }
})

export default router
