import { qs, qsa, formatCurrency } from '../../../lib/dom.js'
import { findOrCreateCustomer, bookJob, getServices, getDB, isServedPincode } from '../../../lib/store.js'
import { showToast } from '../../../lib/toast.js'
import { sendBookingEmail } from '../../../lib/email.js'
import { sendSms } from '../../../lib/sms.js'
import { renderCalendarPicker } from '../../calendarPicker.js'
import { rememberBooking } from '../../../lib/myBookings.js'
import { isAuthenticated } from '../../../lib/customerAuth.js'
import { icon } from '../../icons.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s-]{7,}$/
const PINCODE_RE = /^\d{6}$/
const DATE_TIME_FORMAT = { dateStyle: 'medium', timeStyle: 'short' }

function setError(field, message) {
  const wrap = field.closest('.field')
  wrap.classList.toggle('has-error', Boolean(message))
  let errorEl = wrap.querySelector('.field-error')
  if (!errorEl) {
    errorEl = document.createElement('div')
    errorEl.className = 'field-error'
    wrap.append(errorEl)
  }
  errorEl.textContent = message || ''
}

function validate(form) {
  let valid = true
  const { name, email, phone, service, address, pincode } = form.elements

  if (!name.value.trim()) { setError(name, 'Please enter your name.'); valid = false } else setError(name, '')
  if (!EMAIL_RE.test(email.value.trim())) { setError(email, 'Enter a valid email address.'); valid = false } else setError(email, '')
  if (!PHONE_RE.test(phone.value.trim())) { setError(phone, 'Enter a valid phone number.'); valid = false } else setError(phone, '')
  if (!service.value) { setError(service, 'Please choose a service.'); valid = false } else setError(service, '')
  if (!address.value.trim()) { setError(address, 'Please enter your address.'); valid = false } else setError(address, '')

  if (!PINCODE_RE.test(pincode.value.trim())) {
    setError(pincode, 'Enter a valid 6-digit pincode.')
    valid = false
  } else if (!isServedPincode(pincode.value.trim())) {
    setError(pincode, "Sorry, we don't service this area yet.")
    valid = false
  } else {
    setError(pincode, '')
  }

  return valid
}

function renderQuote(quoteEl, service) {
  if (!service) {
    quoteEl.hidden = true
    return
  }
  const tax = Math.round(service.basePrice * ((service.gstRate || 0) / 100))
  quoteEl.hidden = false
  quoteEl.innerHTML = `
    <div class="booking-form__quote-row"><span>${service.name}</span><span>${formatCurrency(service.basePrice)}</span></div>
    <div class="booking-form__quote-row"><span>GST (${service.gstRate || 0}%)</span><span>${formatCurrency(tax)}</span></div>
    <div class="booking-form__quote-row booking-form__quote-row--total"><span>Total</span><span>${formatCurrency(service.basePrice + tax)}</span></div>`
}

