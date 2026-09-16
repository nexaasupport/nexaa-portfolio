import { formatCurrency, formatDateTime } from '../../lib/dom.js'
import { getPaymentForJob, getReviewForJob } from '../../lib/store.js'
import { openModal } from '../../lib/modal.js'
import { statusBadge } from './table.js'

function row(label, value) {
  if (!value) return ''
  return `<div class="job-detail__row"><span>${label}</span><strong>${value}</strong></div>`
}

export function openJobDetail(job) {
  const payment = getPaymentForJob(job.id)
  const review = getReviewForJob(job.id)

  openModal({
    title: job.serviceInfo?.name ?? job.service,
    submitLabel: 'Close',
    onSubmit: () => true,
    content: `
      <div class="job-detail">
        <div class="job-detail__head">
          ${statusBadge(job.status)}
          <span class="job-detail__ref">Ref: ${job.id}</span>
        </div>

        <div class="job-detail__section">
          <h4>Customer</h4>
          ${row('Name', job.customer?.name)}
          ${row('Phone', job.customer?.phone)}
          ${row('Email', job.customer?.email)}
          ${row('Address', `${job.address}${job.pincode ? ` — ${job.pincode}` : ''}`)}
        </div>

        <div class="job-detail__section">
          <h4>Service</h4>
          ${row('Technician', job.technician ? `${job.technician.name} (${job.technician.specialty})` : 'Unassigned')}
          ${row('Scheduled', formatDateTime(job.scheduledAt))}
          ${row('Duration', job.durationMinutes ? `${job.durationMinutes} min` : null)}
          ${row('Notes', job.notes)}
        </div>

        <div class="job-detail__section">
          <h4>Pricing</h4>
          ${row('Base price', formatCurrency(job.price))}
          ${row(`GST (${job.gstRate || 0}%)`, formatCurrency(job.taxAmount || 0))}
          ${row('Total', formatCurrency(job.total ?? job.price))}
          ${payment ? row('Payment', `${payment.invoiceNumber} — ${payment.status === 'paid' ? 'Paid' : 'Pending'}`) : ''}
        </div>

        <div class="job-detail__section">
          <h4>Timeline</h4>
          ${row('Requested', formatDateTime(job.createdAt))}
          ${row('Assigned', formatDateTime(job.assignedAt))}
          ${row('Started', formatDateTime(job.startedAt))}
          ${row('Completed', formatDateTime(job.completedAt))}
          ${job.status === 'cancelled' ? row('Cancelled', formatDateTime(job.cancelledAt)) : ''}
          ${job.cancellationReason ? row('Reason', job.cancellationReason) : ''}
        </div>

        ${review ? `<div class="job-detail__section"><h4>Review</h4>${row('Rating', `${review.rating}★`)}${row('Comment', review.comment)}</div>` : ''}
      </div>`,
  })
}
