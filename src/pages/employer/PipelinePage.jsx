import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { Avatar, MatchScore } from '../../components/ui/index.jsx'
import { mockCandidates } from '../../utils/mockData.js'
import './Employer.css'

const STAGES = [
  { key: 'applied',     label: 'Applied',     color: '#F59E0B' },
  { key: 'shortlisted', label: 'Shortlisted', color: '#4F46E5' },
  { key: 'interviewed', label: 'Interviewed', color: '#06B6D4' },
  { key: 'offered',     label: 'Offered',     color: '#10B981' },
]

export default function PipelinePage() {
  const [candidates, setCandidates] = useState(mockCandidates)

  const move = (id, newStage) => setCandidates(cs => cs.map(c => c.id === id ? { ...c, stage: newStage } : c))

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Hiring Pipeline</h1>
          <p>Move candidates through stages and keep your ATS in sync.</p>
        </div>
        <button className="btn btn--outline btn--sm">Sync to ATS</button>
      </div>

      <div className="pipeline-board">
        {STAGES.map(stage => {
          const cols = candidates.filter(c => c.stage === stage.key)
          return (
            <div key={stage.key} className="pipeline-column">
              <div className="pipeline-column__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color }} />
                  <span className="pipeline-column__title">{stage.label}</span>
                </div>
                <span className="pipeline-count">{cols.length}</span>
              </div>

              {cols.map(c => (
                <div key={c.id} className="pipeline-card">
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <Avatar name={c.name} size="sm" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--clr-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.role}</div>
                    </div>
                    <MatchScore score={c.matchScore} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', marginBottom: 'var(--space-3)' }}>{c.appliedTo}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {STAGES.filter(s => s.key !== stage.key).map(s => (
                      <button key={s.key} className="btn btn--sm btn--ghost"
                        style={{ fontSize: '0.75rem', padding: '3px 8px', color: s.color }}
                        onClick={() => move(c.id, s.key)}
                      >→ {s.label}</button>
                    ))}
                  </div>
                </div>
              ))}

              {cols.length === 0 && (
                <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--clr-text-muted)', fontSize: '0.875rem', border: '2px dashed var(--clr-border)', borderRadius: 'var(--radius-md)' }}>
                  No candidates
                </div>
              )}
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
