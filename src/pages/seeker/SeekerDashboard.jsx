import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { StatCard, MatchScore, SalaryRange, Avatar, ProgressBar } from '../../components/ui/index.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { mockJobs, mockApplications, mockNotifications } from '../../utils/mockData.js'
import './Seeker.css'

export default function SeekerDashboard() {
  const { user } = useAuth()
  const topMatches = mockJobs.slice(0, 3)

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p>You have <strong>5 new matches</strong> and <strong>2 pending updates</strong> today.</p>
        </div>
        <Link to="/seeker/profile" className="btn btn--outline btn--sm">Complete Profile</Link>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <StatCard icon={<MatchIcon />} iconBg="rgba(79,70,229,0.08)" value="5" label="New Matches" change="+3 today" changeType="up" />
        <StatCard icon={<AppIcon />} iconBg="rgba(6,182,212,0.08)" value="2" label="Active Applications" change="" />
        <StatCard icon={<EyeIcon />} iconBg="rgba(16,185,129,0.08)" value="14" label="Profile Views" change="+6 this week" changeType="up" />
        <StatCard icon={<CalIcon />} iconBg="rgba(245,158,11,0.08)" value="1" label="Upcoming Interview" change="Dec 12" />
      </div>

      <div className="seeker-grid">
        {/* Left column */}
        <div className="seeker-col-main">
          {/* Profile completeness */}
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h4>Profile Completeness</h4>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--clr-primary)' }}>72%</span>
            </div>
            <ProgressBar value={72} />
            <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)', marginTop: 'var(--space-3)' }}>
              Add your portfolio links and career goals to boost your match rate by ~23%.
            </p>
            <Link to="/seeker/profile" className="btn btn--outline btn--sm" style={{ marginTop: 'var(--space-4)' }}>
              Complete Profile →
            </Link>
          </div>

          {/* Top matches */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3>Top Matches</h3>
              <Link to="/seeker/matches" style={{ fontSize: '0.875rem', fontWeight: 700 }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {topMatches.map(job => (
                <JobMatchCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="seeker-col-side">
          {/* Active applications */}
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Active Applications</h4>
            {mockApplications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {mockApplications.map(app => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9375rem' }}>No active applications yet.</p>
            )}
            <Link to="/seeker/applications" className="btn btn--ghost btn--sm btn--full" style={{ marginTop: 'var(--space-4)' }}>
              View All Applications
            </Link>
          </div>

          {/* Notifications */}
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Notifications</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {mockNotifications.map(n => (
                <div key={n.id} className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}>
                  <div className="notif-item__dot" />
                  <div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>{n.text}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function JobMatchCard({ job }) {
  return (
    <div className="job-match-card card card--hover">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div>
          <h4 style={{ marginBottom: 4 }}>{job.title}</h4>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9375rem' }}>{job.company} · {job.location}</p>
        </div>
        <MatchScore score={job.matchScore} />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <SalaryRange {...job.salary} />
        <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8125rem' }}>{job.type}</span>
        <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.8125rem' }}>Posted {job.posted}</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        <Link to={`/seeker/jobs/${job.id}`} className="btn btn--primary btn--sm">View Role</Link>
        <button className="btn btn--ghost btn--sm">{job.saved ? '♥ Saved' : '♡ Save'}</button>
      </div>
    </div>
  )
}

function AppCard({ app }) {
  const stageColors = { applied: '#F59E0B', shortlisted: '#4F46E5', interviewed: '#06B6D4', offered: '#10B981' }
  const color = stageColors[app.stage] || '#94A3B8'
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--clr-border)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)', fontSize: '0.875rem' }}>
        {app.job.company[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job.title}</p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--clr-text-secondary)' }}>{app.job.company}</p>
        <p style={{ fontSize: '0.75rem', color, fontWeight: 700, marginTop: 4, textTransform: 'capitalize' }}>{app.stage}</p>
      </div>
    </div>
  )
}

// Icons
const I = (d) => () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
const MatchIcon = I(<><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></>)
const AppIcon   = I(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></>)
const EyeIcon   = I(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>)
const CalIcon   = I(<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>)
