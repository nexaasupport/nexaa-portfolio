import { qs, qsa, formatCurrency, formatDate } from '../../lib/dom.js'
import { getDB, markPaymentPaid } from '../../lib/store.js'
import { statCard } from '../components/statCard.js'
import { renderTable } from '../components/table.js'
import { showToast } from '../../lib/toast.js'

export default function renderPayments(mount) {
  const db = getDB()
  const paid = db.payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const pending = db.payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Payments</h1>
          <p>Payment records generated when a job is marked completed.</p>
        </div>
      </div>
      <div class="admin-grid" style="grid-template-columns:repeat(2,1fr)">
        ${statCard('Collected', formatCurrency(paid))}
        ${statCard('Outstanding', formatCurrency(pending))}
      </div>
      <div class="admin-panel"><div data-table></div></div>
    </div>`

  function paint() {
    const db2 = getDB()
    const rows = db2.payments.map((p) => ({
      ...p,
      customer: db2.customers.find((c) => c.id === p.customerId),
    }))

    qs('[data-table]', mount).innerHTML = renderTable({
      columns: [
        { label: 'Customer', render: (p) => p.customer?.name ?? 'Unknown' },
        { label: 'Amount', render: (p) => formatCurrency(p.amount) },
        { label: 'Method', render: (p) => p.method },
        { label: 'Date', render: (p) => formatDate(p.date) },
        { label: 'Status', render: (p) => `<span class="badge badge--${p.status}">${p.status === 'paid' ? 'Paid' : 'Pending'}</span>` },
        { label: '', render: (p) => (p.status === 'pending' ? `<button class="btn btn--ghost btn--sm" data-pay="${p.id}">Mark paid</button>` : '') },
      ],
      rows,
      emptyMessage: 'No payments yet — completed jobs generate a payment record automatically.',
    })

    qsa('[data-pay]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        markPaymentPaid(btn.dataset.pay)
        showToast('Payment marked as paid.')
        paint()
      })
    )
  }

  paint()
}
