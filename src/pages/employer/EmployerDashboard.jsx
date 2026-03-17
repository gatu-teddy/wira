import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { StatCard, MatchScore, Avatar, StagePill, Badge } from '../../components/ui/index.jsx'
import { mockCandidates, mockEmployerJobs } from '../../utils/mockData.js'
import { useAuth } from '../../context/AuthContext.jsx'
import './Employer.css'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const recent = mockCandidates.slice(0, 4)
  const activeJobs = mockEmployerJobs.filter(j => j.status === 'active')

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>You have <strong>8 new candidate matches</strong> and <strong>2 active roles.</strong></p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn--primary btn--sm">+ Post a Job</Link>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <StatCard icon={<JobIcon />} iconBg="rgba(79,70,229,0.08)" value={activeJobs.length} label="Active Listings" change="+1 this week" changeType="up" />
        <StatCard icon={<PeopleIcon />} iconBg="rgba(6,182,212,0.08)" value="8" label="New Matches" change="Today" changeType="up" />
        <StatCard icon={<ClockIcon />} iconBg="rgba(16,185,129,0.08)" value="14d" label="Avg. Time to Match" change="-2d vs last month" changeType="up" />
        <StatCard icon={<ChartIcon />} iconBg="rgba(245,158,11,0.08)" value="38%" label="Shortlist Rate" change="+5% vs last month" changeType="up" />
      </div>

      <div className="employer-grid">
        {/* Left: Candidate matches */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
            <h3>New Candidate Matches</h3>
            <Link to="/employer/candidates" style={{ fontSize: '0.875rem', fontWeight: 700 }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {recent.map(c => <CandidateCard key={c.id} candidate={c} />)}
          </div>
        </div>

        {/* Right: Active jobs & pipeline summary */}
        <div>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3>Active Listings</h3>
              <Link to="/employer/jobs" style={{ fontSize: '0.875rem', fontWeight: 700 }}>Manage →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {activeJobs.map(job => <JobRow key={job.id} job={job} />)}
            </div>
          </div>

          {/* Pipeline summary */}
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-5)' }}>Pipeline Overview</h4>
            {[
              { label: 'Applied', count: 64, color: '#F59E0B' },
              { label: 'Shortlisted', count: 11, color: '#4F46E5' },
              { label: 'Interviewed', count: 5, color: '#06B6D4' },
              { label: 'Offered', count: 2, color: '#10B981' },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.9375rem', color: 'var(--clr-text-secondary)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.0625rem' }}>{count}</span>
              </div>
            ))}
            <Link to="/employer/pipeline" className="btn btn--ghost btn--sm btn--full" style={{ marginTop: 'var(--space-2)' }}>View Full Pipeline →</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function CandidateCard({ candidate }) {
  return (
    <div className="card card--hover employer-candidate-card">
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <Avatar name={candidate.name} size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>{candidate.name}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>{candidate.role} · {candidate.experience}</p>
            </div>
            <MatchScore score={candidate.matchScore} />
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', marginBottom: 'var(--space-3)' }}>{candidate.location} · {candidate.availability}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--space-3)' }}>
            {candidate.skills.slice(0, 4).map(s => (
              <Badge key={s} variant="neutral">{s}</Badge>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn--primary btn--sm">View Profile</button>
            <button className="btn btn--outline btn--sm">Message</button>
            <StagePill stage={candidate.stage} />
          </div>
        </div>
      </div>
    </div>
  )
}

function JobRow({ job }) {
  const statusColor = job.status === 'active' ? 'var(--clr-success)' : job.status === 'paused' ? 'var(--clr-accent-warm)' : 'var(--clr-text-muted)'
  return (
    <div className="card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h5 style={{ margin: 0 }}>{job.title}</h5>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor, textTransform: 'capitalize' }}>● {job.status}</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '0.8125rem', color: 'var(--clr-text-secondary)' }}>
        <span>{job.applicants} applicants</span>
        <span>{job.matched} matched</span>
        <span>{job.shortlisted} shortlisted</span>
      </div>
    </div>
  )
}

const I = (d) => () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
const JobIcon    = I(<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>)
const PeopleIcon = I(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>)
const ClockIcon  = I(<><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>)
const ChartIcon  = I(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>)
