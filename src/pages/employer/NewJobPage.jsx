import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'

const LEVELS = ['Entry', 'Mid', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Level']
const TYPES  = ['Full-time', 'Part-time', 'Contract', 'Freelance']

export default function NewJobPage() {
  const [form, setForm] = useState({ type: 'Full-time', level: 'Mid', salaryVisible: true })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => navigate('/employer/jobs'), 1000)
  }

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Post a New Job</h1>
          <p>Every role must include a salary range. Transparency attracts better candidates.</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Basic info */}
        <div className="card">
          <h4 style={{ marginBottom: 'var(--space-5)' }}>Role Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-input" placeholder="e.g. Senior Product Designer" value={form.title || ''} onChange={e => set('title', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={form.level} onChange={e => set('level', e.target.value)}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="e.g. Remote, New York, or Remote (US only)" value={form.location || ''} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea className="form-textarea" style={{ minHeight: 160 }} placeholder="Describe the role, responsibilities, and what great looks like…" value={form.description || ''} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Requirements (one per line)</label>
              <textarea className="form-textarea" placeholder="5+ years React experience&#10;TypeScript proficiency&#10;Experience with design systems" value={form.requirements || ''} onChange={e => set('requirements', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Salary - required */}
        <div className="card" style={{ borderColor: 'rgba(79,70,229,0.2)', background: 'rgba(79,70,229,0.02)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: 4 }}>Salary Range <span style={{ color: 'var(--clr-danger)' }}>*</span></h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>
                Salary transparency is a platform requirement on Wira. Roles without a defined range cannot be published.
              </p>
            </div>
            <span style={{ background: 'rgba(79,70,229,0.1)', color: 'var(--clr-primary)', padding: '4px 12px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>Required</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 'var(--space-4)', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Minimum (USD/yr)</label>
              <input className="form-input" type="number" placeholder="80000" value={form.salaryMin || ''} onChange={e => set('salaryMin', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Maximum (USD/yr)</label>
              <input className="form-input" type="number" placeholder="120000" value={form.salaryMax || ''} onChange={e => set('salaryMax', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="card">
          <h4 style={{ marginBottom: 'var(--space-5)' }}>Benefits & Perks</h4>
          <div className="form-group">
            <textarea className="form-textarea" placeholder="Health insurance, equity, flexible hours, learning budget…" value={form.benefits || ''} onChange={e => set('benefits', e.target.value)} />
            <span className="form-hint">These appear on your job listing and help attract the right candidates.</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn--primary btn--lg" onClick={handleSave} disabled={saving}>
            {saving ? 'Publishing…' : 'Publish Job →'}
          </button>
          <button className="btn btn--ghost btn--lg" onClick={() => navigate('/employer/jobs')}>Cancel</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
