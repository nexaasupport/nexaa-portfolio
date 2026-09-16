import '../scss/admin.scss'
import { qs } from './lib/dom.js'
import { subscribe, onPersistError } from './lib/store.js'
import { showToast } from './lib/toast.js'
import { renderSidebar } from './admin/components/sidebar.js'
import { renderTopbar } from './admin/components/topbar.js'
import { createRouter } from './lib/router.js'
import { isAuthenticated, getSession, logout } from './admin/session.js'
import { animateCounters } from './lib/counter.js'
import { closeModal } from './lib/modal.js'
import renderLogin from './admin/views/login.js'
import renderDashboard from './admin/views/dashboard.js'
import renderReports from './admin/views/reports.js'
import renderJobs from './admin/views/jobs.js'
import renderCalendar from './admin/views/calendar.js'
import renderCustomers from './admin/views/customers.js'
import renderTechnicians from './admin/views/technicians.js'
import renderPayments from './admin/views/payments.js'
import renderNotifications from './admin/views/notifications.js'
import renderSettings from './admin/views/settings.js'
import renderMyJobs from './admin/views/myJobs.js'

// Keys here must match the routes declared in ./admin/nav.js — that file is
// the single source of truth for labels/icons/order; this just wires each
// route name to its view function.
const OWNER_ROUTES = {
  dashboard: renderDashboard,
  reports: renderReports,
  jobs: renderJobs,
  calendar: renderCalendar,
  customers: renderCustomers,
  technicians: renderTechnicians,
  payments: renderPayments,
  notifications: renderNotifications,
  settings: renderSettings,
}

const TECHNICIAN_ROUTES = {
  myjobs: renderMyJobs,
}

const appRoot = qs('#admin-app')
let router = null
let unsubscribeStore = null

function teardown() {
  if (router) { router.destroy(); router = null }
  if (unsubscribeStore) { unsubscribeStore(); unsubscribeStore = null }
}

function renderApp() {
  teardown()

  if (!isAuthenticated()) {
    appRoot.innerHTML = '<div id="login-root"></div>'
    renderLogin(qs('#login-root'), renderApp)
    return
  }

  const session = getSession()
  const isTechnician = session.role === 'technician'
  const routes = isTechnician ? TECHNICIAN_ROUTES : OWNER_ROUTES
  const defaultRoute = isTechnician ? 'myjobs' : 'dashboard'

  appRoot.innerHTML = `
    <div class="admin-shell" data-shell>
      ${renderSidebar(session)}
      <div class="admin-shell__backdrop" data-sidebar-backdrop></div>
      <div class="admin-main">
        <div data-topbar></div>
        <div id="view-root"></div>
      </div>
    </div>`

  const viewRoot = qs('#view-root')

  router = createRouter(
    Object.fromEntries(
      Object.entries(routes).map(([name, view]) => [
        name,
        (mount) => {
          closeModal()
          qs('[data-topbar]').innerHTML = renderTopbar(name, session)
          view(mount, session)
          animateCounters(mount)
        },
      ])
    ),
    viewRoot,
    defaultRoute
  )

  unsubscribeStore = subscribe(() => router.render())
}

document.addEventListener('click', (e) => {
  const userMenu = qs('.admin-topbar__user')
  if (userMenu?.open && !e.target.closest('.admin-topbar__user')) userMenu.open = false

  const shell = qs('[data-shell]')
  if (e.target.closest('[data-logout]')) {
    logout()
    renderApp()
  } else if (!shell) {
    return
  } else if (e.target.closest('[data-sidebar-toggle]')) {
    shell.classList.toggle('is-sidebar-open')
  } else if (e.target.closest('[data-sidebar-backdrop]')) {
    shell.classList.remove('is-sidebar-open')
  } else if (e.target.closest('.admin-sidebar__link')) {
    shell.classList.remove('is-sidebar-open')
  }
})

onPersistError(() => showToast("Couldn't save — your browser storage may be full or disabled."))

renderApp()
