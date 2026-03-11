import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateId, sanitizePagination } from '../middleware/validate.js'

const router = Router()

const VALID_ROLES = ['candidate', 'employer', 'recruiter', 'senior_manager', 'visa_officer', 'admin', 'agency']

// GET /api/users
router.get('/', authenticate, authorize('admin'), sanitizePagination, async (req, res, next) => {
  try {
    const { role } = req.query
    const where = {}
    if (role && VALID_ROLES.includes(role)) where.role = role

    const { skip, limit, page } = req.pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.user.count({ where }),
    ])

    res.json({ users, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
})

// GET /api/users/:id
router.get('/:id', authenticate, authorize('admin'), validateId, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (err) {
    next(err)
  }
})

// PUT /api/users/:id
router.put('/:id', authenticate, authorize('admin'), validateId, async (req, res, next) => {
  try {
    const { name, role, isActive } = req.body
    const updates = {}

    if (typeof name === 'string' && name.trim().length >= 2) updates.name = name.trim()
    if (role && VALID_ROLES.includes(role)) updates.role = role
    if (typeof isActive === 'boolean') updates.isActive = isActive

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' })
    }

    if (updates.isActive === false && req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' })
    }

    try {
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: updates,
      })
      res.json(user)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' })
      throw err
    }
  } catch (err) {
    next(err)
  }
})

// DELETE /api/users/:id
router.delete('/:id', authenticate, authorize('admin'), validateId, async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }

    await prisma.user.delete({ where: { id: req.params.id } })
    res.json({ message: 'User deleted' })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' })
    next(err)
  }
})

export default router
