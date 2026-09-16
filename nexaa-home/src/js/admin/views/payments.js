import { qs, qsa, formatCurrency, formatDate } from '../../lib/dom.js'
import { getDB, markPaymentPaid, getJobsWithDetails } from '../../lib/store.js'
import { statCard } from '../components/statCard.js'
import { renderTable } from '../components/table.js'
import { paginate, renderPagination, attachPagination } from '../components/pagination.js'
import { showToast } from '../../lib/toast.js'
import { icon } from '../components/icons.js'
import { printReceipt } from '../../lib/receipt.js'
import { animateCounters } from '../../lib/counter.js'

const PAGE_SIZE = 10

export default function renderPayments(mount) {
  let search = ''
  let page = 1

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Payments</h1>
          <p>Payment records generated when a job is marked completed.</p>
        </div>
        <div class="admin-toolbar">
          <div class="admin-search">${icon('search', { size: 16 })}<input type="search" placeholder="Search invoice or customer" aria-label="Search payments" data-search /></div>
        </div>
      </div>
      <div class="admin-grid admin-grid--2" data-stats></div>
      <div class="admin-panel">
        <div data-table></div>
        <div data-pagination></div>
      </div>
    </div>`

  function paintStats() {
    const db = getDB()
    const paid = db.payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    const pending = db.payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
    qs('[data-stats]', mount).innerHTML = `
      ${statCard('Collected', formatCurrency(paid), { icon: 'wallet' })}
      ${statCard('Outstanding', formatCurrency(pending), { icon: 'clock' })}`
    animateCounters(qs('[data-stats]', mount))
  }

  function paint() {
    paintStats()

    const db = getDB()
    const term = search.toLowerCase()
    const all = db.payments
      .map((p) => ({ ...p, customer: db.customers.find((c) => c.id === p.customerId) }))
      .filter((p) => !term || p.invoiceNumber?.toLowerCase().includes(term) || p.customer?.name.toLowerCase().includes(term))

    const { rows, pages, total } = paginate(all, page, PAGE_SIZE)

    qs('[data-table]', mount).innerHTML = renderTable({
      columns: [
        { label: 'Invoice', render: (p) => p.invoiceNumber || '—' },
        { label: 'Customer', render: (p) => p.customer?.name ?? 'Unknown' },
        { label: 'Subtotal', render: (p) => formatCurrency(p.subtotal ?? p.amount) },
        { label: 'GST', render: (p) => formatCurrency(p.taxAmount || 0) },
        { label: 'Total', render: (p) => formatCurrency(p.amount) },
        { label: 'Method', render: (p) => p.method },
        { label: 'Date', render: (p) => formatDate(p.date) },
        { label: 'Status', render: (p) => `<span class="badge badge--${p.status}">${p.status === 'paid' ? 'Paid' : 'Pending'}</span>` },
        {
          label: '',
          render: (p) => `
            <div class="data-table__actions">
              ${p.status === 'pending' ? `<button class="btn btn--ghost btn--sm" data-pay="${p.id}">Mark paid</button>` : ''}
              <button class="btn btn--ghost btn--sm" data-receipt="${p.id}">${icon('printer', { size: 14 })} Receipt</button>
            </div>`,
        },
      ],
      rows,
      emptyMessage: 'No payments yet — completed jobs generate a payment record automatically.',
    })
    qs('[data-pagination]', mount).innerHTML = renderPagination({ page, pages, total, pageSize: PAGE_SIZE })
    attachPagination(mount, { onChange: (p) => { page = p; paint() } })

    qsa('[data-pay]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        markPaymentPaid(btn.dataset.pay)
        showToast('Payment marked as paid.')
        paint()
      })
    )

    qsa('[data-receipt]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        const payment = rows.find((p) => p.id === btn.dataset.receipt)
        const job = getJobsWithDetails().find((j) => j.id === payment.jobId)
        printReceipt({
          businessName: db.settings.businessName,
          invoiceNumber: payment.invoiceNumber,
          date: payment.date,
          customer: payment.customer,
          service: job?.serviceInfo?.name ?? job?.service ?? 'Service',
          subtotal: payment.subtotal ?? payment.amount,
          taxRate: payment.taxRate,
          taxAmount: payment.taxAmount,
          total: payment.amount,
          method: payment.method,
        })
      })
    )
  }

  paint()

  qs('[data-search]', mount).addEventListener('input', (e) => { search = e.target.value.trim(); page = 1; paint() })
}
