import { qs, qsa, formatCurrency, formatDate, formatDateTime } from '../../lib/dom.js'
import { getJobsWithDetails, getDB, assignTechnician, updateJobStatus, deleteJob, getServices } from '../../lib/store.js'
import { renderTable, STATUS_OPTIONS } from '../components/table.js'
import { paginate, renderPagination, attachPagination } from '../components/pagination.js'
import { openJobDetail } from '../components/jobDetail.js'
import { showToast } from '../../lib/toast.js'
import { icon } from '../components/icons.js'

const PAGE_SIZE = 10

export default function renderJobs(mount) {
  const technicians = getDB().technicians
  const services = getServices()
  let filters = { search: '', status: '', service: '', technician: '' }
  let page = 1

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Jobs</h1>
          <p>All service requests across every status.</p>
        </div>
        <div class="admin-toolbar">
          <div class="admin-search">${icon('search', { size: 16 })}<input type="search" placeholder="Search customer or service" aria-label="Search jobs" data-search /></div>
          <select class="inline-select" aria-label="Filter by status" data-filter-status>
            <option value="">All statuses</option>
            ${STATUS_OPTIONS.map((s) => `<option value="${s.value}">${s.label}</option>`).join('')}
          </select>
          <select class="inline-select" aria-label="Filter by service" data-filter-service>
            <option value="">All services</option>
            ${services.map((s) => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
          <select class="inline-select" aria-label="Filter by technician" data-filter-tech>
            <option value="">All technicians</option>
            ${technicians.map((t) => `<option value="${t.id}">${t.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="admin-panel">
        <div data-table></div>
        <div data-pagination></div>
      </div>
    </div>`

  function columns(jobsById) {
    return [
      { label: 'Customer', render: (j) => `<div class="cell-person"><strong>${j.customer?.name ?? 'Unknown'}</strong><span>${j.address}</span></div>` },
      { label: 'Service', render: (j) => j.serviceInfo?.name ?? j.service },
      { label: 'Requested', render: (j) => formatDate(j.createdAt) },
      { label: 'Scheduled', render: (j) => formatDateTime(j.scheduledAt) },
      {
        label: 'Technician',
        render: (j) => `
          <select class="inline-select" aria-label="Assign technician" data-assign="${j.id}">
            <option value="">Unassigned</option>
            ${technicians.map((t) => `<option value="${t.id}" ${t.id === j.technicianId ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>`,
      },
      {
        label: 'Status',
        render: (j) => `
          <select class="inline-select" aria-label="Job status" data-status="${j.id}">
            ${STATUS_OPTIONS.map((s) => `<option value="${s.value}" ${s.value === j.status ? 'selected' : ''}>${s.label}</option>`).join('')}
          </select>`,
      },
      { label: 'Price', render: (j) => formatCurrency(j.price) },
      {
        label: '',
        render: (j) => `
          <div class="data-table__actions">
            <button class="btn btn--ghost btn--sm" data-view="${j.id}" aria-label="View details">${icon('eye', { size: 14 })}</button>
            <button class="btn btn--ghost btn--sm" data-delete="${j.id}" aria-label="Remove job">${icon('trash', { size: 14 })}</button>
          </div>`,
      },
    ]
  }

  function paint() {
    const term = filters.search.toLowerCase()
    const filtered = getJobsWithDetails().filter((j) => {
      const matchesSearch = !term || j.customer?.name.toLowerCase().includes(term) || (j.serviceInfo?.name ?? j.service).toLowerCase().includes(term)
      const matchesStatus = !filters.status || j.status === filters.status
      const matchesService = !filters.service || j.service === filters.service
      const matchesTech = !filters.technician || j.technicianId === filters.technician
      return matchesSearch && matchesStatus && matchesService && matchesTech
    })

    const { rows, pages, total } = paginate(filtered, page, PAGE_SIZE)
    const byId = new Map(rows.map((j) => [j.id, j]))

    qs('[data-table]', mount).innerHTML = renderTable({ columns: columns(byId), rows, emptyMessage: 'No jobs match these filters.' })
    qs('[data-pagination]', mount).innerHTML = renderPagination({ page, pages, total, pageSize: PAGE_SIZE })
    attachPagination(mount, { onChange: (p) => { page = p; paint() } })

    qsa('[data-assign]', mount).forEach((el) => el.addEventListener('change', () => el.value && assignTechnician(el.dataset.assign, el.value)))
    qsa('[data-status]', mount).forEach((el) => el.addEventListener('change', () => updateJobStatus(el.dataset.status, el.value)))
    qsa('[data-view]', mount).forEach((el) => el.addEventListener('click', () => openJobDetail(byId.get(el.dataset.view))))
    qsa('[data-delete]', mount).forEach((el) =>
      el.addEventListener('click', () => {
        deleteJob(el.dataset.delete)
        showToast('Job removed.')
        paint()
      })
    )
  }

  paint()

  qs('[data-search]', mount).addEventListener('input', (e) => { filters.search = e.target.value.trim(); page = 1; paint() })
  qs('[data-filter-status]', mount).addEventListener('change', (e) => { filters.status = e.target.value; page = 1; paint() })
  qs('[data-filter-service]', mount).addEventListener('change', (e) => { filters.service = e.target.value; page = 1; paint() })
  qs('[data-filter-tech]', mount).addEventListener('change', (e) => { filters.technician = e.target.value; page = 1; paint() })
}
