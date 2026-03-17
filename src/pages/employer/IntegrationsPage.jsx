import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { Badge, Modal } from '../../components/ui/index.jsx'
import { atsProviders } from '../../utils/mockData.js'
import './Employer.css'

export default function IntegrationsPage() {
  const [providers, setProviders] = useState(atsProviders)
  const [modal, setModal] = useState(null)
  const [connecting, setConnecting] = useState(null)

  const handleConnect = (id) => {
    setConnecting(id)
    setTimeout(() => {
      setProviders(ps => ps.map(p => p.id === id ? { ...p, connected: true, jobsSynced: Math.floor(Math.random() * 20) + 5 } : p))
      setConnecting(null)
      setModal(null)
    }, 1500)
  }

  const handleDisconnect = (id) => {
    setProviders(ps => ps.map(p => p.id === id ? { ...p, connected: false, jobsSynced: 0 } : p))
  }

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>ATS Integrations</h1>
          <p>Connect your existing ATS to sync roles automatically and push candidate updates back.</p>
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ marginBottom: 'var(--space-8)', background: 'linear-gradient(135deg, rgba(79,70,229,0.04), rgba(6,182,212,0.04))', borderColor: 'rgba(79,70,229,0.15)' }}>
        <h4 style={{ marginBottom: 'var(--space-4)' }}>How ATS Integration Works</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          {[
            ['1', 'Connect', 'Authenticate your ATS via OAuth or API key'],
            ['2', 'Sync Roles', 'Open positions import automatically — no manual duplication'],
            ['3', 'Match', 'Wira surfaces strong candidates for each synced role'],
            ['4', 'Push Back', 'Candidate advances are pushed back into your ATS'],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--clr-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--clr-text-secondary)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ats-grid">
        {providers.map(p => (
          <div key={p.id} className={`ats-card ${p.connected ? 'ats-card--connected' : ''}`}>
            <div className="ats-card__logo">{p.name[0]}</div>
            <h4 style={{ marginBottom: 'var(--space-2)' }}>{p.name}</h4>

            {p.connected ? (
              <>
                <Badge variant="success">Connected</Badge>
                <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)', margin: 'var(--space-3) 0' }}>
                  {p.jobsSynced} roles synced
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn--outline btn--sm">Sync Now</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => handleDisconnect(p.id)}>Disconnect</button>
                </div>
              </>
            ) : (
              <>
                <Badge variant="neutral">Not Connected</Badge>
                <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-secondary)', margin: 'var(--space-3) 0' }}>
                  Sync your open roles automatically.
                </p>
                <button className="btn btn--primary btn--sm" onClick={() => setModal(p)}>Connect →</button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Connect modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={`Connect ${modal?.name}`}>
        <p style={{ color: 'var(--clr-text-secondary)', marginBottom: 'var(--space-6)' }}>
          Enter your {modal?.name} API credentials to connect. Wira will sync your open roles automatically and push candidate updates back.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="form-group">
            <label className="form-label">{modal?.name} API Key</label>
            <input className="form-input" type="password" placeholder="sk-xxxxxxxxxxxxxxxx" />
          </div>
          <div className="form-group">
            <label className="form-label">Account Subdomain (if applicable)</label>
            <input className="form-input" placeholder="your-company" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn--primary" style={{ flex: 1 }} onClick={() => handleConnect(modal?.id)} disabled={!!connecting}>
            {connecting ? 'Connecting…' : 'Connect & Sync'}
          </button>
          <button className="btn btn--ghost" onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
