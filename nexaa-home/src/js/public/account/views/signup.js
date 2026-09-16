import { qs } from '../../../lib/dom.js'
import { signup } from '../../../lib/customerAuth.js'
import { icon } from '../../icons.js'
import { navigateTo } from '../pageRouter.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function renderSignupView(mount) {
  mount.innerHTML = `
    <div class="auth-panel">
      <div class="auth-panel__pitch">
        <a href="#top" class="auth-panel__logo"><img src="/logo-icon.svg" alt="" width="26" height="26" /> Nexaa Home</a>
        <h1>Create your account.</h1>
        <p>Book once, and everything after is one click — history, invoices, and rebooking your favorite pros.</p>
        <ul class="auth-panel__points">
          <li>${icon('check', 16)} Free, no commitment</li>
          <li>${icon('check', 16)} Already booked as a guest? Signing up with the same email links it automatically</li>
        </ul>
      </div>
      <div class="auth-panel__form-wrap">
        <form class="auth-panel__form" data-signup-form novalidate>
          <h2>Create an account</h2>
          <p class="auth-panel__subtitle">Already have one? <a href="#/login">Log in</a></p>

          <div class="field">
            <label for="acc-signup-name">Full name</label>
            <div class="auth-panel__input">${icon('user', 16)}<input id="acc-signup-name" name="name" type="text" placeholder="Jane Doe" autocomplete="name" required /></div>
          </div>
          <div class="field">
            <label for="acc-signup-email">Email</label>
            <div class="auth-panel__input">${icon('mail', 16)}<input id="acc-signup-email" name="email" type="email" placeholder="you@example.com" autocomplete="username" required /></div>
          </div>
          <div class="field">
            <label for="acc-signup-phone">Phone</label>
            <div class="auth-panel__input">${icon('phone', 16)}<input id="acc-signup-phone" name="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel" required /></div>
          </div>
          <div class="field">
            <label for="acc-signup-password">Password</label>
            <div class="auth-panel__input">${icon('lock', 16)}<input id="acc-signup-password" name="password" type="password" placeholder="At least 6 characters" autocomplete="new-password" minlength="6" required /></div>
          </div>

          <div class="auth-panel__error" data-signup-error hidden></div>

          <button type="submit" class="btn btn--primary auth-panel__submit"><span data-submit-label>Create account</span></button>
        </form>
      </div>
    </div>`

  const form = qs('[data-signup-form]', mount)
  const errorEl = qs('[data-signup-error]', mount)
  const submitBtn = qs('.auth-panel__submit', mount)
  const submitLabel = qs('[data-submit-label]', submitBtn)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = form.elements.email.value.trim()
    if (!EMAIL_RE.test(email)) {
      errorEl.textContent = 'Enter a valid email address.'
      errorEl.hidden = false
      return
    }
    if (form.elements.password.value.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters.'
      errorEl.hidden = false
      return
    }

    submitBtn.disabled = true
    submitLabel.textContent = 'Creating account…'
    const result = await signup({
      name: form.elements.name.value.trim(),
      email,
      phone: form.elements.phone.value.trim(),
      password: form.elements.password.value,
    })
    if (!result.ok) {
      errorEl.textContent = result.error
      errorEl.hidden = false
      submitBtn.disabled = false
      submitLabel.textContent = 'Create account'
      return
    }
    navigateTo('account')
  })
}
