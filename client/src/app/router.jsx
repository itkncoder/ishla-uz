import { createBrowserRouter } from 'react-router'

import AuthLayout from '@shared/layouts/AuthLayout'
import CandidatePortalLayout from '@shared/layouts/CandidatePortalLayout'
import EmployerPortalLayout from '@shared/layouts/EmployerPortalLayout'
import RecruiterLayout from '@shared/layouts/RecruiterLayout'
import SeniorManagerLayout from '@shared/layouts/SeniorManagerLayout'
import VisaOfficerLayout from '@shared/layouts/VisaOfficerLayout'
import AdminLayout from '@shared/layouts/AdminLayout'
import AgencyLayout from '@shared/layouts/AgencyLayout'

import AuthGuard from '@shared/components/AuthGuard'
import RoleGuard from '@shared/components/RoleGuard'
import NotFoundPage from '@shared/components/NotFoundPage'
import ForbiddenPage from '@shared/components/ForbiddenPage'
import ScrollToTop from '@shared/components/ScrollToTop'

import HomePage from '@features/home/HomePage'
import HomeRedirect from '@shared/components/HomeRedirect'

import ForgotPasswordPage from '@features/auth/pages/ForgotPasswordPage'

import CandidateDirections from '@features/candidate/pages/DirectionsPage'
import CandidateJobs from '@features/candidate/pages/JobsPage'
import CandidateChat from '@features/candidate/pages/ChatPage'
import CandidateProfile from '@features/candidate/pages/ProfilePage'
import HelpPage from '@shared/pages/HelpPage'

import EmployerDashboard from '@features/employer/pages/DashboardPage'
import EmployerCreateOrder from '@features/employer/pages/CreateJobOrderPage'
import EmployerKyc from '@features/employer/pages/KycPage'
import EmployerChat from '@features/employer/pages/ChatPage'

import RecruiterDashboard from '@features/recruiter/pages/DashboardPage'
import RecruiterAssignments from '@features/recruiter/pages/AssignmentsPage'
import RecruiterAssessment from '@features/recruiter/pages/AssessmentPage'
import RecruiterDocuments from '@features/recruiter/pages/DocumentsPage'
import RecruiterCandidateDetail from '@features/recruiter/pages/CandidateDetailPage'
import RecruiterRegisterCandidate from '@features/recruiter/pages/RegisterCandidatePage'

import SeniorManagerDashboard from '@features/senior-manager/pages/DashboardPage'
import SeniorManagerApprovals from '@features/senior-manager/pages/ApprovalsPage'
import SeniorManagerReports from '@features/senior-manager/pages/ReportsPage'
import SeniorManagerAuditLog from '@features/senior-manager/pages/AuditLogPage'

import VisaOfficerDashboard from '@features/visa-officer/pages/DashboardPage'
import VisaOfficerVisaForms from '@features/visa-officer/pages/VisaFormsPage'
import VisaOfficerBatchMonitoring from '@features/visa-officer/pages/BatchMonitoringPage'

import AdminDashboard from '@features/admin/pages/DashboardPage'
import AdminUsers from '@features/admin/pages/UsersPage'
import AdminConfig from '@features/admin/pages/ConfigPage'
import AdminRoles from '@features/admin/pages/RolesPage'
import AdminSla from '@features/admin/pages/SlaPage'

import AgencyDashboard from '@features/agency/pages/DashboardPage'
import AgencyRecruiters from '@features/agency/pages/RecruitersPage'
import AgencyCandidates from '@features/agency/pages/CandidatesPage'
import AgencyReports from '@features/agency/pages/ReportsPage'

