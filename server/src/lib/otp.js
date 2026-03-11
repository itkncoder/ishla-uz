import crypto from 'crypto'

// In-memory OTP store: email -> { code, expiresAt, attempts }
const otpStore = new Map()

const OTP_LENGTH = 5
const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes
const MAX_ATTEMPTS = 5
const COOLDOWN_MS = 60 * 1000 // 1 minute between sends

/**
 * Generate and store a new OTP for the given email.
 * Returns the code or null if rate-limited.
 */
export function generateOtp(email) {
  const key = email.toLowerCase()
  const existing = otpStore.get(key)

  // Rate limit: don't allow resend within cooldown
  if (existing && Date.now() - (existing.createdAt || 0) < COOLDOWN_MS) {
    return null
  }

  const code = String(crypto.randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH))

  otpStore.set(key, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    createdAt: Date.now(),
    attempts: 0,
  })

  return code
}

/**
 * Verify an OTP for the given email.
 * Returns true if valid, false otherwise.
 * Cleans up on success or expiry.
 */
export function verifyOtp(email, code) {
  const key = email.toLowerCase()
  const entry = otpStore.get(key)

  if (!entry) return false

  // Expired
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key)
    return false
  }

  // Too many attempts
  entry.attempts++
  if (entry.attempts > MAX_ATTEMPTS) {
    otpStore.delete(key)
    return false
  }

  if (entry.code !== code) return false

  // Valid — clean up
  otpStore.delete(key)
  return true
}

// Cleanup expired entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of otpStore) {
    if (now > entry.expiresAt) otpStore.delete(key)
  }
}, 10 * 60 * 1000)
