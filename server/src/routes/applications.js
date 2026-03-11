import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// GET /api/applications — list applications (filter by employerId or candidateId)
router.get('/', async (req, res, next) => {
  try {
    const { employerId, candidateId, jobOrderId } = req.query
    const where = {}

    if (employerId) where.employerId = employerId
    if (candidateId) where.candidateId = candidateId
    if (jobOrderId) where.jobOrderId = jobOrderId

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json(applications)
  } catch (err) {
    next(err)
  }
})

// POST /api/applications — create application
router.post('/', async (req, res, next) => {
  try {
    const { jobOrderId, candidateId, candidateProfile, jobTitle, employerId, employerName } = req.body

    if (!jobOrderId || !candidateId) {
      return res.status(400).json({ message: 'jobOrderId and candidateId are required' })
    }

    // Prevent duplicate applications
    const existing = await prisma.application.findFirst({
      where: { jobOrderId, candidateId },
    })
    if (existing) {
      return res.status(409).json({ message: 'Already applied', application: existing })
    }

    const application = await prisma.application.create({
      data: {
        jobOrderId,
        candidateId,
        candidateProfile: candidateProfile || {},
        jobTitle: jobTitle || '',
        employerId: employerId || null,
        employerName: employerName || null,
      },
    })

    res.status(201).json(application)
  } catch (err) {
    next(err)
  }
})

export default router
