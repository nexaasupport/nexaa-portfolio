import { qs, initials } from '../../../lib/dom.js'
import { getSession, logout } from '../../../lib/customerAuth.js'
import { getJobsForCustomer, updateCustomer, getDB } from '../../../lib/store.js'
import { renderBookingCard } from '../../bookingCard.js'
import { icon } from '../../icons.js'
import { showToast } from '../../../lib/toast.js'
import { navigateTo } from '../pageRouter.js'

export default function renderAccountView(mount) {
  const session = getSession()
  const customer = getDB().customers.find((c) => c.id === session.customerId)
  const jobs = getJobsForCustomer(session.customerId)
  const active = jobs.filter((j) => j.status !== 'cancelled' && j.status !== 'completed')
  const past = jobs.filter((j) => j.status === 'cancelled' || j.status === 'completed')

  mount.innerHTML = `
    <div class="account-shell">
      <div class="account-shell__head">
        <div class="account-shell__identity">
          <div class="account-shell__avatar">${initials(customer?.name || session.name)}</div>
          <div>
            <h1>Hi, ${(customer?.name || session.name).split(' ')[0]}</h1>
            <p>${customer?.email || session.email}</p>
          </div>
        </div>
        <div class="account-shell__actions">
          <a href="#/book" class="btn btn--primary btn--sm">${icon('check', 15)} Book a service</a>
          <button type="button" class="btn btn--ghost btn--sm" data-account-logout>${icon('log-out', 15)} Log out</button>
        </div>
      </div>

      <div class="account-shell__grid">
        <section class="account-shell__main">
          <h2>Your bookings</h2>
          ${active.length ? '<div class="account-shell__bookings" data-active-bookings></div>' : '<p class="account-shell__empty">No active bookings — <a href="#/book">book a service</a> to get started.</p>'}

          ${
            past.length
              ? `<h2 class="account-shell__section-gap">Past bookings</h2>
                 <div class="account-shell__bookings" data-past-bookings></div>`
              : ''
          }
        </section>

        <aside class="account-shell__side">
          <div class="account-shell__panel">
            <h3>Your profile</h3>
            <form data-profile-form novalidate>
              <div class="field"><label>Full name</label><input name="name" value="${customer?.name || ''}" required /></div>
              <div class="field"><label>Phone</label><input name="phone" type="tel" value="${customer?.phone || ''}" required /></div>
              <div class="field"><label>Address</label><input name="address" value="${customer?.address || ''}" /></div>
              <button type="submit" class="btn btn--primary btn--sm" style="width:100%">Save changes</button>
            </form>
          </div>
        </aside>
      </div>
    </div>`

  active.forEach((job) => {
    const card = document.createElement('div')
    qs('[data-active-bookings]', mount).append(card)
    renderBookingCard(card, job, customer)
  })

  past.forEach((job) => {
    const card = document.createElement('div')
    qs('[data-past-bookings]', mount).append(card)
    renderBookingCard(card, job, customer)
  })

  qs('[data-account-logout]', mount).addEventListener('click', () => {
    logout()
    navigateTo('login')
  })

  qs('[data-profile-form]', mount).addEventListener('submit', (e) => {
    e.preventDefault()
    const form = e.target
    updateCustomer(customer.id, {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      address: form.elements.address.value.trim(),
    })
    showToast('Profile updated.')
    renderAccountView(mount)
  })
}
