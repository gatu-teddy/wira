import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { MatchScore, Avatar, Badge, StagePill, SearchInput, Tabs } from '../../components/ui/index.jsx'
import { mockCandidates } from '../../utils/mockData.js'
import './Employer.css'

export default function CandidatesPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')

  const filtered = mockCandidates.filter(c => {
    if (tab !== 'all' && c.stage !== tab) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.role.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Candidate Matches</h1>
          <p>AI-matched candidates across all your active roles.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search candidates…" />
        </div>
      </div>

      <Tabs
        tabs={[
          { label: 'All', value: 'all', count: mockCandidates.length },
          { label: 'Applied', value: 'applied', count: mockCandidates.filter(c => c.stage === 'applied').length },
          { label: 'Shortlisted', value: 'shortlisted', count: mockCandidates.filter(c => c.stage === 'shortlisted').length },
          { label: 'Interviewed', value: 'interviewed', count: mockCandidates.filter(c => c.stage === 'interviewed').length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="candidates-grid">
        {filtered.map(c => <CandidateDetailCard key={c.id} candidate={c} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--clr-text-muted)', padding: 'var(--space-12)' }}>No candidates found.</p>
      )}
    </DashboardLayout>
  )
}

function CandidateDetailCard({ candidate }) {
  const [stage, setStage] = useState(candidate.stage)
  const stages = ['applied', 'shortlisted', 'interviewed', 'offered']

  return (
    <div className="card card--hover" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <Avatar name={candidate.name} size="lg" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ margin: 0 }}>{candidate.name}</h4>
              <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9375rem' }}>{candidate.role}</p>
            </div>
            <MatchScore score={candidate.matchScore} />
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
            {candidate.experience} exp · {candidate.location}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--space-4)' }}>
        {candidate.skills.map(s => <Badge key={s} variant="neutral">{s}</Badge>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>
        <div>
          <span style={{ color: 'var(--clr-text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role Applied</span>
          <span style={{ fontWeight: 600 }}>{candidate.appliedTo}</span>
        </div>
        <div>
          <span style={{ color: 'var(--clr-text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary Expect.</span>
          <span style={{ fontWeight: 600 }}>${(candidate.salary.min/1000).toFixed(0)}k – ${(candidate.salary.max/1000).toFixed(0)}k</span>
        </div>
        <div>
          <span style={{ color: 'var(--clr-text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</span>
          <span style={{ fontWeight: 600 }}>{candidate.availability}</span>
        </div>
        <div>
          <span style={{ color: 'var(--clr-text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Education</span>
          <span style={{ fontWeight: 600 }}>{candidate.education}</span>
        </div>
      </div>

      {/* Stage mover */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', display: 'block', marginBottom: 8 }}>Move Stage</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {stages.map(s => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`btn btn--sm ${stage === s ? 'btn--primary' : 'btn--ghost'}`}
              style={{ flex: 1, fontSize: '0.75rem', textTransform: 'capitalize', padding: '6px 4px' }}
            >{s}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button className="btn btn--outline btn--sm" style={{ flex: 1 }}>Message</button>
        <button className="btn btn--ghost btn--sm">Push to ATS</button>
      </div>
    </div>
  )
}
