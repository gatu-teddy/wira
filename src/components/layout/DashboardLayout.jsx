import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logo, Avatar } from '../ui/index.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './DashboardLayout.css'

function NavItem({ to, icon, label, badge }) {
  const location = useLocation()
  const active = location.pathname === to || location.pathname.startsWith(to + '/')
  return (
    <Link to={to} className={`sidebar__nav-item ${active ? 'sidebar__nav-item--active' : ''}`}>
      <span className="sidebar__nav-icon">{icon}</span>
      <span className="sidebar__nav-label">{label}</span>
      {badge && <span className="sidebar__nav-badge">{badge}</span>}
    </Link>
  )
}

function SeekerNav() {
  return (
    <>
      <span className="sidebar__nav-section">Overview</span>
      <NavItem to="/seeker/dashboard" icon={<DashIcon />} label="Dashboard" />
      <NavItem to="/seeker/matches" icon={<StarIcon />} label="My Matches" badge="5" />
      <NavItem to="/seeker/applications" icon={<DocIcon />} label="Applications" />
      <span className="sidebar__nav-section">Profile</span>
      <NavItem to="/seeker/profile" icon={<UserIcon />} label="My Profile" />
      <span className="sidebar__nav-section">Communication</span>
      <NavItem to="/seeker/messages" icon={<MsgIcon />} label="Messages" badge="2" />
      <NavItem to="/seeker/jobs" icon={<SearchIcon />} label="Job Search" />
    </>
  )
}

function EmployerNav() {
  return (
    <>
      <span className="sidebar__nav-section">Overview</span>
      <NavItem to="/employer/dashboard" icon={<DashIcon />} label="Dashboard" />
      <NavItem to="/employer/candidates" icon={<PeopleIcon />} label="Candidates" badge="8" />
      <NavItem to="/employer/jobs" icon={<BriefcaseIcon />} label="Job Listings" />
      <span className="sidebar__nav-section">Tools</span>
      <NavItem to="/employer/pipeline" icon={<PipelineIcon />} label="Pipeline" />
      <NavItem to="/employer/messages" icon={<MsgIcon />} label="Messages" />
      <NavItem to="/employer/integrations" icon={<IntegIcon />} label="ATS Integrations" />
      <span className="sidebar__nav-section">Account</span>
      <NavItem to="/employer/company" icon={<BuildingIcon />} label="Company Profile" />
    </>
  )
}

function AdminNav() {
  return (
    <>
      <span className="sidebar__nav-section">Admin</span>
      <NavItem to="/admin/dashboard" icon={<DashIcon />} label="Dashboard" />
      <NavItem to="/admin/users" icon={<PeopleIcon />} label="Users" />
      <NavItem to="/admin/employers" icon={<BuildingIcon />} label="Employers" />
      <NavItem to="/admin/analytics" icon={<ChartIcon />} label="Analytics" />
      <NavItem to="/admin/moderation" icon={<ShieldIcon />} label="Moderation" />
    </>
  )
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    navigate('/login')
    return null
  }

  const handleLogout = () => { logout(); navigate('/') }

  const roleLabel = { seeker: 'Job Seeker', employer: 'Employer', admin: 'Admin' }[user.type]
  const roleColor = { seeker: 'var(--clr-primary)', employer: 'var(--clr-accent)', admin: 'var(--clr-accent-warm)' }[user.type]

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <Logo size="sm" />
          </Link>
        </div>

        <nav className="sidebar__nav">
          {user.type === 'seeker'   && <SeekerNav />}
          {user.type === 'employer' && <EmployerNav />}
          {user.type === 'admin'    && <AdminNav />}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <Avatar name={user.name} size="sm" />
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user.name}</div>
              <div className="sidebar__user-role" style={{ color: roleColor }}>{roleLabel}</div>
            </div>
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            <LogoutIcon /> Log out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {/* Mobile header */}
        <div className="mobile-topbar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MenuIcon />
          </button>
          <Logo size="sm" />
        </div>
        {children}
      </main>
    </div>
  )
}

// ─── SVG Icons ────────────────────────────────────────────────────
const I = (d) => () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
)

const DashIcon = I(<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>)
const StarIcon = I(<><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></>)
const DocIcon = I(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></>)
const UserIcon = I(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>)
const MsgIcon = I(<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>)
const SearchIcon = I(<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>)
const PeopleIcon = I(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>)
const BriefcaseIcon = I(<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>)
const PipelineIcon = I(<><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></>)
const IntegIcon = I(<><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></>)
const BuildingIcon = I(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>)
const ChartIcon = I(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>)
const ShieldIcon = I(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>)
const LogoutIcon = I(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></>)
const MenuIcon = I(<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>)
