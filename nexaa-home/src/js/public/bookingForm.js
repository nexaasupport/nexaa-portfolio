import { qs } from '../lib/dom.js'
import { findOrCreateCustomer, addJob, getServices } from '../lib/store.js'
import { showToast } from '../lib/toast.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s-]{7,}$/

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
  const name = form.elements.name
  const email = form.elements.email
  const phone = form.elements.phone
  const service = form.elements.service
  const address = form.elements.address

  if (!name.value.trim()) { setError(name, 'Please enter your name.'); valid = false } else setError(name, '')
  if (!EMAIL_RE.test(email.value.trim())) { setError(email, 'Enter a valid email address.'); valid = false } else setError(email, '')
  if (!PHONE_RE.test(phone.value.trim())) { setError(phone, 'Enter a valid phone number.'); valid = false } else setError(phone, '')
  if (!service.value) { setError(service, 'Please choose a service.'); valid = false } else setError(service, '')
  if (!address.value.trim()) { setError(address, 'Please enter your address.'); valid = false } else setError(address, '')

  return valid
}

export function initBookingForm() {
  const form = qs('[data-booking-form]')
  if (!form) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!validate(form)) return

    const serviceId = form.elements.service.value
    const service = getServices().find((s) => s.id === serviceId)

    const customer = findOrCreateCustomer({
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      address: form.elements.address.value.trim(),
    })

    addJob({
      customer,
      service: serviceId,
      address: form.elements.address.value.trim(),
      notes: form.elements.notes.value.trim(),
      price: service?.basePrice ?? 0,
    })

    showToast(`Thanks ${customer.name.split(' ')[0]}! Your request has been sent to our team.`)
    qs('[data-booking-fields]').hidden = true
    qs('[data-booking-success]').hidden = false
    form.reset()
  })

  qs('[data-book-again]')?.addEventListener('click', () => {
    qs('[data-booking-fields]').hidden = false
    qs('[data-booking-success]').hidden = true
  })
}
