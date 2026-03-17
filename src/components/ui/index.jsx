import React from 'react'

// ─── LOGO ──────────────────────────────────────────────────────────
export function Logo({ size = 'md', color = 'primary' }) {
  const sizes = { sm: { text: '1rem', dot: 6 }, md: { text: '1.25rem', dot: 8 }, lg: { text: '1.75rem', dot: 10 } }
  const s = sizes[size] || sizes.md
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
      <span style={{
        width: s.dot + 6, height: s.dot + 6,
        background: 'var(--clr-primary)',
        borderRadius: '50%',
        display: 'inline-block',
        flexShrink: 0,
      }} />
      <span style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 800,
        fontSize: s.text,
        color: color === 'white' ? 'white' : 'var(--clr-text)',
        letterSpacing: '-0.02em',
      }}>
        wira
        <span style={{ color: 'var(--clr-primary)', fontWeight: 800 }}>.</span>
      </span>
    </span>
  )
}

// ─── MATCH SCORE ──────────────────────────────────────────────────
export function MatchScore({ score }) {
  const cls = score >= 85 ? 'high' : score >= 70 ? 'mid' : 'low'
  const emoji = score >= 85 ? '●' : score >= 70 ? '◑' : '○'
  return (
    <span className={`match-score match-score--${cls}`}>
      <span style={{ fontSize: 9 }}>{emoji}</span>
      {score}% match
    </span>
  )
}

// ─── AVATAR ───────────────────────────────────────────────────────
export function Avatar({ name, size = 'md', img }) {
  const initials = name ? name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : '?'
  if (img) return <img src={img} alt={name} className={`avatar avatar--${size}`} />
  return <div className={`avatar avatar--${size}`}>{initials}</div>
}

// ─── BADGE ────────────────────────────────────────────────────────
export function Badge({ children, variant = 'neutral' }) {
  return <span className={`badge badge--${variant}`}>{children}</span>
}

// ─── STAGE PILL ───────────────────────────────────────────────────
export function StagePill({ stage }) {
  const map = {
    applied:     { label: 'Applied',     variant: 'applied' },
    shortlisted: { label: 'Shortlisted', variant: 'shortlisted' },
    interviewed: { label: 'Interviewed', variant: 'interviewed' },
    offered:     { label: 'Offered',     variant: 'offered' },
    rejected:    { label: 'Rejected',    variant: 'rejected' },
  }
  const { label, variant } = map[stage] || { label: stage, variant: 'applied' }
  return <span className={`pipeline-stage pipeline-stage--${variant}`}>{label}</span>
}

// ─── SALARY DISPLAY ───────────────────────────────────────────────
export function SalaryRange({ min, max, currency = 'USD' }) {
  const fmt = (n) => `${currency === 'USD' ? '$' : ''}${(n/1000).toFixed(0)}k`
  return (
    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--clr-text)' }}>
      {fmt(min)} – {fmt(max)}
      <span style={{ fontWeight: 400, color: 'var(--clr-text-muted)', fontSize: '0.8125rem' }}> /yr</span>
    </span>
  )
}

// ─── PROGRESS BAR ────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div>
      <div className="progress-bar">
        <div
          className="progress-bar__fill"
          style={{
            width: `${pct}%`,
            background: color || undefined,
          }}
        />
      </div>
    </div>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={wide ? { maxWidth: 720 } : {}}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'var(--clr-surface-2)', border: 'none', borderRadius: 'var(--radius-md)', padding: '6px 10px', cursor: 'pointer', fontSize: '1.125rem', color: 'var(--clr-text-secondary)' }}
          >×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── EMPTY STATE ─────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <div>
        <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--clr-text)' }}>{title}</h4>
        {description && <p style={{ fontSize: '0.9375rem', maxWidth: 360 }}>{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────
export function StatCard({ icon, iconBg, value, label, change, changeType = 'up' }) {
  return (
    <div className="stat-card animate-fade-in-up">
      {icon && (
        <div className="stat-card__icon" style={{ background: iconBg || 'rgba(79,70,229,0.08)', color: 'var(--clr-primary)' }}>
          {icon}
        </div>
      )}
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {change && (
        <div className={`stat-card__change stat-card__change--${changeType}`}>
          {changeType === 'up' ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}

// ─── SEARCH INPUT ─────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="search-wrapper">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="search"
        className="form-input search-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minWidth: 240 }}
      />
    </div>
  )
}

// ─── TABS ─────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={`tab ${active === tab.value ? 'tab--active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              marginLeft: 6,
              background: active === tab.value ? 'var(--clr-primary)' : 'var(--clr-surface-2)',
              color: active === tab.value ? 'white' : 'var(--clr-text-secondary)',
              borderRadius: 99,
              padding: '1px 7px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── LOADING SPINNER ──────────────────────────────────────────────
export function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size,
      border: '3px solid var(--clr-border)',
      borderTopColor: 'var(--clr-primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  )
}

// ─── JOB TYPE BADGE ───────────────────────────────────────────────
export function JobTypeBadge({ type }) {
  const colors = {
    'Full-time': 'primary',
    'Part-time': 'warning',
    'Contract': 'accent',
    'Freelance': 'success',
    'Remote': 'success',
  }
  return <Badge variant={colors[type] || 'neutral'}>{type}</Badge>
}
