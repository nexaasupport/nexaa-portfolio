import { qs } from '../../../lib/dom.js'
import { login, DEMO_CUSTOMER } from '../../../lib/customerAuth.js'
import { icon } from '../../icons.js'
import { navigateTo } from '../pageRouter.js'

export default function renderLoginView(mount) {
  mount.innerHTML = `
    <div class="auth-panel">
      <div class="auth-panel__pitch">
        <a href="#top" class="auth-panel__logo"><img src="/logo-icon.svg" alt="" width="26" height="26" /> Nexaa Home</a>
        <h1>Welcome back.</h1>
        <p>Sign in to track your bookings, manage payments and rebook your favorite pros in seconds.</p>
        <ul class="auth-panel__points">
          <li>${icon('check', 16)} All your bookings in one place</li>
          <li>${icon('check', 16)} Reschedule or cancel anytime</li>
          <li>${icon('check', 16)} Download invoices instantly</li>
        </ul>
      </div>
      <div class="auth-panel__form-wrap">
        <form class="auth-panel__form" data-login-form novalidate>
          <h2>Log in</h2>
          <p class="auth-panel__subtitle">New here? <a href="#/signup">Create an account</a></p>

          <div class="field">
            <label for="acc-login-email">Email</label>
            <div class="auth-panel__input">${icon('mail', 16)}<input id="acc-login-email" name="email" type="email" placeholder="you@example.com" autocomplete="username" required /></div>
          </div>
          <div class="field">
            <label for="acc-login-password">Password</label>
            <div class="auth-panel__input">${icon('lock', 16)}<input id="acc-login-password" name="password" type="password" placeholder="••••••••" autocomplete="current-password" required /></div>
          </div>

          <label class="auth-panel__remember"><input type="checkbox" name="remember" checked /> Keep me signed in</label>

          <div class="auth-panel__error" data-login-error hidden></div>

          <button type="submit" class="btn btn--primary auth-panel__submit"><span data-submit-label>Log in</span></button>

          <button type="button" class="auth-panel__demo" data-fill-demo>Use demo account — ${DEMO_CUSTOMER.email} / ${DEMO_CUSTOMER.password}</button>

          <p class="auth-panel__guest">Or <a href="#/track">look up a guest booking</a> instead.</p>
        </form>
      </div>
    </div>`

  const form = qs('[data-login-form]', mount)
  const errorEl = qs('[data-login-error]', mount)
  const submitBtn = qs('.auth-panel__submit', mount)
  const submitLabel = qs('[data-submit-label]', submitBtn)

  qs('[data-fill-demo]', mount).addEventListener('click', () => {
    form.elements.email.value = DEMO_CUSTOMER.email
    form.elements.password.value = DEMO_CUSTOMER.password
    errorEl.hidden = true
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    submitBtn.disabled = true
    submitLabel.textContent = 'Logging in…'
    const result = await login({
      email: form.elements.email.value,
      password: form.elements.password.value,
      remember: form.elements.remember.checked,
    })
    if (!result.ok) {
      errorEl.textContent = result.error
      errorEl.hidden = false
      submitBtn.disabled = false
      submitLabel.textContent = 'Log in'
      return
    }
    navigateTo('account')
  })
}
