import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { sanitizePagination } from '../middleware/validate.js'

const router = Router()

// All routes require admin role
router.use(authenticate, authorize('admin'))

// GET /api/admin/stats — dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    const [
      usersByRole,
      totalUsers,
      candidatesByState,
      totalCandidates,
      jobOrdersByStatus,
      totalJobOrders,
      recentUsers,
    ] = await Promise.all([
      prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
      prisma.user.count(),
      prisma.candidate.groupBy({ by: ['currentState'], _count: { id: true } }),
      prisma.candidate.count(),
      prisma.jobOrder.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.jobOrder.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      }),
    ])

    const activeUsers = await prisma.user.count({ where: { isActive: true } })

    // Convert groupBy results to objects
    const rolesCounts = {}
    usersByRole.forEach((r) => { rolesCounts[r.role] = r._count.id })

    const stateCounts = {}
    candidatesByState.forEach((s) => { stateCounts[s.currentState] = s._count.id })

    const orderStatusCounts = {}
    jobOrdersByStatus.forEach((o) => { orderStatusCounts[o.status] = o._count.id })

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        byRole: rolesCounts,
      },
      candidates: {
        total: totalCandidates,
        byState: stateCounts,
      },
      jobOrders: {
        total: totalJobOrders,
        byStatus: orderStatusCounts,
      },
      recentUsers,
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/users — paginated user list with filters
router.get('/users', sanitizePagination, async (req, res, next) => {
  try {
    const { role, search, status } = req.query
    const where = {}

    const VALID_ROLES = ['candidate', 'employer', 'recruiter', 'senior_manager', 'visa_officer', 'admin', 'agency']
    if (role && VALID_ROLES.includes(role)) where.role = role

    if (status === 'active') where.isActive = true
    else if (status === 'inactive') where.isActive = false

    if (search && typeof search === 'string' && search.trim()) {
      const s = search.trim()
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ]
    }

    const { skip, limit, page } = req.pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    res.json({ users, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
})

// PUT /api/admin/users/:id/toggle — activate/deactivate user
router.put('/users/:id/toggle', async (req, res, next) => {
  try {
    const { id } = req.params
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot toggle your own account' })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    })

    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/users — create user (admin-only)
router.post('/users', async (req, res, next) => {
  try {
    const { name, email, role } = req.body

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required' })
    }

    const VALID_ROLES = ['candidate', 'employer', 'recruiter', 'senior_manager', 'visa_officer', 'admin', 'agency']
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists' })
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    })

    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/users/:id — delete user
router.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }

    await prisma.user.delete({ where: { id } })
    res.json({ message: 'User deleted' })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' })
    next(err)
  }
})

export default router
