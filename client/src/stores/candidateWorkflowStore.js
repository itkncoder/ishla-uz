import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { CANDIDATE_STATES } from '@config/constants'
import { canTransition, getNextState, getPreviousState, getProgress, getAvailableTransitions, TRANSITIONS } from '@shared/utils/stateMachine'

const useCandidateWorkflowStore = create(
  devtools(
    (set, get) => ({
      candidates: {},

      initCandidate: (id) => {
        set((state) => ({
          candidates: {
            ...state.candidates,
            [id]: {
              currentState: CANDIDATE_STATES.REGISTRATION,
              conditions: [],
              history: [{ state: CANDIDATE_STATES.REGISTRATION, timestamp: new Date().toISOString(), action: 'init' }],
            },
          },
        }), false, 'initCandidate')
      },

      fulfillCondition: (id, condition) => {
        set((state) => {
          const candidate = state.candidates[id]
          if (!candidate) return state
          const conditions = [...new Set([...candidate.conditions, condition])]
          return {
            candidates: {
              ...state.candidates,
              [id]: { ...candidate, conditions },
            },
          }
        }, false, 'fulfillCondition')
      },

      revokeCondition: (id, condition) => {
        set((state) => {
          const candidate = state.candidates[id]
          if (!candidate) return state
          return {
            candidates: {
              ...state.candidates,
              [id]: {
                ...candidate,
                conditions: candidate.conditions.filter(c => c !== condition),
              },
            },
          }
        }, false, 'revokeCondition')
      },

      transition: (id, targetState) => {
        const state = get()
        const candidate = state.candidates[id]
        if (!candidate) return false

        const conditionsSet = new Set(candidate.conditions)
        const nextState = getNextState(candidate.currentState)

        if (nextState !== targetState || !canTransition(candidate.currentState, conditionsSet)) {
          return false
        }

        set((state) => ({
          candidates: {
            ...state.candidates,
            [id]: {
              ...state.candidates[id],
              currentState: targetState,
              conditions: [],
              history: [
                ...state.candidates[id].history,
                { state: targetState, timestamp: new Date().toISOString(), action: 'transition' },
              ],
            },
          },
        }), false, 'transition')

        return true
      },

      rollback: (id) => {
        const state = get()
        const candidate = state.candidates[id]
        if (!candidate) return false

        const prevState = getPreviousState(candidate.currentState)
        if (!prevState || candidate.currentState === CANDIDATE_STATES.COMPLETED) return false

        set((state) => ({
          candidates: {
            ...state.candidates,
            [id]: {
              ...state.candidates[id],
              currentState: prevState,
              conditions: [],
              history: [
                ...state.candidates[id].history,
                { state: prevState, timestamp: new Date().toISOString(), action: 'rollback' },
              ],
            },
          },
        }), false, 'rollback')

        return true
      },

      // Selectors
      getCandidateState: (id) => {
        return get().candidates[id]?.currentState ?? null
      },

      getCandidateHistory: (id) => {
        return get().candidates[id]?.history ?? []
      },

      getCandidateProgress: (id) => {
        const currentState = get().candidates[id]?.currentState
        return currentState ? getProgress(currentState) : 0
      },

      getAvailableTransitions: (id) => {
        const candidate = get().candidates[id]
        if (!candidate) return null
        return getAvailableTransitions(candidate.currentState, new Set(candidate.conditions))
      },
    }),
    { name: 'CandidateWorkflow' }
  )
)

export default useCandidateWorkflowStore