const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      // Home page
      { path: '/', element: <HomeRedirect /> },

      // Auth routes
      {
        element: <AuthLayout />,
        children: [
          { path: '/auth/forgot-password', element: <ForgotPasswordPage /> },
        ],
      },

      // Candidate portal
      {
        element: <CandidatePortalLayout />,
        children: [
          { path: '/candidate', element: <CandidateDirections /> },
          { path: '/candidate/jobs', element: <CandidateJobs /> },
          { path: '/candidate/chat', element: <CandidateChat /> },
          { path: '/candidate/profile', element: <CandidateProfile /> },
          { path: '/candidate/help', element: <HelpPage /> },
        ],
      },

      // Employer portal
      {
        element: <EmployerPortalLayout />,
        children: [
          { path: '/employer', element: <EmployerDashboard /> },
          { path: '/employer/create-order', element: <EmployerCreateOrder /> },
          { path: '/employer/kyc', element: <EmployerKyc /> },
          { path: '/employer/chat', element: <EmployerChat /> },
          { path: '/employer/help', element: <HelpPage /> },
        ],
      },

      // Recruiter portal (protected)
      {
        element: <AuthGuard />,
        children: [
          {
            element: <RoleGuard roles={['recruiter']} />,
            children: [
              {
                element: <RecruiterLayout />,
                children: [
                  { path: '/recruiter', element: <RecruiterDashboard /> },
                  { path: '/recruiter/assignments', element: <RecruiterAssignments /> },
                  { path: '/recruiter/assessment', element: <RecruiterAssessment /> },
                  { path: '/recruiter/documents', element: <RecruiterDocuments /> },
                  { path: '/recruiter/candidates/:id', element: <RecruiterCandidateDetail /> },
                  { path: '/recruiter/register-candidate', element: <RecruiterRegisterCandidate /> },
                ],
              },
            ],
          },
        ],
      },

      // Senior Manager portal (protected)
      {
        element: <AuthGuard />,
        children: [
          {
            element: <RoleGuard roles={['senior_manager']} />,
            children: [
              {
                element: <SeniorManagerLayout />,
                children: [
                  { path: '/senior-manager', element: <SeniorManagerDashboard /> },
                  { path: '/senior-manager/approvals', element: <SeniorManagerApprovals /> },
                  { path: '/senior-manager/reports', element: <SeniorManagerReports /> },
                  { path: '/senior-manager/audit-log', element: <SeniorManagerAuditLog /> },
                ],
              },
            ],
          },
        ],
      },

      // Visa Officer portal (protected)
      {
        element: <AuthGuard />,
        children: [
          {
            element: <RoleGuard roles={['visa_officer']} />,
            children: [
              {
                element: <VisaOfficerLayout />,
                children: [
                  { path: '/visa-officer', element: <VisaOfficerDashboard /> },
                  { path: '/visa-officer/visa-forms', element: <VisaOfficerVisaForms /> },
                  { path: '/visa-officer/batch-monitoring', element: <VisaOfficerBatchMonitoring /> },
                ],
              },
            ],
          },
        ],
      },

      // Admin portal (protected)
      {
        element: <AuthGuard />,
        children: [
          {
            element: <RoleGuard roles={['admin']} />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: '/admin', element: <AdminDashboard /> },
                  { path: '/admin/users', element: <AdminUsers /> },
                  { path: '/admin/config', element: <AdminConfig /> },
                  { path: '/admin/roles', element: <AdminRoles /> },
                  { path: '/admin/sla', element: <AdminSla /> },
                ],
              },
            ],
          },
        ],
      },

      // Agency portal (protected)
      {
        element: <AuthGuard />,
        children: [
          {
            element: <RoleGuard roles={['agency']} />,
            children: [
              {
                element: <AgencyLayout />,
                children: [
                  { path: '/agency', element: <AgencyDashboard /> },
                  { path: '/agency/recruiters', element: <AgencyRecruiters /> },
                  { path: '/agency/candidates', element: <AgencyCandidates /> },
                  { path: '/agency/reports', element: <AgencyReports /> },
                ],
              },
            ],
          },
        ],
      },

      // Error pages
      { path: '/403', element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
