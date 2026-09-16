import { qs, qsa, formatCurrency } from '../lib/dom.js'
import {
  getServices,
  getDB,
  rescheduleJob,
  cancelJob,
  getPaymentForJob,
  markPaymentPaid,
  getReviewForJob,
  addReview,
} from '../lib/store.js'
import { showToast } from '../lib/toast.js'
import { sendBookingEmail } from '../lib/email.js'
import { sendSms } from '../lib/sms.js'
import { renderCalendarPicker } from './calendarPicker.js'
import { printReceipt } from '../lib/receipt.js'

const DATE_TIME_FORMAT = { dateStyle: 'medium', timeStyle: 'short' }
const CANCEL_REASONS = ['Change of plans', 'Found another provider', 'Price concern', 'No longer needed', 'Other']

// Renders the reschedule/cancel/pay/review card for one booking. Shared by
// the anonymous guest lookup (#/track) and the logged-in "My Account"
// dashboard (#/account) — same job, same actions, same markup either way.
export function renderBookingCard(resultEl, job, customer) {
  const service = getServices().find((s) => s.id === job.service)
  const technician = job.technicianId ? getDB().technicians.find((t) => t.id === job.technicianId) : null
  const when = job.scheduledAt ? new Date(job.scheduledAt).toLocaleString('en-IN', DATE_TIME_FORMAT) : 'Not scheduled'
  const payment = getPaymentForJob(job.id)
  const review = getReviewForJob(job.id)

  const isFinal = job.status === 'cancelled' || job.status === 'completed'

  resultEl.innerHTML = `
    <div class="manage-booking__card">
      <h3>${service?.name ?? job.service}</h3>
      <p>${when} &middot; Status: ${job.status.replace('_', ' ')}</p>
      ${technician ? `<p class="manage-booking__technician">Technician: <strong>${technician.name}</strong> (${technician.specialty})${technician.rating ? ` &middot; ${technician.rating}★` : ''}</p>` : ''}
      ${job.status === 'cancelled' && job.cancellationReason ? `<p class="manage-booking__reason">Cancelled: ${job.cancellationReason}</p>` : ''}

      ${
        payment
          ? `<div class="manage-booking__invoice">
              <span>${payment.invoiceNumber || 'Invoice'} — ${formatCurrency(payment.amount)}</span>
              ${
                payment.status === 'paid'
                  ? '<span class="badge badge--paid">Paid</span><button type="button" class="btn btn--ghost btn--sm" data-print-receipt>Print receipt</button>'
                  : `<button type="button" class="btn btn--accent btn--sm" data-pay-now="${payment.id}">Pay Now</button>`
              }
            </div>`
          : ''
      }

      ${
        job.status === 'completed' && !review
          ? `<div class="manage-booking__review" data-review-form>
              <p class="manage-booking__label">Rate your service:</p>
              <div class="manage-booking__stars" data-star-picker>
                ${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="manage-booking__star" data-star="${n}">★</button>`).join('')}
              </div>
              <textarea data-review-comment placeholder="Tell us about the service (optional)"></textarea>
              <button type="button" class="btn btn--primary btn--sm" data-submit-review disabled>Submit review</button>
            </div>`
          : review
            ? `<p class="manage-booking__reviewed">You rated this job ${review.rating}★. Thanks for the feedback!</p>`
            : ''
      }

      ${
        !isFinal
          ? `<p class="manage-booking__label">Pick a new time to reschedule:</p>
             <div data-manage-reschedule></div>
             <div class="field"><label>Reason for cancelling (optional)</label>
               <select data-cancel-reason>
                 <option value="">Select a reason</option>
                 ${CANCEL_REASONS.map((r) => `<option value="${r}">${r}</option>`).join('')}
               </select>
             </div>
             <button type="button" class="btn btn--ghost" data-manage-cancel>Cancel booking</button>`
          : ''
      }
    </div>`

  if (payment && payment.status !== 'paid') {
    qs('[data-pay-now]', resultEl).addEventListener('click', (e) => {
      const btn = e.currentTarget
      btn.disabled = true
      btn.textContent = 'Processing…'
      setTimeout(() => {
        markPaymentPaid(payment.id, 'Card (simulated)')
        showToast('Payment successful.')
        renderBookingCard(resultEl, job, customer)
      }, 700)
    })
  } else if (payment) {
    qs('[data-print-receipt]', resultEl).addEventListener('click', () => {
      printReceipt({
        businessName: getDB().settings.businessName,
        invoiceNumber: payment.invoiceNumber,
        date: payment.date,
        customer,
        service: service?.name ?? job.service,
        subtotal: payment.subtotal ?? payment.amount,
        taxRate: payment.taxRate,
        taxAmount: payment.taxAmount,
        total: payment.amount,
        method: payment.method,
      })
    })
  }

  if (job.status === 'completed' && !review) {
    let selectedRating = 0
    const stars = qsa('[data-star]', resultEl)
    const submitBtn = qs('[data-submit-review]', resultEl)
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        selectedRating = Number(star.dataset.star)
        stars.forEach((s) => s.classList.toggle('is-filled', Number(s.dataset.star) <= selectedRating))
        submitBtn.disabled = false
      })
    })
    submitBtn.addEventListener('click', () => {
      addReview({ jobId: job.id, technicianId: job.technicianId, rating: selectedRating, comment: qs('[data-review-comment]', resultEl).value.trim() })
      showToast('Thanks for your review!')
      renderBookingCard(resultEl, job, customer)
    })
  }

  if (isFinal) return

  renderCalendarPicker(qs('[data-manage-reschedule]', resultEl), {
    serviceId: job.service,
    onSlotSelected: (iso) => {
      if (!iso) return
      const result = rescheduleJob(job.id, iso)
      if (!result.ok) {
        showToast(result.error)
        return
      }
      const when2 = new Date(iso).toLocaleString('en-IN')
      sendBookingEmail({
        type: 'reschedule',
        jobId: job.id,
        to: customer.email,
        subject: 'Your Nexaa Home booking was rescheduled',
        body: `New time: ${when2}.`,
      })
      sendSms({ type: 'reschedule', jobId: job.id, to: customer.phone, body: `Nexaa Home: your booking was moved to ${when2}.` })
      showToast('Booking rescheduled.')
      renderBookingCard(resultEl, result.job, customer)
    },
  })

  qs('[data-manage-cancel]', resultEl).addEventListener('click', () => {
    const reason = qs('[data-cancel-reason]', resultEl).value
    const result = cancelJob(job.id, reason)
    if (!result.ok) return
    sendBookingEmail({
      type: 'cancellation',
      jobId: job.id,
      to: customer.email,
      subject: 'Your Nexaa Home booking was cancelled',
      body: reason ? `Reason: ${reason}` : 'Your booking has been cancelled.',
    })
    sendSms({ type: 'cancellation', jobId: job.id, to: customer.phone, body: 'Nexaa Home: your booking has been cancelled.' })
    showToast('Booking cancelled.')
    renderBookingCard(resultEl, result.job, customer)
  })
}
