import { qs, qsa } from '../../lib/dom.js'
import { login, DEMO_ACCOUNTS } from '../session.js'
import { icon } from '../components/icons.js'

export default function renderLogin(mount, onSuccess) {
  mount.innerHTML = `
    <div class="admin-auth">
      <div class="admin-auth__panel">
        <div class="admin-auth__brand">
          <img src="/logo-mark.svg" alt="" width="26" height="26" />
          <span>Nexaa Home</span>
        </div>
        <h1>Manage every job from one place.</h1>
        <p>Live jobs, technician schedules, payments and customer history — all synced in real time.</p>
        <ul class="admin-auth__points">
          <li>Real-time job &amp; technician tracking</li>
          <li>Slot-based booking calendar</li>
          <li>Payments &amp; notification audit log</li>
        </ul>
      </div>

      <div class="admin-auth__form-wrap">
        <form class="admin-auth__form" data-login-form novalidate>
          <h2>Welcome back</h2>
          <p class="admin-auth__subtitle">Sign in to the operations dashboard.</p>

          <div class="field">
            <label for="login-email">Email</label>
            <div class="admin-auth__input">
              ${icon('mail', { size: 16 })}
              <input id="login-email" name="email" type="email" placeholder="you@nexaahome.com" autocomplete="username" />
            </div>
          </div>
          <div class="field">
            <label for="login-password">Password</label>
            <div class="admin-auth__input">
              ${icon('lock', { size: 16 })}
              <input id="login-password" name="password" type="password" placeholder="••••••••" autocomplete="current-password" />
            </div>
          </div>

          <label class="admin-auth__remember">
            <input type="checkbox" name="remember" /> Keep me signed in
          </label>

          <div class="admin-auth__error" data-login-error hidden></div>

          <button type="submit" class="btn btn--primary admin-auth__submit">Sign in</button>

          <div class="admin-auth__demo-group">
            ${DEMO_ACCOUNTS.map(
              (a) => `<button type="button" class="admin-auth__demo" data-fill-demo="${a.email}" data-fill-password="${a.password}">
                Use ${a.role} demo — ${a.email} / ${a.password}
              </button>`
            ).join('')}
          </div>
        </form>
      </div>
    </div>`

  const form = qs('[data-login-form]', mount)
  const errorEl = qs('[data-login-error]', mount)

  qsa('[data-fill-demo]', mount).forEach((btn) => {
    btn.addEventListener('click', () => {
      form.elements.email.value = btn.dataset.fillDemo
      form.elements.password.value = btn.dataset.fillPassword
      errorEl.hidden = true
    })
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const result = login({
      email: form.elements.email.value,
      password: form.elements.password.value,
      remember: form.elements.remember.checked,
    })
    if (!result.ok) {
      errorEl.textContent = result.error
      errorEl.hidden = false
      return
    }
    onSuccess(result.session)
  })
}
