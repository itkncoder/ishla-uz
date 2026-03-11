export const PUBLIC_ROLES = ['candidate', 'employer']

export const ROLES = {
  CANDIDATE: 'candidate',
  EMPLOYER: 'employer',
  RECRUITER: 'recruiter',
  SENIOR_MANAGER: 'senior_manager',
  VISA_OFFICER: 'visa_officer',
  ADMIN: 'admin',
  AGENCY: 'agency',
}

export const ROLE_CONFIG = {
  [ROLES.CANDIDATE]: {
    homeRoute: '/candidate',
    allowedPrefixes: ['/candidate'],
    label: 'Candidate',
  },
  [ROLES.EMPLOYER]: {
    homeRoute: '/employer',
    allowedPrefixes: ['/employer'],
    label: 'Employer',
  },
  [ROLES.RECRUITER]: {
    homeRoute: '/recruiter',
    allowedPrefixes: ['/recruiter'],
    label: 'Recruiter',
  },
  [ROLES.SENIOR_MANAGER]: {
    homeRoute: '/senior-manager',
    allowedPrefixes: ['/senior-manager'],
    label: 'Senior Manager',
  },
  [ROLES.VISA_OFFICER]: {
    homeRoute: '/visa-officer',
    allowedPrefixes: ['/visa-officer'],
    label: 'Visa Officer',
  },
  [ROLES.ADMIN]: {
    homeRoute: '/admin',
    allowedPrefixes: ['/admin'],
    label: 'Admin',
  },
  [ROLES.AGENCY]: {
    homeRoute: '/agency',
    allowedPrefixes: ['/agency'],
    label: 'Agency',
  },
}