export default function renderBookView(mount) {
  const services = getServices()

  mount.innerHTML = `
    <div class="booking-page">
      <div class="booking-page__inner">
        <a href="#top" class="booking-page__back"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Back to home</a>
        <div class="section__head">
          <span class="eyebrow">Get a quote</span>
          <h2>Book a service now.</h2>
          <p>Tell us what's going on — we'll match you with the right pro and confirm a time.</p>
        </div>
        <div class="booking__grid">
          <div class="booking__points">
            <div class="booking__point"><span class="booking__point-icon">${icon('check', 16)}</span> Matched with a vetted pro in under 30 minutes</div>
            <div class="booking__point"><span class="booking__point-icon">${icon('check', 16)}</span> Upfront pricing, no surprise call-out fees</div>
            <div class="booking__point"><span class="booking__point-icon">${icon('check', 16)}</span> Pay only after the job is done</div>
          </div>
          <div class="booking-form">
            <div class="booking-form__steps" data-booking-stepper>
              <span class="booking-form__step is-active" data-step-indicator="1">1. Details</span>
              <span class="booking-form__step" data-step-indicator="2">2. Schedule</span>
              <span class="booking-form__step" data-step-indicator="3">3. Confirm</span>
            </div>
            <div data-booking-fields>
              <form data-booking-form novalidate>
                <div class="booking-form__grid">
                  <div class="field">
                    <label for="bf-name">Full name</label>
                    <input id="bf-name" name="name" type="text" placeholder="Jane Doe" />
                  </div>
                  <div class="field">
                    <label for="bf-phone">Phone number</label>
                    <input id="bf-phone" name="phone" type="tel" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div class="booking-form__grid">
                  <div class="field">
                    <label for="bf-email">Email</label>
                    <input id="bf-email" name="email" type="email" placeholder="jane@example.com" />
                  </div>
                  <div class="field">
                    <label for="bf-service">Service needed</label>
                    <select id="bf-service" name="service">${services.map((s) => `<option value="${s.id}">${s.name}</option>`).join('')}</select>
                  </div>
                </div>
                <div class="booking-form__grid">
                  <div class="field">
                    <label for="bf-address">Address</label>
                    <input id="bf-address" name="address" type="text" placeholder="Street, city" />
                  </div>
                  <div class="field">
                    <label for="bf-pincode">Pincode</label>
                    <input id="bf-pincode" name="pincode" type="text" inputmode="numeric" placeholder="600001" />
                  </div>
                </div>
                <div class="field" style="margin-bottom:20px">
                  <label for="bf-notes">Tell us more (optional)</label>
                  <textarea id="bf-notes" name="notes" placeholder="What needs to be done?"></textarea>
                </div>
                <button type="submit" class="btn btn--accent" style="width:100%">Continue to schedule →</button>
              </form>
            </div>
            <div data-booking-schedule hidden>
              <div data-calendar-picker></div>
              <div class="booking-form__quote" data-booking-quote hidden></div>
              <div class="booking-form__schedule-actions">
                <button type="button" class="btn btn--ghost" data-schedule-back>← Back</button>
                <button type="button" class="btn btn--accent" data-schedule-confirm disabled>Confirm booking</button>
              </div>
            </div>
            <div data-booking-success hidden class="booking-form__success">
              <div class="booking-form__success-icon">${icon('check', 24)}</div>
              <h3>Booking confirmed!</h3>
              <p data-booking-summary>A Nexaa Home coordinator will see you at the scheduled time.</p>
              <p class="booking-form__ref">Reference: <strong data-booking-ref></strong></p>
              <div class="booking-form__success-actions">
                <a href="#/account" class="btn btn--primary" data-view-account hidden>View in My Account</a>
                <button type="button" class="btn btn--ghost" data-book-again>Book another service</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`

  const form = qs('[data-booking-form]', mount)
  const fieldsPanel = qs('[data-booking-fields]', mount)
  const schedulePanel = qs('[data-booking-schedule]', mount)
  const successPanel = qs('[data-booking-success]', mount)
  const calendarMount = qs('[data-calendar-picker]', mount)
  const quoteEl = qs('[data-booking-quote]', mount)
  const confirmBtn = qs('[data-schedule-confirm]', mount)
  const backBtn = qs('[data-schedule-back]', mount)

  let pendingBooking = null
  let selectedSlot = null

  function setStep(n) {
    qsa('[data-step-indicator]', mount).forEach((el) => el.classList.toggle('is-active', Number(el.dataset.stepIndicator) === n))
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!validate(form)) return

    pendingBooking = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      service: form.elements.service.value,
      address: form.elements.address.value.trim(),
      pincode: form.elements.pincode.value.trim(),
      notes: form.elements.notes.value.trim(),
    }
    selectedSlot = null
    confirmBtn.disabled = true

    fieldsPanel.hidden = true
    schedulePanel.hidden = false
    setStep(2)

    const service = getServices().find((s) => s.id === pendingBooking.service)
    renderQuote(quoteEl, service)

    renderCalendarPicker(calendarMount, {
      serviceId: pendingBooking.service,
      onSlotSelected: (iso) => {
        selectedSlot = iso
        confirmBtn.disabled = !iso
      },
    })
  })

  backBtn?.addEventListener('click', () => {
    schedulePanel.hidden = true
    fieldsPanel.hidden = false
    setStep(1)
  })

  confirmBtn?.addEventListener('click', async () => {
    if (!selectedSlot || !pendingBooking) return
    confirmBtn.disabled = true
    confirmBtn.textContent = 'Booking…'

    const service = getServices().find((s) => s.id === pendingBooking.service)
    const customer = findOrCreateCustomer({
      name: pendingBooking.name,
      email: pendingBooking.email,
      phone: pendingBooking.phone,
      address: pendingBooking.address,
    })

    const job = bookJob({
      customer,
      service: pendingBooking.service,
      address: pendingBooking.address,
      pincode: pendingBooking.pincode,
      notes: pendingBooking.notes,
      price: service?.basePrice ?? 0,
      scheduledAt: selectedSlot,
    })

    if (!isAuthenticated()) rememberBooking(job.id, customer.email)

    const when = new Date(selectedSlot).toLocaleString('en-IN', DATE_TIME_FORMAT)
    const total = formatCurrency(job.total ?? job.price)
    await sendBookingEmail({
      type: 'booking',
      jobId: job.id,
      to: customer.email,
      subject: 'Your Nexaa Home booking is confirmed',
      body: `${service?.name ?? pendingBooking.service} scheduled for ${when} at ${pendingBooking.address}. Total: ${total} (incl. GST).`,
    })
    sendSms({ type: 'booking', jobId: job.id, to: customer.phone, body: `Nexaa Home: ${service?.name ?? ''} booked for ${when}. Ref ${job.id}.` })

    const technician = job.technicianId ? getDB().technicians.find((t) => t.id === job.technicianId) : null
    qs('[data-booking-summary]', mount).textContent = technician
      ? `${service?.name ?? ''} confirmed for ${when} with ${technician.name}. Total ${total}. A confirmation has been sent to ${customer.email}.`
      : `${service?.name ?? ''} confirmed for ${when}. We'll assign a technician shortly. Total ${total}. A confirmation has been sent to ${customer.email}.`
    qs('[data-booking-ref]', mount).textContent = job.id
    qs('[data-view-account]', mount).hidden = !isAuthenticated()

    schedulePanel.hidden = true
    successPanel.hidden = false
    setStep(3)
    showToast(`Thanks ${customer.name.split(' ')[0]}! Your booking is confirmed.`)

    form.reset()
    pendingBooking = null
    selectedSlot = null
    confirmBtn.disabled = true
    confirmBtn.textContent = 'Confirm booking'
  })

  qs('[data-book-again]', mount)?.addEventListener('click', () => {
    successPanel.hidden = true
    fieldsPanel.hidden = false
    setStep(1)
  })
}
