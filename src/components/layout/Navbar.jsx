import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../ui/index.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.type === 'employer') return '/employer/dashboard'
    if (user.type === 'admin') return '/admin/dashboard'
    return '/seeker/dashboard'
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <Logo />
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a></li>
          <li><Link to="/for-employers" onClick={() => setMenuOpen(false)}>For Employers</Link></li>
          <li><Link to="/integrations" onClick={() => setMenuOpen(false)}>Integrations</Link></li>
        </ul>

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to={getDashboardPath()} className="btn btn--ghost btn--sm">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn--outline btn--sm">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">Log In</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Get Started</Link>
            </>
          )}
        </div>

        <button className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
