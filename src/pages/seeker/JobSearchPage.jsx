import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { MatchScore, SalaryRange, Badge } from '../../components/ui/index.jsx'
import { mockJobs } from '../../utils/mockData.js'

const LOCATIONS = ['Remote', 'San Francisco', 'New York', 'London', 'Berlin']
const INDUSTRIES = ['Technology', 'Fintech', 'Productivity', 'Design Tools', 'Dev Tools']
const LEVELS = ['Entry', 'Mid', 'Senior', 'Leadership']

export default function JobSearchPage() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [industry, setIndustry] = useState('')
  const [level, setLevel] = useState('')
  const [salaryMin, setSalaryMin] = useState(0)
  const [selected, setSelected] = useState(mockJobs[0])

  const filtered = mockJobs.filter(j => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false
    if (location && !j.location.toLowerCase().includes(location.toLowerCase())) return false
    if (industry && j.industry !== industry) return false
    if (level && j.level !== level) return false
    if (salaryMin && j.salary.min < salaryMin) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Job Search</h1>
          <p>Explore all roles — your AI match score follows you everywhere.</p>
        </div>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="form-input search-input" placeholder="Role, company, keyword…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.75rem' }} />
        </div>
        <select className="form-select" style={{ flex: '0 1 160px' }} value={location} onChange={e => setLocation(e.target.value)}>
          <option value="">All Locations</option>
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select className="form-select" style={{ flex: '0 1 160px' }} value={industry} onChange={e => setIndustry(e.target.value)}>
          <option value="">All Industries</option>
          {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
        </select>
        <select className="form-select" style={{ flex: '0 1 140px' }} value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
        {(search || location || industry || level) && (
          <button className="btn btn--ghost btn--sm" onClick={() => { setSearch(''); setLocation(''); setIndustry(''); setLevel('') }}>
            Clear filters ×
          </button>
        )}
        <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem', marginLeft: 'auto' }}>{filtered.length} roles</span>
      </div>

      <div className="matches-layout">
        <div className="matches-list">
          {filtered.length === 0 && (
            <p style={{ padding: 'var(--space-8)', color: 'var(--clr-text-muted)', textAlign: 'center' }}>No roles match your filters.</p>
          )}
          {filtered.map(job => (
            <div key={job.id} className={`match-list-item ${selected?.id === job.id ? 'match-list-item--active' : ''}`} onClick={() => setSelected(job)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>{job.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>{job.company} · {job.location}</p>
                </div>
                <MatchScore score={job.matchScore} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <SalaryRange {...job.salary} />
                <Badge variant="neutral">{job.type}</Badge>
                <span style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)' }}>{job.posted}</span>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="matches-detail card">
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h2 style={{ fontSize: '1.375rem' }}>{selected.title}</h2>
                <MatchScore score={selected.matchScore} />
              </div>
              <p style={{ color: 'var(--clr-text-secondary)' }}>{selected.company} · {selected.location}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
              <Badge variant="primary">{selected.type}</Badge>
              <Badge variant="neutral">{selected.level}</Badge>
              <Badge variant="neutral">{selected.industry}</Badge>
            </div>
            <div className="detail-section">
              <h5>Compensation</h5>
              <SalaryRange {...selected.salary} />
            </div>
            <div className="detail-section">
              <h5>About the Role</h5>
              <p style={{ color: 'var(--clr-text-secondary)', lineHeight: 1.7 }}>{selected.description}</p>
            </div>
            <div className="detail-section">
              <h5>Requirements</h5>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selected.requirements.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, color: 'var(--clr-text-secondary)', fontSize: '0.9375rem' }}>
                    <span style={{ color: 'var(--clr-primary)', fontWeight: 700, flexShrink: 0 }}>→</span> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="detail-section">
              <h5>Benefits</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selected.benefits.map((b, i) => <Badge key={i} variant="success">{b}</Badge>)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button className="btn btn--primary" style={{ flex: 1 }}>Apply Now</button>
              <button className="btn btn--outline">Save</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
