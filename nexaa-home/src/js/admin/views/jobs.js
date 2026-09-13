import { qs, qsa, formatCurrency, formatDate } from '../../lib/dom.js'
import { getJobsWithDetails, getDB, assignTechnician, updateJobStatus, deleteJob, getServices } from '../../lib/store.js'
import { renderTable, STATUS_OPTIONS } from '../components/table.js'
import { showToast } from '../../lib/toast.js'

export default function renderJobs(mount) {
  const technicians = getDB().technicians
  const services = getServices()
  let filters = { search: '', status: '', service: '', technician: '' }

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Jobs</h1>
          <p>All service requests across every status.</p>
        </div>
        <div class="admin-toolbar">
          <div class="admin-search"><span>⌕</span><input type="search" placeholder="Search customer or service" data-search /></div>
          <select class="inline-select" data-filter-status>
            <option value="">All statuses</option>
            ${STATUS_OPTIONS.map((s) => `<option value="${s.value}">${s.label}</option>`).join('')}
          </select>
          <select class="inline-select" data-filter-service>
            <option value="">All services</option>
            ${services.map((s) => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
          <select class="inline-select" data-filter-tech>
            <option value="">All technicians</option>
            ${technicians.map((t) => `<option value="${t.id}">${t.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="admin-panel"><div data-table></div></div>
    </div>`

  function columns() {
    return [
      { label: 'Customer', render: (j) => `<div class="cell-person"><strong>${j.customer?.name ?? 'Unknown'}</strong><span>${j.address}</span></div>` },
      { label: 'Service', render: (j) => j.serviceInfo?.name ?? j.service },
      { label: 'Requested', render: (j) => formatDate(j.createdAt) },
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
      { label: '', render: (j) => `<button class="btn btn--ghost btn--sm" data-delete="${j.id}">Remove</button>` },
    ]
  }

  function paint() {
    const term = filters.search.toLowerCase()
    const rows = getJobsWithDetails().filter((j) => {
      const matchesSearch = !term || j.customer?.name.toLowerCase().includes(term) || (j.serviceInfo?.name ?? j.service).toLowerCase().includes(term)
      const matchesStatus = !filters.status || j.status === filters.status
      const matchesService = !filters.service || j.service === filters.service
      const matchesTech = !filters.technician || j.technicianId === filters.technician
      return matchesSearch && matchesStatus && matchesService && matchesTech
    })

    qs('[data-table]', mount).innerHTML = renderTable({ columns: columns(), rows, emptyMessage: 'No jobs match these filters.' })

    qsa('[data-assign]', mount).forEach((el) => el.addEventListener('change', () => el.value && assignTechnician(el.dataset.assign, el.value)))
    qsa('[data-status]', mount).forEach((el) => el.addEventListener('change', () => updateJobStatus(el.dataset.status, el.value)))
    qsa('[data-delete]', mount).forEach((el) =>
      el.addEventListener('click', () => {
        deleteJob(el.dataset.delete)
        showToast('Job removed.')
        paint()
      })
    )
  }

  paint()

  qs('[data-search]', mount).addEventListener('input', (e) => { filters.search = e.target.value.trim(); paint() })
  qs('[data-filter-status]', mount).addEventListener('change', (e) => { filters.status = e.target.value; paint() })
  qs('[data-filter-service]', mount).addEventListener('change', (e) => { filters.service = e.target.value; paint() })
  qs('[data-filter-tech]', mount).addEventListener('change', (e) => { filters.technician = e.target.value; paint() })
}
