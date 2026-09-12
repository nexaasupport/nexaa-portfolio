import { qs, qsa, formatCurrency, formatDate } from '../../lib/dom.js'
import { getDB, addCustomer, getJobsWithDetails } from '../../lib/store.js'
import { renderTable, statusBadge } from '../components/table.js'
import { openModal } from '../../lib/modal.js'
import { showToast } from '../../lib/toast.js'

export default function renderCustomers(mount) {
  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Customers</h1>
          <p>Everyone who has requested a service.</p>
        </div>
        <button class="btn btn--primary btn--sm" data-add-customer>+ Add Customer</button>
      </div>
      <div class="admin-panel"><div data-table></div></div>
    </div>`

  function paint() {
    const jobs = getJobsWithDetails()
    const customers = getDB().customers.map((c) => {
      const theirJobs = jobs.filter((j) => j.customerId === c.id)
      const spend = theirJobs.filter((j) => j.status === 'completed').reduce((sum, j) => sum + j.price, 0)
      return { ...c, jobCount: theirJobs.length, spend }
    })

    qs('[data-table]', mount).innerHTML = renderTable({
      columns: [
        { label: 'Customer', render: (c) => `<div class="cell-person"><strong>${c.name}</strong><span>${c.email}</span></div>` },
        { label: 'Phone', render: (c) => c.phone },
        { label: 'Address', render: (c) => c.address || '—' },
        { label: 'Jobs', render: (c) => c.jobCount },
        { label: 'Total spend', render: (c) => formatCurrency(c.spend) },
        { label: 'Customer since', render: (c) => formatDate(c.createdAt) },
        { label: '', render: (c) => `<button class="btn btn--ghost btn--sm" data-view="${c.id}">View jobs</button>` },
      ],
      rows: customers,
      emptyMessage: 'No customers yet — bookings from the public site will show up here.',
    })

    qsa('[data-view]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        const theirJobs = jobs.filter((j) => j.customerId === btn.dataset.view)
        openModal({
          title: 'Job history',
          submitLabel: 'Close',
          content: theirJobs.length
            ? theirJobs.map((j) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee">
                <span>${j.serviceInfo?.name ?? j.service}</span>${statusBadge(j.status)}</div>`).join('')
            : '<p>No jobs yet.</p>',
          onSubmit: () => {},
        })
      })
    )
  }

  paint()

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
