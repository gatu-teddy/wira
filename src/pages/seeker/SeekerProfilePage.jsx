import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { Avatar, ProgressBar, Badge } from '../../components/ui/index.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Seeker.css'

const SKILLS = ['Figma', 'React', 'TypeScript', 'Node.js', 'Product Strategy', 'User Research', 'Python', 'SQL', 'AWS', 'Design Systems', 'GraphQL', 'CSS']

export default function SeekerProfilePage() {
  const { user } = useAuth()
  const [editSection, setEditSection] = useState(null)
  const [skills, setSkills] = useState(['Figma', 'React', 'User Research', 'Product Strategy'])

  const toggleSkill = (s) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>My Profile</h1>
          <p>Your profile is the engine behind every match Wira makes for you.</p>
        </div>
        <button className="btn btn--primary btn--sm">Save Changes</button>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar-card">
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-7)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <Avatar name={user?.name} size="xl" />
            </div>
            <h3>{user?.name}</h3>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9375rem', marginTop: 4 }}>Senior Product Designer</p>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>San Francisco, CA · Remote Open</p>

            <div style={{ margin: 'var(--space-5) 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)' }}>Profile completeness</span>
                <span style={{ fontWeight: 800, color: 'var(--clr-primary)', fontFamily: 'var(--font-heading)' }}>72%</span>
              </div>
              <ProgressBar value={72} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem', color: 'var(--clr-text-secondary)', textAlign: 'left' }}>
              {[
                ['✓', 'Basic info', true],
                ['✓', 'Work experience', true],
                ['✓', 'Skills added', true],
                ['○', 'Career goals', false],
                ['○', 'Portfolio link', false],
              ].map(([icon, label, done]) => (
                <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: done ? 'var(--clr-success)' : 'var(--clr-border-strong)', fontWeight: 700 }}>{icon}</span>
                  <span style={{ color: done ? 'var(--clr-text)' : 'var(--clr-text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div>
          {/* Basic Info */}
          <div className="profile-section">
            <div className="profile-section__header">
              <h4>Basic Information</h4>
              <button className="btn btn--ghost btn--sm" onClick={() => setEditSection(editSection === 'basic' ? null : 'basic')}>
                {editSection === 'basic' ? 'Done' : 'Edit'}
              </button>
            </div>
            {editSection === 'basic' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" defaultValue={user?.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Role</label>
                    <input className="form-input" defaultValue="Senior Product Designer" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" defaultValue="San Francisco, CA" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input className="form-input" placeholder="https://linkedin.com/in/…" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Summary</label>
                  <textarea className="form-textarea" defaultValue="Product designer with 6 years experience building intuitive B2B SaaS products…" />
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[['Name', user?.name], ['Role', 'Senior Product Designer'], ['Location', 'San Francisco, CA'], ['Experience', '6 years'], ['Email', user?.email]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{v || '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="profile-section">
            <div className="profile-section__header">
              <h4>Skills</h4>
              <button className="btn btn--ghost btn--sm" onClick={() => setEditSection(editSection === 'skills' ? null : 'skills')}>
                {editSection === 'skills' ? 'Done' : 'Edit'}
              </button>
            </div>
            {editSection === 'skills' ? (
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)', marginBottom: 'var(--space-4)' }}>Click to add or remove skills.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SKILLS.map(s => (
                    <button
                      key={s}
                      className={`checkbox-chip ${skills.includes(s) ? 'checkbox-chip--active' : ''}`}
                      onClick={() => toggleSkill(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="profile-section">
            <div className="profile-section__header">
              <h4>Work Preferences</h4>
              <button className="btn btn--ghost btn--sm" onClick={() => setEditSection(editSection === 'prefs' ? null : 'prefs')}>
                {editSection === 'prefs' ? 'Done' : 'Edit'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
              {[
                ['Job Type', 'Full-time'],
                ['Work Style', 'Remote or Hybrid'],
                ['Salary', '$120k – $160k'],
                ['Industries', 'Fintech, SaaS'],
                ['Company Size', '50–500'],
                ['Availability', 'Available now'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="profile-section">
            <div className="profile-section__header">
              <h4>Work Experience</h4>
              <button className="btn btn--outline btn--sm">+ Add Role</button>
            </div>
            {[
              { role: 'Senior Product Designer', company: 'Stripe', period: '2022 – Present', desc: 'Led design for Stripe\'s developer dashboard, improving task completion by 34%.' },
              { role: 'Product Designer', company: 'Linear', period: '2020 – 2022', desc: 'Core designer on project and issue tracking product. Owned design system foundations.' },
              { role: 'UX Designer', company: 'Figma', period: '2018 – 2020', desc: 'Contributed to community and file sharing features used by millions.' },
            ].map((exp, i) => (
              <div key={i} style={{ paddingBottom: 'var(--space-5)', marginBottom: 'var(--space-5)', borderBottom: i < 2 ? '1px solid var(--clr-border)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div>
                    <h5 style={{ fontSize: '1rem', margin: 0 }}>{exp.role}</h5>
                    <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9375rem' }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>{exp.period}</span>
                </div>
                <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9375rem' }}>{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
