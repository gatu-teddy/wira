import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { Badge } from '../../components/ui/index.jsx'
import { mockEmployerJobs } from '../../utils/mockData.js'
import './Employer.css'

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState(mockEmployerJobs)

  const toggleStatus = (id) => setJobs(js => js.map(j =>
    j.id === id ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j
  ))

  const statusVariant = { active: 'success', paused: 'warning', closed: 'neutral' }

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Job Listings</h1>
          <p>Manage all your open, paused, and closed roles.</p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn--primary btn--sm">+ Post a Job</Link>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Status</th>
              <th>Applicants</th>
              <th>Matched</th>
              <th>Shortlisted</th>
              <th>Location</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="jobs-table-row">
                <td>
                  <div style={{ fontWeight: 700 }}>{job.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)' }}>${(job.salary.min/1000).toFixed(0)}k – ${(job.salary.max/1000).toFixed(0)}k</div>
                </td>
                <td><Badge variant={statusVariant[job.status]}>{job.status}</Badge></td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{job.applicants}</td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--clr-primary)' }}>{job.matched}</td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--clr-accent)' }}>{job.shortlisted}</td>
                <td style={{ color: 'var(--clr-text-secondary)' }}>{job.location}</td>
                <td style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>{job.posted}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn--ghost btn--sm">Edit</button>
                    {job.status !== 'closed' && (
                      <button className="btn btn--ghost btn--sm" onClick={() => toggleStatus(job.id)}>
                        {job.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
