import '../scss/admin.scss'
import { qs } from './lib/dom.js'
import { subscribe } from './lib/store.js'
import { renderSidebar } from './admin/components/sidebar.js'
import { renderTopbar } from './admin/components/topbar.js'
import { createRouter } from './lib/router.js'
import renderDashboard from './admin/views/dashboard.js'
import renderJobs from './admin/views/jobs.js'
import renderCustomers from './admin/views/customers.js'
import renderTechnicians from './admin/views/technicians.js'
import renderPayments from './admin/views/payments.js'
import renderSettings from './admin/views/settings.js'

document.querySelector('#admin-app').innerHTML = `
  <div class="admin-shell">
    ${renderSidebar()}
    <div class="admin-main">
      <div data-topbar></div>
      <div id="view-root"></div>
    </div>
  </div>`

const viewRoot = qs('#view-root')

const routes = {
  dashboard: renderDashboard,
  jobs: renderJobs,
  customers: renderCustomers,
  technicians: renderTechnicians,
  payments: renderPayments,
  settings: renderSettings,
}

const router = createRouter(
  Object.fromEntries(
    Object.entries(routes).map(([name, view]) => [
      name,
      (mount) => {
        qs('[data-topbar]').innerHTML = renderTopbar(name)
        view(mount)
      },
    ])
  ),
  viewRoot
)

subscribe(() => router.render())
