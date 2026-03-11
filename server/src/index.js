import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'

import { apiLimiter, authLimiter } from './middleware/rateLimiter.js'
import authRoutes from './routes/auth.js'
import candidateRoutes from './routes/candidates.js'
import jobOrderRoutes from './routes/jobOrders.js'
import documentRoutes from './routes/documents.js'
import assessmentRoutes from './routes/assessments.js'
import showcaseRoutes from './routes/showcase.js'
import classificationRoutes from './routes/classifications.js'
import userRoutes from './routes/users.js'
import adminRoutes from './routes/admin.js'
import employerRoutes from './routes/employers.js'
import applicationRoutes from './routes/applications.js'
import telegramWebhookRoutes from './routes/telegramWebhook.js'

const app = express()
const PORT = process.env.PORT || 3000

// --- Security middleware ---
app.use(helmet())

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173']

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false, limit: '1mb' }))
app.use(hpp())

app.use('/api', apiLimiter)
app.use('/api/auth', authLimiter)
app.use('/uploads', express.static('uploads'))

// --- Routes ---
app.use('/api/auth', authRoutes)
app.use('/api/candidates', candidateRoutes)
app.use('/api/job-orders', jobOrderRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/assessments', assessmentRoutes)
app.use('/api/showcase', showcaseRoutes)
app.use('/api/classifications', classificationRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/employers', employerRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/telegram', telegramWebhookRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS: origin not allowed' })
  }

  console.error(err.stack)

  const status = err.status || 500
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error'

  res.status(status).json({ message })
})

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)

  // Start Telegram polling in development (no webhook needed)
  if (process.env.NODE_ENV !== 'production' && process.env.TELEGRAM_BOT_TOKEN) {
    const { startPolling } = await import('./lib/telegram.js')
    const { handleCallbackQuery } = await import('./routes/telegramWebhook.js')

    startPolling(async (callback) => {
      try {
        await handleCallbackQuery(callback)
      } catch (err) {
        console.error('Telegram polling error:', err.message)
      }
    })
  }
})
