import { qs, qsa, formatCurrency } from '../../lib/dom.js'
import { getDashboardStats, getJobsWithDetails, getDB, assignTechnician, updateJobStatus, findOrCreateCustomer, addJob, getServices } from '../../lib/store.js'
import { statCard } from '../components/statCard.js'
import { barChart } from '../components/chart.js'
import { activityFeed } from '../components/activityFeed.js'
import { renderTable, STATUS_OPTIONS, statusBadge } from '../components/table.js'
import { openModal } from '../../lib/modal.js'
import { showToast } from '../../lib/toast.js'

function jobColumns(technicians) {
  return [
    { label: 'Customer', render: (j) => `<div class="cell-person"><strong>${j.customer?.name ?? 'Unknown'}</strong><span>${j.customer?.phone ?? ''}</span></div>` },
    { label: 'Service', render: (j) => j.serviceInfo?.name ?? j.service },
    {
      label: 'Technician',
      render: (j) => `
        <select class="inline-select" data-assign="${j.id}">
          <option value="">Unassigned</option>
          ${technicians.map((t) => `<option value="${t.id}" ${t.id === j.technicianId ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>`,
    },
    {
      label: 'Status',
      render: (j) => `
        <select class="inline-select" data-status="${j.id}">
          ${STATUS_OPTIONS.map((s) => `<option value="${s.value}" ${s.value === j.status ? 'selected' : ''}>${s.label}</option>`).join('')}
        </select>`,
    },
    { label: 'Price', render: (j) => formatCurrency(j.price) },
  ]
}

export default function renderDashboard(mount) {
  const stats = getDashboardStats()
  const jobs = getJobsWithDetails()
  const technicians = getDB().technicians
  const activity = getDB().activity

  const utilRows = technicians.map((t) => ({ label: t.name, value: t.completedJobs }))

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Service Requests</h1>
          <p>Live view of incoming jobs, technician load and revenue.</p>
        </div>
        <div class="admin-toolbar">
          <div class="admin-search">
            <span>⌕</span>
            <input type="search" placeholder="Search jobs by customer or service" data-job-search />
          </div>
          <button class="btn btn--primary btn--sm" data-new-job>+ New Job</button>
        </div>
      </div>

      <div class="admin-grid">
        ${statCard('Jobs Today', stats.jobsToday)}
        ${statCard('Unassigned Requests', stats.unassigned)}
        ${statCard('Active Customers', stats.activeCustomers)}
        ${statCard('Revenue MTD', formatCurrency(stats.revenueMTD))}
      </div>

      <div class="admin-panel" style="margin-bottom:18px">
        <div class="admin-panel__head">
          <h2>Active Jobs</h2>
          <a href="#/jobs">View all →</a>
        </div>
        <div data-jobs-table></div>
      </div>

      <div class="admin-cols-2">
        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Technician Utilization</h2></div>
          ${barChart(utilRows)}
        </div>
        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Recent Activity</h2></div>
          ${activityFeed(activity)}
        </div>
      </div>
    </div>`

  function paintTable(filtered) {
    qs('[data-jobs-table]', mount).innerHTML = renderTable({
      columns: jobColumns(technicians),
      rows: filtered.slice(0, 8),
      emptyMessage: 'No jobs match your search.',
    })
    attachRowHandlers()
  }

  function attachRowHandlers() {
    qsa('[data-assign]', mount).forEach((select) => {
      select.addEventListener('change', () => {
        if (select.value) assignTechnician(select.dataset.assign, select.value)
      })
    })
    qsa('[data-status]', mount).forEach((select) => {
      select.addEventListener('change', () => updateJobStatus(select.dataset.status, select.value))
    })
  }

  paintTable(jobs)

  qs('[data-job-search]', mount).addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase()
    const filtered = jobs.filter(
      (j) => j.customer?.name.toLowerCase().includes(term) || (j.serviceInfo?.name ?? j.service).toLowerCase().includes(term)
    )
    paintTable(filtered)
  })

  qs('[data-new-job]', mount).addEventListener('click', () => {
    const services = getServices()
    openModal({
      title: 'Create a new job',
      submitLabel: 'Create job',
      content: `
        <div class="field"><label>Customer name</label><input name="name" required /></div>
        <div class="field"><label>Email</label><input name="email" type="email" required /></div>
        <div class="field"><label>Phone</label><input name="phone" required /></div>
        <div class="field"><label>Address</label><input name="address" required /></div>
        <div class="field"><label>Service</label>
          <select name="service">${services.map((s) => `<option value="${s.id}">${s.name}</option>`).join('')}</select>
        </div>
        <div class="field"><label>Notes</label><textarea name="notes"></textarea></div>`,
      onSubmit: (data) => {
        const service = services.find((s) => s.id === data.get('service'))
        const customer = findOrCreateCustomer({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          address: data.get('address'),
        })
        addJob({ customer, service: service.id, address: data.get('address'), notes: data.get('notes'), price: service.basePrice })
        showToast('Job created.')
      },
    })
  })
}
