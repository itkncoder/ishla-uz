import { CANDIDATE_STATES } from '@config/constants'

const { REGISTRATION, ASSESSMENT, SHOWCASE, HARD_LOCK, CONTRACTING, WORK_PERMIT, VISA, DEPLOYMENT, COMPLETED } = CANDIDATE_STATES

// Ordered pipeline
export const STATE_ORDER = [
  REGISTRATION, ASSESSMENT, SHOWCASE, HARD_LOCK, CONTRACTING, WORK_PERMIT, VISA, DEPLOYMENT, COMPLETED
]

// Transition definitions
export const TRANSITIONS = {
  [REGISTRATION]: {
    target: ASSESSMENT,
    conditions: ['profile_complete', 'documents_uploaded'],
    sideEffects: ['notify_recruiter'],
  },
  [ASSESSMENT]: {
    target: SHOWCASE,
    conditions: ['assessment_passed', 'medical_cleared'],
    sideEffects: ['add_to_showcase'],
  },
  [SHOWCASE]: {
    target: HARD_LOCK,
    conditions: ['employer_selected'],
    sideEffects: ['lock_candidate', 'notify_employer'],
  },
  [HARD_LOCK]: {
    target: CONTRACTING,
    conditions: ['employer_confirmed'],
    sideEffects: ['initiate_contract'],
  },
  [CONTRACTING]: {
    target: WORK_PERMIT,
    conditions: ['contract_signed'],
    sideEffects: ['submit_work_permit_application'],
  },
  [WORK_PERMIT]: {
    target: VISA,
    conditions: ['work_permit_granted'],
    sideEffects: ['submit_visa_application'],
  },
  [VISA]: {
    target: DEPLOYMENT,
    conditions: ['visa_granted'],
    sideEffects: ['schedule_deployment'],
  },
  [DEPLOYMENT]: {
    target: COMPLETED,
    conditions: ['deployment_confirmed'],
    sideEffects: ['close_pipeline'],
  },
}

export function canTransition(currentState, conditions) {
  const transition = TRANSITIONS[currentState]
  if (!transition) return false
  return transition.conditions.every(c => conditions.has(c))
}

export function getNextState(currentState) {
  const transition = TRANSITIONS[currentState]
  return transition?.target ?? null
}

export function getPreviousState(currentState) {
  const idx = STATE_ORDER.indexOf(currentState)
  if (idx <= 0) return null
  return STATE_ORDER[idx - 1]
}

export function getProgress(currentState) {
  const idx = STATE_ORDER.indexOf(currentState)
  return Math.round(((idx) / (STATE_ORDER.length - 1)) * 100)
}

export function getAvailableTransitions(currentState, conditions) {
  const transition = TRANSITIONS[currentState]
  if (!transition) return null
  const met = transition.conditions.filter(c => conditions.has(c))
  const unmet = transition.conditions.filter(c => !conditions.has(c))
  return {
    target: transition.target,
    conditions: transition.conditions,
    met,
    unmet,
    canTransition: unmet.length === 0,
  }
}
