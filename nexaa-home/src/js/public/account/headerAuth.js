import { qs } from '../../lib/dom.js'
import { isAuthenticated, getSession, logout } from '../../lib/customerAuth.js'
import { icon } from '../icons.js'

export function renderHeaderAuth() {
  const mount = qs('[data-account-actions]')
  if (!mount) return

  if (!isAuthenticated()) {
    mount.innerHTML = `<a href="#/login" class="site-header__link">Log in</a>`
    return
  }

  const session = getSession()
  mount.innerHTML = `
    <details class="site-header__account">
      <summary class="site-header__account-summary">
        ${icon('user', 17)}
        <span>${session.name?.split(' ')[0] || 'Account'}</span>
      </summary>
      <div class="site-header__account-panel">
        <a href="#/account">My Account</a>
        <button type="button" data-header-logout>${icon('log-out', 15)} Log out</button>
      </div>
    </details>`

  qs('[data-header-logout]', mount).addEventListener('click', () => {
    logout()
    renderHeaderAuth()
    if (window.location.hash.startsWith('#/')) window.location.hash = '#top'
  })
}
