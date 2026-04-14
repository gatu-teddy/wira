import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../ui/index.jsx'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>AI-powered talent matching that brings the right opportunities to you — automatically.</p>
        </div>

        <div className="footer__col">
          <h6>Platform</h6>
          <ul>
            <li><Link to="/register?type=seeker">For Job Seekers</Link></li>
            <li><Link to="/register?type=employer">For Employers</Link></li>
            <li><Link to="/integrations">Integrations</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h6>Company</h6>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h6>Legal</h6>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Wira. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
