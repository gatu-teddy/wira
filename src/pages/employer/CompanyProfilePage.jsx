import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { Badge, MatchScore, SalaryRange } from '../../components/ui/index.jsx'
import { mockEmployerJobs } from '../../utils/mockData.js'

export default function CompanyProfilePage() {
  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Company Profile</h1>
          <p>This is how candidates see your company on Wira.</p>
        </div>
        <button className="btn btn--primary btn--sm">Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Main */}
        <div>
          {/* Hero / branding */}
          <div className="card" style={{ marginBottom: 'var(--space-5)', padding: 0, overflow: 'hidden' }}>
            {/* Cover */}
            <div style={{ height: 160, background: 'linear-gradient(135deg, var(--clr-primary-dark), var(--clr-accent))', position: 'relative' }}>
              <button className="btn btn--ghost btn--sm" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                Change Cover
              </button>
            </div>
            <div style={{ padding: 'var(--space-6)', paddingTop: 0 }}>
              {/* Logo */}
              <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'white', border: '3px solid white', marginTop: -36, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--clr-primary)', boxShadow: 'var(--shadow-md)' }}>A</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ marginBottom: 4 }}>Acme Corp</h2>
                  <p style={{ color: 'var(--clr-text-secondary)' }}>Technology · 201–500 employees · San Francisco, CA</p>
                </div>
                <button className="btn btn--ghost btn--sm">Edit</button>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h4>Mission & Values</h4>
              <button className="btn btn--ghost btn--sm">Edit</button>
            </div>
            <p style={{ color: 'var(--clr-text-secondary)', lineHeight: 1.7 }}>
              We're building tools that help developers ship faster and more reliably. Our mission is to reduce the friction between idea and deployment — so the world can run on better software.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {['Transparency', 'Ownership', 'Speed', 'Craftsmanship'].map(v => (
                <span key={v} style={{ padding: '4px 12px', background: 'rgba(79,70,229,0.08)', color: 'var(--clr-primary)', borderRadius: 99, fontSize: '0.875rem', fontWeight: 700 }}>{v}</span>
              ))}
            </div>
          </div>

          {/* Culture */}
          <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h4>Culture & Ways of Working</h4>
              <button className="btn btn--ghost btn--sm">Edit</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              {[
                ['🌍', 'Remote-first', 'Work from anywhere. Async by default, sync when it matters.'],
                ['📈', 'Growth-focused', 'We invest in your development. $2k learning budget/year.'],
                ['🤝', 'Inclusive', 'Diverse team. We actively track and improve DEI metrics.'],
                ['⚡', 'Move fast', 'Small teams, high trust, real ownership from day one.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h4>Benefits & Perks</h4>
              <button className="btn btn--ghost btn--sm">Edit</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Health Insurance', 'Equity', 'Unlimited PTO', '$2k Learning Budget', 'Remote-first', 'Parental Leave', '401k Match', 'Home Office Stipend'].map(b => (
                <Badge key={b} variant="success">{b}</Badge>
              ))}
            </div>
          </div>

          {/* Open roles */}
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-4)' }}>Open Roles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {mockEmployerJobs.filter(j => j.status === 'active').map(job => (
                <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', background: 'var(--clr-surface-2)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{job.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>{job.location} · ${(job.salary.min/1000).toFixed(0)}k – ${(job.salary.max/1000).toFixed(0)}k</div>
                  </div>
                  <button className="btn btn--outline btn--sm">View →</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: preview note + stats */}
        <div style={{ position: 'sticky', top: 'var(--space-8)' }}>
          <div className="card" style={{ marginBottom: 'var(--space-4)', background: 'rgba(79,70,229,0.04)', borderColor: 'rgba(79,70,229,0.15)' }}>
            <h5 style={{ marginBottom: 'var(--space-3)', color: 'var(--clr-primary)' }}>Profile Visibility</h5>
            <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)', marginBottom: 'var(--space-4)' }}>
              Your company profile is visible to all job seekers on Wira, including those who haven't applied yet.
            </p>
            <Badge variant="success">● Live & Visible</Badge>
          </div>

          <div className="card">
            <h5 style={{ marginBottom: 'var(--space-4)' }}>Profile Stats</h5>
            {[
              ['Profile Views (30d)', '842'],
              ['Candidates Interested', '34'],
              ['Avg. Match Quality', '84%'],
              ['Response Rate', '91%'],
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
