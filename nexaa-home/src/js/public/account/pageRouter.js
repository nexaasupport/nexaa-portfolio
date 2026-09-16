import { qs } from '../../lib/dom.js'
import { isAuthenticated } from '../../lib/customerAuth.js'
import { renderHeaderAuth } from './headerAuth.js'
import renderLoginView from './views/login.js'
import renderSignupView from './views/signup.js'
import renderAccountView from './views/dashboard.js'
import renderBookView from './views/book.js'
import renderTrackView from './views/track.js'

// The public site's page router — booking, tracking, and the customer
// account area all live as `#/`-prefixed routes swapped into #account-app,
// separate from the marketing homepage's plain anchor hashes (#services,
// #pricing, ...) used by scrollspy. Any hash that isn't one of these routes
// just hides this app and shows the marketing page again.
const ROUTES = {
  login: renderLoginView,
  signup: renderSignupView,
  account: renderAccountView,
  book: renderBookView,
  track: renderTrackView,
}

// Routes that require a customer to be logged in.
const AUTH_ONLY_ROUTES = new Set(['account'])
// Routes a logged-in customer should never see (bounce to /account instead).
const GUEST_ONLY_ROUTES = new Set(['login', 'signup'])

function currentRoute() {
  const hash = window.location.hash
  if (!hash.startsWith('#/')) return null
  return hash.slice(2) || null
}

export function navigateTo(route) {
  window.location.hash = `#/${route}`
}

export function initPageRouter() {
  const appRoot = qs('#account-app')
  const main = qs('main#top')
  if (!appRoot || !main) return

  function render() {
    renderHeaderAuth()
    const route = currentRoute()

    if (!route || !ROUTES[route]) {
      appRoot.hidden = true
      appRoot.innerHTML = ''
      main.hidden = false
      return
    }

    if (AUTH_ONLY_ROUTES.has(route) && !isAuthenticated()) {
      navigateTo('login')
      return
    }
    if (GUEST_ONLY_ROUTES.has(route) && isAuthenticated()) {
      navigateTo('account')
      return
    }

    main.hidden = true
    appRoot.hidden = false
    appRoot.innerHTML = ''
    ROUTES[route](appRoot, { navigate: navigateTo })
    window.scrollTo(0, 0)
  }

  window.addEventListener('hashchange', render)
  render()
}
