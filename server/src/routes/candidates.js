import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateId, sanitizePagination, stripFields, requireFields } from '../middleware/validate.js'

const router = Router()

const STATES_ORDER = ['registration', 'assessment', 'showcase', 'hard_lock', 'contracting', 'work_permit', 'visa', 'deployment', 'completed']

const CANDIDATE_EDITABLE_FIELDS = [
  'name', 'phone', 'dob', 'gender', 'region', 'district', 'address',
  'industry', 'specialization', 'experienceYears', 'skills', 'languages',
  'education', 'workExperience',
]

function pickFields(obj, fields) {
  const result = {}
  for (const f of fields) {
    if (obj[f] !== undefined) result[f] = obj[f]
  }
  return result
}

// GET /api/candidates
router.get('/', authenticate, sanitizePagination, async (req, res, next) => {
  try {
    const { state, industry, recruiterId } = req.query
    const where = {}

    if (state && STATES_ORDER.includes(state)) where.currentState = state
    if (industry && typeof industry === 'string') where.industry = industry
    if (recruiterId && typeof recruiterId === 'string') where.recruiterId = recruiterId

    if (req.user.role === 'recruiter') {
      where.recruiterId = req.user.id
    }

    const { skip, limit, page } = req.pagination
    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.candidate.count({ where }),
    ])

    res.json({ candidates, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
})

// GET /api/candidates/me — get candidate profile for the authenticated user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    let candidate = await prisma.candidate.findFirst({ where: { userId: req.user.id } })
    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          userId: req.user.id,
          name: req.user.name,
          email: req.user.email,
        },
      })
    }
    res.json(candidate)
  } catch (err) {
    next(err)
  }
})

// GET /api/candidates/:id
router.get('/:id', authenticate, validateId, async (req, res, next) => {
  try {
    const candidate = await prisma.candidate.findUnique({ where: { id: req.params.id } })
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' })
    }
    res.json(candidate)
  } catch (err) {
    next(err)
  }
})

// POST /api/candidates
router.post('/',
  authenticate,
  authorize('recruiter', 'admin', 'agency'),
  stripFields('id', 'displayId', 'stateHistory', 'currentState', 'conditions'),
  requireFields('name', 'email'),
  async (req, res, next) => {
    try {
      const candidate = await prisma.candidate.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          dob: req.body.dob,
          gender: req.body.gender,
          region: req.body.region,
          district: req.body.district,
          address: req.body.address,
          industry: req.body.industry,
          specialization: req.body.specialization,
          experienceYears: req.body.experienceYears || 0,
          skills: req.body.skills || [],
          languages: req.body.languages || [],
          education: req.body.education || [],
          workExperience: req.body.workExperience || [],
          currentState: 'registration',
          recruiterId: req.body.recruiterId || req.user.id,
          stateHistory: [{ state: 'registration', timestamp: new Date().toISOString(), action: 'init' }],
        },
      })
      res.status(201).json(candidate)
    } catch (err) {
      next(err)
    }
  },
)

// PUT /api/candidates/:id
router.put('/:id',
  authenticate,
  authorize('recruiter', 'admin', 'agency'),
  validateId,
  stripFields('id', 'displayId', 'stateHistory'),
  async (req, res, next) => {
    try {
      const candidate = await prisma.candidate.update({
        where: { id: req.params.id },
        data: pickFields(req.body, CANDIDATE_EDITABLE_FIELDS),
      })
      res.json(candidate)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ message: 'Candidate not found' })
      next(err)
    }
  },
)

// PATCH /api/candidates/:id/profile
router.patch('/:id/profile', authenticate, validateId, async (req, res, next) => {
  try {
    const safeData = pickFields(req.body, CANDIDATE_EDITABLE_FIELDS)

    if (Object.keys(safeData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' })
    }

    const candidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: safeData,
    })
    res.json(candidate)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Candidate not found' })
    next(err)
  }
})

// POST /api/candidates/:id/transition
router.post('/:id/transition',
  authenticate,
  authorize('recruiter', 'senior_manager', 'admin'),
  validateId,
  requireFields('targetState'),
  async (req, res, next) => {
    try {
      const { targetState } = req.body

      if (!STATES_ORDER.includes(targetState)) {
        return res.status(400).json({ message: 'Invalid target state' })
      }

      const candidate = await prisma.candidate.findUnique({ where: { id: req.params.id } })
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' })
      }

      const currentIdx = STATES_ORDER.indexOf(candidate.currentState)
      const targetIdx = STATES_ORDER.indexOf(targetState)

      if (targetIdx !== currentIdx + 1) {
        return res.status(400).json({ message: 'Invalid state transition' })
      }

      const history = Array.isArray(candidate.stateHistory) ? candidate.stateHistory : []
      history.push({ state: targetState, timestamp: new Date().toISOString(), action: 'transition' })

      const updated = await prisma.candidate.update({
        where: { id: req.params.id },
        data: { currentState: targetState, conditions: [], stateHistory: history },
      })

      res.json(updated)
    } catch (err) {
      next(err)
    }
  },
)

// POST /api/candidates/:id/rollback
router.post('/:id/rollback',
  authenticate,
  authorize('senior_manager', 'admin'),
  validateId,
  async (req, res, next) => {
    try {
      const candidate = await prisma.candidate.findUnique({ where: { id: req.params.id } })
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' })
      }

      const currentIdx = STATES_ORDER.indexOf(candidate.currentState)
      if (currentIdx <= 0 || candidate.currentState === 'completed') {
        return res.status(400).json({ message: 'Cannot rollback from this state' })
      }

      const newState = STATES_ORDER[currentIdx - 1]
      const history = Array.isArray(candidate.stateHistory) ? candidate.stateHistory : []
      history.push({ state: newState, timestamp: new Date().toISOString(), action: 'rollback' })

      const updated = await prisma.candidate.update({
        where: { id: req.params.id },
        data: { currentState: newState, conditions: [], stateHistory: history },
      })

      res.json(updated)
    } catch (err) {
      next(err)
    }
  },
)

// DELETE /api/candidates/:id
router.delete('/:id', authenticate, authorize('admin'), validateId, async (req, res, next) => {
  try {
    await prisma.candidate.delete({ where: { id: req.params.id } })
    res.json({ message: 'Candidate deleted' })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Candidate not found' })
    next(err)
  }
})

export default router
