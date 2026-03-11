import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'
import { sanitizePagination } from '../middleware/validate.js'

const SHOWCASE_STATES = ['showcase', 'hard_lock', 'contracting', 'work_permit', 'visa', 'deployment', 'completed']
const VALID_GENDERS = ['male', 'female']

const router = Router()

// GET /api/showcase - anonymized candidates for employers
router.get('/', authenticate, sanitizePagination, async (req, res, next) => {
  try {
    const { industry, minExperience, gender, skills } = req.query
    const where = { currentState: { in: SHOWCASE_STATES } }

    if (industry && typeof industry === 'string') where.industry = industry
    if (gender && VALID_GENDERS.includes(gender)) where.gender = gender
    if (minExperience) {
      const min = Number(minExperience)
      if (Number.isFinite(min) && min >= 0) {
        where.experienceYears = { gte: min }
      }
    }

    const { skip, limit, page } = req.pagination

    let candidates, total

    if (skills && typeof skills === 'string') {
      const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean)
      if (skillList.length) {
        where.skills = { hasSome: skillList }
      }
    }

    ;[candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        select: {
          displayId: true,
          industry: true,
          specialization: true,
          experienceYears: true,
          skills: true,
          languages: true,
          education: true,
          gender: true,
          matchScore: true,
        },
        orderBy: { matchScore: 'desc' },
        skip,
        take: limit,
      }),
      prisma.candidate.count({ where }),
    ])

    // Anonymize education
    const anonymized = candidates.map((c) => ({
      ...c,
      education: Array.isArray(c.education)
        ? c.education.map((e) => ({ degree: e.degree, field: e.field }))
        : c.education,
    }))

    res.json({ candidates: anonymized, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
})

export default router
