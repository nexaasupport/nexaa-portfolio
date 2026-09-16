import { qs, qsa } from '../../../lib/dom.js'
import { getDB } from '../../../lib/store.js'
import { getRememberedBookings } from '../../../lib/myBookings.js'
import { renderBookingCard } from '../../bookingCard.js'
import { isAuthenticated } from '../../../lib/customerAuth.js'

export default function renderTrackView(mount) {
  mount.innerHTML = `
    <div class="booking-page">
      <div class="booking-page__inner booking-page__inner--narrow">
        <a href="#top" class="booking-page__back"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Back to home</a>
        <div class="section__head">
          <span class="eyebrow">Booked as a guest?</span>
          <h2>Find your booking.</h2>
          <p>Look up a guest booking with your email and reference code${isAuthenticated() ? '' : ' — or <a href="#/login">log in</a> to see everything in one place'}.</p>
        </div>
        <div class="manage-booking__remembered" data-manage-remembered hidden></div>
        <form class="manage-booking__form" data-manage-lookup novalidate>
          <div class="field">
            <label for="mb-email">Email</label>
            <input id="mb-email" name="email" type="email" placeholder="jane@example.com" />
          </div>
          <div class="field">
            <label for="mb-ref">Reference code</label>
            <input id="mb-ref" name="reference" type="text" placeholder="job_xxxxxx" />
          </div>
          <button type="submit" class="btn btn--primary">Find booking</button>
        </form>
        <div data-manage-result hidden></div>
      </div>
    </div>`

  const lookupForm = qs('[data-manage-lookup]', mount)
  const resultEl = qs('[data-manage-result]', mount)
  const rememberedEl = qs('[data-manage-remembered]', mount)

  function lookup(email, reference) {
    const db = getDB()
    const job = db.jobs.find((j) => j.id === reference)
    const customer = job && db.customers.find((c) => c.id === job.customerId)

    resultEl.hidden = false
    if (!job || !customer || customer.email.toLowerCase() !== email.toLowerCase()) {
      resultEl.innerHTML = `<p class="manage-booking__error">No matching booking found. Double-check your email and reference code.</p>`
      return
    }
    renderBookingCard(resultEl, job, customer)
  }

  const remembered = getRememberedBookings()
  if (remembered.length) {
    rememberedEl.hidden = false
    rememberedEl.innerHTML = `
      <span class="manage-booking__remembered-label">Recent bookings on this device:</span>
      ${remembered
        .map((b) => `<button type="button" class="manage-booking__chip" data-remembered-ref="${b.jobId}" data-remembered-email="${b.email}">${b.jobId}</button>`)
        .join('')}`
    qsa('[data-remembered-ref]', rememberedEl).forEach((btn) => {
      btn.addEventListener('click', () => {
        lookupForm.elements.email.value = btn.dataset.rememberedEmail
        lookupForm.elements.reference.value = btn.dataset.rememberedRef
        lookup(btn.dataset.rememberedEmail, btn.dataset.rememberedRef)
      })
    })
  }

  lookupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    lookup(lookupForm.elements.email.value.trim(), lookupForm.elements.reference.value.trim())
  })
}
