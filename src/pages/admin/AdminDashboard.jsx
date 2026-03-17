import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { StatCard, Badge, Avatar } from '../../components/ui/index.jsx'
import { mockAdminStats, mockRecentUsers } from '../../utils/mockData.js'
import './Admin.css'

export default function AdminDashboard() {
  const s = mockAdminStats

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Admin Panel</h1>
          <p>Platform overview, moderation, and analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--clr-success)', fontWeight: 700 }}>● System Healthy</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>{s.platformHealth}% uptime</span>
        </div>
      </div>

      {/* Platform stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <StatCard icon={<UsersIcon />} iconBg="rgba(79,70,229,0.08)" value={s.totalUsers.toLocaleString()} label="Total Users" change={`+${s.todaySignups} today`} changeType="up" />
        <StatCard icon={<JobIcon />} iconBg="rgba(6,182,212,0.08)" value={s.jobsPosted.toLocaleString()} label="Jobs Posted" change="+48 this week" changeType="up" />
        <StatCard icon={<MatchIcon />} iconBg="rgba(16,185,129,0.08)" value={s.matchesMade.toLocaleString()} label="Matches Made" change="+1,204 this month" changeType="up" />
        <StatCard icon={<ClockIcon />} iconBg="rgba(245,158,11,0.08)" value={`${s.avgTimeToHire}d`} label="Avg. Time to Hire" change="-2d vs last month" changeType="up" />
      </div>

      <div className="admin-grid">
        {/* Left */}
        <div>
          {/* Recent signups */}
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
              <h4>Recent Signups</h4>
              <a href="#" style={{ fontSize: '0.875rem', fontWeight: 700 }}>View all →</a>
            </div>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <Avatar name={u.name} size="sm" />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><Badge variant={u.type === 'employer' ? 'accent' : 'primary'}>{u.type}</Badge></td>
                      <td>
                        <Badge variant={u.status === 'active' || u.status === 'verified' ? 'success' : 'warning'}>
                          {u.status}
                        </Badge>
                      </td>
                      <td style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>{u.joined}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn--ghost btn--sm">View</button>
                          {u.status === 'pending' && <button className="btn btn--outline btn--sm">Verify</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform activity chart (simplified) */}
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-5)' }}>Platform Activity (Last 7 Days)</h4>
            <div className="admin-chart">
              {[42, 65, 58, 80, 72, 90, 84].map((val, i) => (
                <div key={i} className="admin-chart__bar-wrap">
                  <div className="admin-chart__bar" style={{ height: `${val}%` }} />
                  <span className="admin-chart__label">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          {/* Quick actions */}
          <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                ['Pending Employer Verifications', '3', 'warning'],
                ['Flagged Job Listings', '1', 'danger'],
                ['Support Tickets Open', '7', 'neutral'],
                ['System Alerts', '0', 'success'],
              ].map(([label, count, variant]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: 'var(--clr-surface-2)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{label}</span>
                  <Badge variant={variant}>{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
            <h4 style={{ marginBottom: 'var(--space-4)' }}>User Breakdown</h4>
            {[
              { label: 'Active Job Seekers', value: s.activeJobSeekers, total: s.totalUsers, color: 'var(--clr-primary)' },
              { label: 'Employers', value: s.employers, total: s.totalUsers, color: 'var(--clr-accent)' },
            ].map(({ label, value, total, color }) => {
              const pct = Math.round((value / total) * 100)
              return (
                <div key={label} style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.875rem' }}>{value.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Match metrics */}
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Match Metrics</h4>
            {[
              ['Total Matches Made', s.matchesMade.toLocaleString()],
              ['Avg. Match Score', '81%'],
              ['Hire Conversion Rate', '23%'],
              ['Platform NPS', '72'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--clr-border)' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

const I = (d) => () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
const UsersIcon = I(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>)
const JobIcon   = I(<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>)
const MatchIcon = I(<><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></>)
const ClockIcon = I(<><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>)
