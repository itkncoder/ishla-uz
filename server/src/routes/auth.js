import { Router } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'
import { generateOtp, verifyOtp } from '../lib/otp.js'
import { sendOtpEmail } from '../lib/mail.js'
import { authenticate } from '../middleware/auth.js'
import { requireFields } from '../middleware/validate.js'

const router = Router()

const VALID_ROLES = ['candidate', 'employer', 'recruiter', 'senior_manager', 'visa_officer', 'admin', 'agency']

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
}

// POST /api/auth/send-otp
router.post('/send-otp', requireFields('email'), async (req, res, next) => {
  try {
    const { email } = req.body
    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const code = generateOtp(email)
    if (!code) {
      return res.status(429).json({ message: 'Please wait before requesting a new code' })
    }

    try {
      await sendOtpEmail(email, code)
    } catch (err) {
      console.error('Failed to send OTP email:', err.message)
      return res.status(500).json({ message: 'Failed to send email. Please try again.' })
    }

    res.json({ message: 'OTP sent', success: true })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/login
router.post('/login', requireFields('email', 'otp'), async (req, res, next) => {
  try {
    const { email, otp } = req.body

    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (typeof otp !== 'string' || !verifyOtp(email, otp)) {
      return res.status(400).json({ message: 'Invalid OTP code.' })
    }

    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: email.split('@')[0],
          email,
          role: 'candidate',
        },
      })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' })
    }

    const token = generateToken(user)
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, profileCompleted: user.profileCompleted, activeRole: user.activeRole },
      token,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/register
router.post('/register', requireFields('name', 'email', 'otp'), async (req, res, next) => {
  try {
    const { name, email, role, otp } = req.body

    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' })
    }

    if (typeof otp !== 'string' || !verifyOtp(email, otp)) {
      return res.status(400).json({ message: 'Invalid OTP code.' })
    }

    const assignedRole = role || 'candidate'
    if (!VALID_ROLES.includes(assignedRole)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    if (['admin', 'senior_manager', 'visa_officer'].includes(assignedRole)) {
      return res.status(403).json({ message: 'Cannot self-register with this role' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await prisma.user.create({
      data: { name: name.trim(), email, role: assignedRole },
    })
    const token = generateToken(user)

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, profileCompleted: user.profileCompleted, activeRole: user.activeRole },
      token,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/google
router.post('/google', requireFields('accessToken'), async (req, res, next) => {
  try {
    const { accessToken, role } = req.body

    let profile
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!response.ok) throw new Error('Invalid token')
      profile = await response.json()
    } catch {
      return res.status(401).json({ message: 'Invalid Google token' })
    }

    const { sub: googleId, email, name, picture } = profile
    if (!email) {
      return res.status(400).json({ message: 'Google account has no email' })
    }

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    })

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            provider: 'google',
            avatar: picture && !user.avatar ? picture : user.avatar,
          },
        })
      }
    } else {
      const assignedRole = role || 'candidate'
      if (!VALID_ROLES.includes(assignedRole)) {
        return res.status(400).json({ message: 'Invalid role' })
      }
      if (['admin', 'senior_manager', 'visa_officer'].includes(assignedRole)) {
        return res.status(403).json({ message: 'Cannot self-register with this role' })
      }

      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email,
          googleId,
          avatar: picture,
          provider: 'google',
          role: assignedRole,
        },
      })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' })
    }

    const token = generateToken(user)
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, profileCompleted: user.profileCompleted, activeRole: user.activeRole },
      token,
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const { id, name, email, role, avatar, profileCompleted, activeRole } = req.user
  res.json({ user: { id, name, email, role, avatar, profileCompleted, activeRole } })
})

// PATCH /api/auth/me — update activeRole
router.patch('/me', authenticate, async (req, res, next) => {
  try {
    const { activeRole } = req.body
    if (!activeRole || !['candidate', 'employer'].includes(activeRole)) {
      return res.status(400).json({ message: 'Invalid activeRole' })
    }
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { activeRole },
    })
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, profileCompleted: user.profileCompleted, activeRole: user.activeRole } })
  } catch (err) {
    next(err)
  }
})

// PUT /api/auth/complete-profile
router.put('/complete-profile', authenticate, async (req, res, next) => {
  try {
    const { name, phone, dob, industry, avatar } = req.body

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' })
    }

    const data = {
      name: name.trim(),
      profileCompleted: true,
    }

    if (phone && typeof phone === 'string') data.phone = phone.trim()
    if (avatar && typeof avatar === 'string') data.avatar = avatar.trim()

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
    })

    // If role is candidate, create or update candidate record
    if (user.role === 'candidate') {
      const existing = await prisma.candidate.findFirst({ where: { userId: user.id } })
      if (!existing) {
        await prisma.candidate.create({
          data: {
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: data.phone || null,
            dob: dob || null,
            industry: industry || null,
          },
        })
      } else {
        const updateData = { name: user.name }
        if (data.phone) updateData.phone = data.phone
        if (dob) updateData.dob = dob
        if (industry) updateData.industry = industry
        await prisma.candidate.update({ where: { id: existing.id }, data: updateData })
      }
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, profileCompleted: user.profileCompleted, activeRole: user.activeRole },
    })
  } catch (err) {
    next(err)
  }
})

export default router
