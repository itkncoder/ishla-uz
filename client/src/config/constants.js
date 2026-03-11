export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ishla-uz-api.onrender.com/api'

export const SLA_THRESHOLDS = {
  OK: 90,
  WARNING: 30,
  CRITICAL: 0,
}

export const TIMER_TYPES = {
  A: 'A', // managed — countdown + callbacks
  B: 'B', // monitoring — display only
}

export const CANDIDATE_STATES = {
  REGISTRATION: 'registration',
  ASSESSMENT: 'assessment',
  SHOWCASE: 'showcase',
  HARD_LOCK: 'hard_lock',
  CONTRACTING: 'contracting',
  WORK_PERMIT: 'work_permit',
  VISA: 'visa',
  DEPLOYMENT: 'deployment',
  COMPLETED: 'completed',
}
