import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { StagePill, MatchScore, SalaryRange, Tabs } from '../../components/ui/index.jsx'
import { mockApplications, mockJobs } from '../../utils/mockData.js'

// Extend mock data a bit for the page
const ALL_APPLICATIONS = [
  ...mockApplications,
  {
    id: 'a3',
    job: mockJobs[2],
    appliedDate: '2024-11-28',
    stage: 'applied',
    lastUpdate: '1 week ago',
    nextStep: 'Under review',
  },
  {
    id: 'a4',
    job: mockJobs[0],
    appliedDate: '2024-11-20',
    stage: 'applied',
    lastUpdate: '2 weeks ago',
    nextStep: 'Under review',
  },
]

export default function ApplicationsPage() {
  const [tab, setTab] = useState('all')

  const filtered = ALL_APPLICATIONS.filter(a => {
    if (tab === 'all') return true
    return a.stage === tab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>My Applications</h1>
          <p>Track every role you've applied to and where you stand.</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { label: 'All', value: 'all', count: ALL_APPLICATIONS.length },
          { label: 'Applied', value: 'applied', count: ALL_APPLICATIONS.filter(a => a.stage === 'applied').length },
          { label: 'Shortlisted', value: 'shortlisted', count: ALL_APPLICATIONS.filter(a => a.stage === 'shortlisted').length },
          { label: 'Interviewed', value: 'interviewed', count: ALL_APPLICATIONS.filter(a => a.stage === 'interviewed').length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--clr-text-muted)', padding: 'var(--space-12)' }}>
            No applications in this stage yet.
          </p>
        )}

        {filtered.map(app => (
          <div key={app.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-6)', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start' }}>
              {/* Company avatar */}
              <div style={{
                width: 52, height: 52, borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--clr-primary-light), var(--clr-accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 900, fontSize: '1.25rem',
                fontFamily: 'var(--font-heading)', flexShrink: 0,
              }}>
                {app.job.company[0]}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <h4 style={{ margin: 0 }}>{app.job.title}</h4>
                  <MatchScore score={app.job.matchScore} />
                </div>
                <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9375rem', marginBottom: 'var(--space-2)' }}>
                  {app.job.company} · {app.job.location}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>
                  <span><SalaryRange {...app.job.salary} /></span>
                  <span>Applied {app.appliedDate}</span>
                  <span>Updated {app.lastUpdate}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
              <StagePill stage={app.stage} />
              <p style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', textAlign: 'right', maxWidth: 200 }}>
                {app.nextStep}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn btn--ghost btn--sm">Message</button>
                <button className="btn btn--outline btn--sm">View Role</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
