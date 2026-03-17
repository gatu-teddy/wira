import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

// Public pages
import HomePage       from './pages/home/HomePage.jsx'
import LoginPage      from './pages/auth/LoginPage.jsx'
import RegisterPage   from './pages/auth/RegisterPage.jsx'

// Seeker pages
import SeekerDashboard   from './pages/seeker/SeekerDashboard.jsx'
import MatchesPage       from './pages/seeker/MatchesPage.jsx'
import SeekerProfilePage from './pages/seeker/SeekerProfilePage.jsx'
import JobSearchPage     from './pages/seeker/JobSearchPage.jsx'

// Employer pages
import EmployerDashboard from './pages/employer/EmployerDashboard.jsx'
import CandidatesPage    from './pages/employer/CandidatesPage.jsx'
import EmployerJobsPage  from './pages/employer/EmployerJobsPage.jsx'
import NewJobPage        from './pages/employer/NewJobPage.jsx'
import PipelinePage      from './pages/employer/PipelinePage.jsx'
import IntegrationsPage  from './pages/employer/IntegrationsPage.jsx'
import CompanyProfilePage from './pages/employer/CompanyProfilePage.jsx'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

// Shared
import MessagesPage from './pages/shared/MessagesPage.jsx'

// Simple Applications page (inline)
import ApplicationsPage from './pages/seeker/ApplicationsPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />

          {/* Seeker */}
          <Route path="/seeker/dashboard"   element={<SeekerDashboard />} />
          <Route path="/seeker/matches"     element={<MatchesPage />} />
          <Route path="/seeker/applications" element={<ApplicationsPage />} />
          <Route path="/seeker/profile"     element={<SeekerProfilePage />} />
          <Route path="/seeker/messages"    element={<MessagesPage />} />
          <Route path="/seeker/jobs"        element={<JobSearchPage />} />

          {/* Employer */}
          <Route path="/employer/dashboard"    element={<EmployerDashboard />} />
          <Route path="/employer/candidates"   element={<CandidatesPage />} />
          <Route path="/employer/jobs"         element={<EmployerJobsPage />} />
          <Route path="/employer/jobs/new"     element={<NewJobPage />} />
          <Route path="/employer/pipeline"     element={<PipelinePage />} />
          <Route path="/employer/messages"     element={<MessagesPage />} />
          <Route path="/employer/integrations" element={<IntegrationsPage />} />
          <Route path="/employer/company"      element={<CompanyProfilePage />} />

          {/* Admin */}
          <Route path="/admin/dashboard"  element={<AdminDashboard />} />
          <Route path="/admin/users"      element={<AdminDashboard />} />
          <Route path="/admin/analytics"  element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
