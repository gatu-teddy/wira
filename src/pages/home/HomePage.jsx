import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import './Home.css'

// ── Word-by-word slide-up reveal ─────────────────────────
function WordReveal({ children, baseDelay = 0.2 }) {
  const words = children.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="word-reveal">
          <span
            className="word-reveal__inner"
            style={{ animationDelay: `${(baseDelay + i * 0.1).toFixed(2)}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 && '\u00a0'}
        </span>
      ))}
    </>
  )
}

// ── EQ bar data (deterministic mountain shape) ───────────
const BAR_COUNT = 32
const EQ_BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const center = (BAR_COUNT - 1) / 2
  const dist = Math.abs(i - center) / center
  const baseH = Math.round((1 - dist * 0.75) * 88)
  const speed = (0.75 + (i % 7) * 0.17).toFixed(2)
  const delay = ((i * 0.09) % 1.5).toFixed(2)
  return { baseH, speed, delay }
})

const STEPS_SEEKER = [
  { n: '01', title: 'Build Your Profile', desc: 'Add your skills, experience, and preferences once. Your profile is the engine behind every match.' },
  { n: '02', title: 'Get Matched', desc: 'Our AI continuously surfaces roles aligned with your goals, salary expectations, and work style.' },
  { n: '03', title: 'Get Hired', desc: 'Connect directly with employers, move through the pipeline, and land your next role.' },
]

const STEPS_EMPLOYER = [
  { n: '01', title: 'Post or Sync Roles', desc: 'Create jobs manually or sync automatically from your ATS \u2014 Greenhouse, Lever, Workable, and more.' },
  { n: '02', title: 'Receive Matches', desc: "Wira's AI sends you a curated shortlist of candidates who are genuinely aligned with your role." },
  { n: '03', title: 'Hire Faster', desc: 'Review profiles, message candidates, and push updates back to your ATS \u2014 all in one place.' },
]

const ATS_LIST = ['Greenhouse', 'Lever', 'Workable', 'BambooHR', 'Ashby', 'Teamtailor']

const TESTIMONIALS = [
  { quote: 'Wira sent me three interviews without me applying to a single job. I accepted an offer within three weeks.', name: 'Priya S.', role: 'Senior Designer' },
  { quote: 'Our time-to-hire dropped by 40% after we integrated Wira. The match quality is genuinely impressive.', name: 'Tom A.', role: 'Head of Talent @ TechCorp' },
  { quote: "I was skeptical, but the AI actually understands what I'm looking for. Every recommendation felt right.", name: 'David O.', role: 'Software Engineer' },
]

export default function HomePage() {
  const [tab, setTab] = useState('seeker')
  const steps = tab === 'seeker' ? STEPS_SEEKER : STEPS_EMPLOYER

  return (
    <div className="home">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="hero">
        {/* Gradient glow orb */}
        <div className="hero__bg" aria-hidden />
        <div className="hero__glow" aria-hidden />

        {/* EQ bars */}
        <div className="hero__eq" aria-hidden>
          {EQ_BARS.map((bar, i) => (
            <div
              key={i}
              className="hero__eq-bar"
              style={{
                height: `${bar.baseH}%`,
                '--speed': `${bar.speed}s`,
                '--delay': `${bar.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="container hero__content">
          <div className="hero__eyebrow animate-fade-in">
            <span className="hero__eyebrow-dot" />
            AI-powered talent matching
          </div>

          <h1 className="hero__headline">
            <span className="hero__headline-line">
              <WordReveal baseDelay={0.3}>Work that</WordReveal>
            </span>
            <br />
            <span className="hero__headline-accent hero__headline-line">
              <WordReveal baseDelay={0.55}>finds you.</WordReveal>
            </span>
          </h1>

          <p className="hero__sub animate-fade-in-up" style={{ animationDelay: '0.85s' }}>
            Wira\u2019s AI matches your profile with the right roles \u2014 automatically.<br className="br-md" />
            No more endless applications.
          </p>

          <div className="hero__ctas animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <Link to="/register?type=seeker" className="btn btn--primary btn--lg">Create Your Profile</Link>
            <Link to="/register?type=employer" className="btn btn--outline btn--lg">Post a Job</Link>
          </div>

          <div className="hero__social-proof animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
            <div className="hero__avatars">
              {['PK','SO','AJ','LR','ZM'].map(i => (
                <div key={i} className="hero__avatar">{i}</div>
              ))}
            </div>
            <p><strong>12,000+</strong> job seekers matched this month</p>
          </div>
        </div>

        {/* Floating stats */}
        <div className="hero__float hero__float--1 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="hero__float-icon">\u2736</div>
          <div>
            <div className="hero__float-value">94%</div>
            <div className="hero__float-label">Match accuracy</div>
          </div>
        </div>
        <div className="hero__float hero__float--2 animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
          <div className="hero__float-icon">\u26a1</div>
          <div>
            <div className="hero__float-value">14 days</div>
            <div className="hero__float-label">Avg. time to hire</div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">How it works</span>
            <h2>One platform, two journeys.</h2>
            <p>Wira is built for both sides of the hiring equation.</p>
          </div>

          <div className="how-tabs">
            <button className={`how-tab ${tab === 'seeker' ? 'how-tab--active' : ''}`} onClick={() => setTab('seeker')}>For Job Seekers</button>
            <button className={`how-tab ${tab === 'employer' ? 'how-tab--active' : ''}`} onClick={() => setTab('employer')}>For Employers</button>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={step.n} className={`step-card animate-fade-in-up stagger-${i + 1}`}>
                <div className="step-card__num">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Why Wira</span>
            <h2>Built different, by design.</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card feature-card--large">
              <div className="feature-card__icon">\uD83C\uDFAF</div>
              <h3>Salary transparency \u2014 always</h3>
              <p>Every role on Wira includes a defined salary range. No more wasted interviews over misaligned expectations. See compensation upfront, every time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">\uD83E\uDD16</div>
              <h3>AI compatibility scores</h3>
              <p>Every match comes with a score showing exactly why a role was recommended \u2014 skills, experience, preferences, salary.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">\uD83D\uDD17</div>
              <h3>Deep ATS integration</h3>
              <p>Connect Greenhouse, Lever, Workable, and more. Wira enhances your workflow \u2014 it doesn\u2019t replace it.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">\uD83D\uDCAC</div>
              <h3>Direct messaging</h3>
              <p>Candidates and employers communicate in-platform. Everything centralised, no more scattered email threads.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">\uD83C\uDFE2</div>
              <h3>Rich company profiles</h3>
              <p>Culture, benefits, DEI commitments, team vibes. Help candidates choose you, not just the role.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ATS STRIP ─────────────────────────────────────── */}
      <section className="ats-strip">
        <div className="container">
          <p className="ats-strip__label">Works with your existing tools</p>
          <div className="ats-strip__logos">
            {ATS_LIST.map(ats => (
              <div key={ats} className="ats-chip">{ats}</div>
            ))}
            <div className="ats-chip ats-chip--more">+ More</div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What people say</span>
            <h2>Real results, real people.</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-card animate-fade-in-up stagger-${i + 1}`}>
                <div className="testimonial-card__quote">\u275D</div>
                <p>\u201c{t.quote}\u201d</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready for work that finds you?</h2>
            <p>Join thousands of professionals who\u2019ve stopped chasing jobs \u2014 and started receiving them.</p>
            <div className="cta-card__btns">
              <Link to="/register?type=seeker" className="btn btn--primary btn--lg">Get Started Free</Link>
              <Link to="/register?type=employer" className="btn btn--outline btn--lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>I\u2019m Hiring</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
