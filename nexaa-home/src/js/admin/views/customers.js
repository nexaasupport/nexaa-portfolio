import { qs, qsa, formatCurrency, formatDate } from '../../lib/dom.js'
import { getDB, addCustomer, updateCustomer, getJobsWithDetails } from '../../lib/store.js'
import { renderTable, statusBadge } from '../components/table.js'
import { paginate, renderPagination, attachPagination } from '../components/pagination.js'
import { openModal } from '../../lib/modal.js'
import { showToast } from '../../lib/toast.js'
import { icon } from '../components/icons.js'

const PAGE_SIZE = 10

export default function renderCustomers(mount) {
  let search = ''
  let page = 1

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Customers</h1>
          <p>Everyone who has requested a service.</p>
        </div>
        <div class="admin-toolbar">
          <div class="admin-search">${icon('search', { size: 16 })}<input type="search" placeholder="Search name or email" aria-label="Search customers" data-search /></div>
          <button class="btn btn--primary btn--sm" data-add-customer>${icon('plus', { size: 16 })} Add Customer</button>
        </div>
      </div>
      <div class="admin-panel">
        <div data-table></div>
        <div data-pagination></div>
      </div>
    </div>`

  function paint() {
    const jobs = getJobsWithDetails()
    const term = search.toLowerCase()
    const all = getDB().customers
      .filter((c) => !term || c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
      .map((c) => {
        const theirJobs = jobs.filter((j) => j.customerId === c.id)
        const spend = theirJobs.filter((j) => j.status === 'completed').reduce((sum, j) => sum + j.price, 0)
        return { ...c, jobCount: theirJobs.length, spend }
      })

    const { rows, pages, total } = paginate(all, page, PAGE_SIZE)
    const byId = new Map(rows.map((c) => [c.id, c]))

    qs('[data-table]', mount).innerHTML = renderTable({
      columns: [
        { label: 'Customer', render: (c) => `<div class="cell-person"><strong>${c.name}</strong><span>${c.email}</span></div>` },
        { label: 'Phone', render: (c) => c.phone },
        { label: 'Address', render: (c) => c.address || '—' },
        { label: 'Jobs', render: (c) => c.jobCount },
        { label: 'Total spend', render: (c) => formatCurrency(c.spend) },
        { label: 'Customer since', render: (c) => formatDate(c.createdAt) },
        {
          label: '',
          render: (c) => `
            <div class="data-table__actions">
              <button class="btn btn--ghost btn--sm" data-view="${c.id}">View jobs</button>
              <button class="btn btn--ghost btn--sm" data-edit="${c.id}" aria-label="Edit customer">${icon('edit', { size: 14 })}</button>
            </div>`,
        },
      ],
      rows,
      emptyMessage: 'No customers yet — bookings from the public site will show up here.',
    })
    qs('[data-pagination]', mount).innerHTML = renderPagination({ page, pages, total, pageSize: PAGE_SIZE })
    attachPagination(mount, { onChange: (p) => { page = p; paint() } })

    qsa('[data-view]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        const theirJobs = jobs.filter((j) => j.customerId === btn.dataset.view)
        openModal({
          title: 'Job history',
          submitLabel: 'Close',
          content: theirJobs.length
            ? theirJobs.map((j) => `<div class="job-history-row">
                <span>${j.serviceInfo?.name ?? j.service}</span>${statusBadge(j.status)}</div>`).join('')
            : '<p>No jobs yet.</p>',
          onSubmit: () => {},
        })
      })
    )

    qsa('[data-edit]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        const customer = byId.get(btn.dataset.edit)
        openModal({
          title: 'Edit customer',
          submitLabel: 'Save changes',
          content: `
            <div class="field"><label>Name</label><input name="name" value="${customer.name}" required /></div>
            <div class="field"><label>Phone</label><input name="phone" value="${customer.phone}" required /></div>
            <div class="field"><label>Address</label><input name="address" value="${customer.address || ''}" /></div>`,
          onSubmit: (data) => {
            updateCustomer(customer.id, { name: data.get('name'), phone: data.get('phone'), address: data.get('address') })
            showToast('Customer updated.')
            paint()
          },
        })
      })
    )
  }

  paint()

  qs('[data-search]', mount).addEventListener('input', (e) => { search = e.target.value.trim(); page = 1; paint() })

  qs('[data-add-customer]', mount).addEventListener('click', () => {
    openModal({
      title: 'Add customer',
      submitLabel: 'Add customer',
      content: `
        <div class="field"><label>Name</label><input name="name" required /></div>
        <div class="field"><label>Email</label><input name="email" type="email" required /></div>
        <div class="field"><label>Phone</label><input name="phone" required /></div>
        <div class="field"><label>Address</label><input name="address" /></div>`,
      onSubmit: (data) => {
        addCustomer({ name: data.get('name'), email: data.get('email'), phone: data.get('phone'), address: data.get('address') })
        showToast('Customer added.')
        paint()
      },
    })
  })
}
