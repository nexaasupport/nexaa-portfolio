import { formatCurrency, formatDate } from './dom.js'

// Builds a print-only overlay and triggers window.print() — no PDF library
// needed. @media print in _receipt.scss hides everything else on the page.
export function printReceipt({ businessName, invoiceNumber, date, customer, service, subtotal, taxRate, taxAmount, total, method }) {
  const existing = document.getElementById('receipt-print-root')
  if (existing) existing.remove()

  const root = document.createElement('div')
  root.id = 'receipt-print-root'
  root.className = 'receipt-print'
  root.innerHTML = `
    <div class="receipt-print__card">
      <h2>${businessName}</h2>
      <p class="receipt-print__meta">Invoice ${invoiceNumber || '—'} &middot; ${formatDate(date)}</p>
      <hr />
      <p><strong>Billed to:</strong> ${customer?.name ?? ''}<br />${customer?.address ?? ''}<br />${customer?.email ?? ''}</p>
      <table class="receipt-print__table">
        <tbody>
          <tr><td>${service}</td><td>${formatCurrency(subtotal)}</td></tr>
          <tr><td>GST (${taxRate || 0}%)</td><td>${formatCurrency(taxAmount || 0)}</td></tr>
          <tr class="receipt-print__total"><td>Total</td><td>${formatCurrency(total)}</td></tr>
        </tbody>
      </table>
      <p class="receipt-print__method">Payment method: ${method || '—'}</p>
      <p class="receipt-print__thanks">Thank you for choosing ${businessName}.</p>
    </div>`

  document.body.append(root)
  window.print()
  setTimeout(() => root.remove(), 500)
}
