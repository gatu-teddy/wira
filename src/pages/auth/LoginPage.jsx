import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui/index.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Auth.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', type: 'seeker' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    setTimeout(() => {
      const user = login(form.email, form.password, form.type)
      if (form.type === 'employer') navigate('/employer/dashboard')
      else if (form.type === 'admin') navigate('/admin/dashboard')
      else navigate('/seeker/dashboard')
    }, 600)
  }

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-container">
        <Link to="/" className="auth-logo"><Logo /></Link>
        <h1 className="auth-title">Welcome back.</h1>
        <p className="auth-sub">Log in to pick up where you left off.</p>

        {/* Role tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-6)' }}>
          {[['seeker','Job Seeker'],['employer','Employer'],['admin','Admin']].map(([val, label]) => (
            <button
              key={val}
              className={`tab ${form.type === val ? 'tab--active' : ''}`}
              onClick={() => set('type', val)}
              style={{ flex: 1 }}
            >{label}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <a href="#" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Forgot password?</a>
            </div>
            <input
              className="form-input"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In →'}
          </button>
        </form>

        <div className="auth-social" style={{ marginTop: 'var(--space-5)' }}>
          <div className="auth-divider"><span>or continue with</span></div>
          <div className="social-btns">
            <button className="social-btn"><span>G</span> Google</button>
            <button className="social-btn"><span>in</span> LinkedIn</button>
          </div>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up Free</Link>
        </p>
      </div>
    </div>
  )
}
