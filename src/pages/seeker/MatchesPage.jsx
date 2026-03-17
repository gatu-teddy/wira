import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { MatchScore, SalaryRange, Badge, SearchInput, Tabs } from '../../components/ui/index.jsx'
import { mockJobs } from '../../utils/mockData.js'
import './Seeker.css'

const FILTERS = {
  type:  ['Full-time','Part-time','Contract','Freelance'],
  level: ['Entry','Mid','Senior','Leadership'],
}

export default function MatchesPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [saved, setSaved] = useState(new Set(mockJobs.filter(j => j.saved).map(j => j.id)))
  const [selectedJob, setSelectedJob] = useState(mockJobs[0])

  const filtered = mockJobs.filter(j => {
    if (tab === 'saved' && !saved.has(j.id)) return false
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const toggleSave = (id) => setSaved(s => {
    const n = new Set(s)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>My Matches</h1>
          <p>AI-curated roles based on your profile — updated daily.</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { label: 'All Matches', value: 'all', count: mockJobs.length },
          { label: 'Saved', value: 'saved', count: saved.size },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="matches-layout">
        {/* List */}
        <div className="matches-list">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <SearchInput value={search} onChange={setSearch} placeholder="Search roles, companies…" />
          </div>
          {filtered.length === 0 && (
            <p style={{ color: 'var(--clr-text-muted)', padding: 'var(--space-8)', textAlign: 'center' }}>No matches found.</p>
          )}
          {filtered.map(job => (
            <div
              key={job.id}
              className={`match-list-item ${selectedJob?.id === job.id ? 'match-list-item--active' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>{job.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)' }}>{job.company}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                  <MatchScore score={job.matchScore} />
                  <button
                    onClick={e => { e.stopPropagation(); toggleSave(job.id) }}
                    style={{ background: 'none', border: 'none', color: saved.has(job.id) ? 'var(--clr-primary)' : 'var(--clr-text-muted)', cursor: 'pointer', fontSize: '1rem' }}
                  >{saved.has(job.id) ? '♥' : '♡'}</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--clr-text-secondary)' }}>{job.location}</span>
                <span style={{ color: 'var(--clr-border)', fontSize: '0.75rem' }}>·</span>
                <SalaryRange {...job.salary} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>Posted {job.posted}</p>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selectedJob && (
          <div className="matches-detail card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{selectedJob.title}</h2>
                <p style={{ color: 'var(--clr-text-secondary)' }}>{selectedJob.company} · {selectedJob.location}</p>
              </div>
              <MatchScore score={selectedJob.matchScore} />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
              <Badge variant="primary">{selectedJob.type}</Badge>
              <Badge variant="neutral">{selectedJob.level}</Badge>
              <Badge variant="neutral">{selectedJob.industry}</Badge>
            </div>

            <div className="detail-section">
              <h5>Compensation</h5>
              <SalaryRange {...selectedJob.salary} />
            </div>

            <div className="detail-section">
              <h5>About the Role</h5>
              <p style={{ color: 'var(--clr-text-secondary)', lineHeight: 1.7 }}>{selectedJob.description}</p>
            </div>

            <div className="detail-section">
              <h5>Requirements</h5>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 0 }}>
                {selectedJob.requirements.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, color: 'var(--clr-text-secondary)', fontSize: '0.9375rem' }}>
                    <span style={{ color: 'var(--clr-primary)', fontWeight: 700, flexShrink: 0 }}>→</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h5>Benefits</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedJob.benefits.map((b, i) => (
                  <Badge key={i} variant="success">{b}</Badge>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button className="btn btn--primary" style={{ flex: 1 }}>Apply Now</button>
              <button className="btn btn--outline">Message Company</button>
              <button className="btn btn--ghost" onClick={() => toggleSave(selectedJob.id)}>
                {saved.has(selectedJob.id) ? '♥' : '♡'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
