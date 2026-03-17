import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Logo } from '../../components/ui/index.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Auth.css'

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Design', 'Marketing', 'Sales', 'Engineering', 'Education', 'Legal', 'Other']
const JOB_TYPES  = ['Full-time', 'Part-time', 'Contract', 'Freelance']
const SIZES = ['1–10', '11–50', '51–200', '201–500', '500+']

export default function RegisterPage() {
  const [params] = useSearchParams()
  const [type, setType] = useState(params.get('type') || null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validateSeeker1 = () => {
    const e = {}
    if (!form.name?.trim()) e.name = 'Full name is required'
    if (!form.email?.trim()) e.email = 'Email is required'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSeekerSubmit = async () => {
    if (step === 1 && !validateSeeker1()) return
    if (step < 3) { setStep(s => s + 1); return }
    setLoading(true)
    setTimeout(() => {
      register({ ...form, type: 'seeker' })
      navigate('/seeker/dashboard')
    }, 800)
  }

  const handleEmployerSubmit = async () => {
    if (step < 2) { setStep(s => s + 1); return }
    setLoading(true)
    setTimeout(() => {
      register({ ...form, type: 'employer' })
      navigate('/employer/dashboard')
    }, 800)
  }

  if (!type) {
    return (
      <div className="auth-page">
        <div className="auth-page__bg" />
        <div className="auth-container" style={{ maxWidth: 640 }}>
          <Link to="/" className="auth-logo"><Logo /></Link>
          <h1 className="auth-title">I am joining as a…</h1>
          <p className="auth-sub">Your path determines what we'll set up for you.</p>
          <div className="type-cards">
            <button className="type-card" onClick={() => setType('seeker')}>
              <div className="type-card__icon">🎯</div>
              <h3>Job Seeker</h3>
              <p>I'm looking for my next role. Build a profile, get matched with opportunities.</p>
              <span className="btn btn--primary btn--sm" style={{ marginTop: 'auto' }}>Get Started →</span>
            </button>
            <button className="type-card" onClick={() => setType('employer')}>
              <div className="type-card__icon">🏢</div>
              <h3>Employer</h3>
              <p>I'm hiring. Post roles, receive AI-matched candidates, hire faster.</p>
              <span className="btn btn--outline btn--sm" style={{ marginTop: 'auto' }}>Post a Job →</span>
            </button>
          </div>
          <p className="auth-footer">Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-container">
        <Link to="/" className="auth-logo"><Logo /></Link>

        {/* Progress */}
        <div className="register-progress">
          {(type === 'seeker' ? [1,2,3] : [1,2]).map(s => (
            <div key={s} className={`register-progress__step ${step >= s ? 'register-progress__step--active' : ''}`}>
              <div className="register-progress__dot">{step > s ? '✓' : s}</div>
              <span>{type === 'seeker'
                ? ['Account', 'Experience', 'Preferences'][s-1]
                : ['Company', 'Hiring needs'][s-1]
              }</span>
            </div>
          ))}
        </div>

        {type === 'seeker' ? (
          <SeekerForm step={step} form={form} set={set} errors={errors} />
        ) : (
          <EmployerForm step={step} form={form} set={set} />
        )}

        <div className="auth-actions">
          {step > 1 && <button className="btn btn--ghost" onClick={() => setStep(s => s - 1)}>← Back</button>}
          <button
            className="btn btn--primary"
            onClick={type === 'seeker' ? handleSeekerSubmit : handleEmployerSubmit}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Creating account…' : step < (type === 'seeker' ? 3 : 2) ? 'Continue →' : 'Create Account'}
          </button>
        </div>
        <p className="auth-footer">Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    </div>
  )
}

function SeekerForm({ step, form, set, errors }) {
  if (step === 1) return (
    <div className="auth-form">
      <h2>Create your account</h2>
      <p>You'll use these details to log in.</p>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input className="form-input" placeholder="Alex Johnson" value={form.name || ''} onChange={e => set('name', e.target.value)} />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input className="form-input" type="email" placeholder="alex@email.com" value={form.email || ''} onChange={e => set('email', e.target.value)} />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" placeholder="8+ characters" value={form.password || ''} onChange={e => set('password', e.target.value)} />
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>
      <div className="auth-social">
        <div className="auth-divider"><span>or sign up with</span></div>
        <div className="social-btns">
          <button className="social-btn"><span>G</span> Google</button>
          <button className="social-btn"><span>in</span> LinkedIn</button>
        </div>
      </div>
    </div>
  )

  if (step === 2) return (
    <div className="auth-form">
      <h2>Your experience</h2>
      <p>Help us find the best matches from day one.</p>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Current / Most Recent Role</label>
          <input className="form-input" placeholder="e.g. Product Designer" value={form.currentRole || ''} onChange={e => set('currentRole', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Years of Experience</label>
          <select className="form-select" value={form.experience || ''} onChange={e => set('experience', e.target.value)}>
            <option value="">Select</option>
            {['0–1', '1–3', '3–5', '5–8', '8–12', '12+'].map(y => <option key={y}>{y} years</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Key Skills (comma separated)</label>
        <input className="form-input" placeholder="e.g. Figma, React, Product Strategy" value={form.skills || ''} onChange={e => set('skills', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Industry</label>
        <select className="form-select" value={form.industry || ''} onChange={e => set('industry', e.target.value)}>
          <option value="">Select industry</option>
          {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
        </select>
      </div>
    </div>
  )

  return (
    <div className="auth-form">
      <h2>Your preferences</h2>
      <p>These shape every match Wira makes for you.</p>
      <div className="form-group">
        <label className="form-label">Job Type</label>
        <div className="checkbox-grid">
          {JOB_TYPES.map(t => (
            <label key={t} className={`checkbox-chip ${(form.jobTypes || []).includes(t) ? 'checkbox-chip--active' : ''}`}>
              <input type="checkbox" style={{ display: 'none' }}
                checked={(form.jobTypes || []).includes(t)}
                onChange={e => {
                  const curr = form.jobTypes || []
                  set('jobTypes', e.target.checked ? [...curr, t] : curr.filter(x => x !== t))
                }}
              />
              {t}
            </label>
          ))}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Min Salary (USD/yr)</label>
          <input className="form-input" type="number" placeholder="e.g. 80000" value={form.salaryMin || ''} onChange={e => set('salaryMin', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Max Salary</label>
          <input className="form-input" type="number" placeholder="e.g. 130000" value={form.salaryMax || ''} onChange={e => set('salaryMax', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Location</label>
        <input className="form-input" placeholder="City, Country or Remote" value={form.location || ''} onChange={e => set('location', e.target.value)} />
      </div>
    </div>
  )
}

function EmployerForm({ step, form, set }) {
  if (step === 1) return (
    <div className="auth-form">
      <h2>Tell us about your company</h2>
      <div className="form-group">
        <label className="form-label">Company Name</label>
        <input className="form-input" placeholder="Acme Corp" value={form.companyName || ''} onChange={e => set('companyName', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Industry</label>
          <select className="form-select" value={form.industry || ''} onChange={e => set('industry', e.target.value)}>
            <option value="">Select</option>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Company Size</label>
          <select className="form-select" value={form.size || ''} onChange={e => set('size', e.target.value)}>
            <option value="">Select</option>
            {SIZES.map(s => <option key={s}>{s} employees</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Your Email</label>
        <input className="form-input" type="email" placeholder="hr@company.com" value={form.email || ''} onChange={e => set('email', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" placeholder="8+ characters" value={form.password || ''} onChange={e => set('password', e.target.value)} />
      </div>
    </div>
  )

  return (
    <div className="auth-form">
      <h2>Hiring details</h2>
      <div className="form-group">
        <label className="form-label">What roles do you typically hire for?</label>
        <input className="form-input" placeholder="e.g. Engineers, Designers, Product Managers" value={form.hiringFor || ''} onChange={e => set('hiringFor', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Do you use an ATS?</label>
        <select className="form-select" value={form.ats || ''} onChange={e => set('ats', e.target.value)}>
          <option value="">None / not sure</option>
          {['Greenhouse', 'Lever', 'Workable', 'BambooHR', 'Ashby', 'Other'].map(a => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">How many hires do you plan in the next 6 months?</label>
        <select className="form-select" value={form.hireCount || ''} onChange={e => set('hireCount', e.target.value)}>
          <option value="">Select</option>
          {['1–5', '6–15', '16–30', '30+'].map(n => <option key={n}>{n}</option>)}
        </select>
      </div>
    </div>
  )
}
