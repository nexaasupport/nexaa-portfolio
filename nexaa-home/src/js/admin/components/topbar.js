import { initials } from '../../lib/dom.js'
import { getDB } from '../../lib/store.js'

const TITLES = {
  dashboard: 'Dashboard',
  jobs: 'Jobs',
  customers: 'Customers',
  technicians: 'Technicians',
  payments: 'Payments',
  settings: 'Settings',
}

export function renderTopbar(route) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const businessName = getDB().settings.businessName
  return `
    <header class="admin-topbar">
      <div>
        <div class="admin-topbar__title">${TITLES[route] || 'Dashboard'}</div>
        <div class="admin-topbar__meta">${businessName} · ${today}</div>
      </div>
      <div class="admin-topbar__user">
        <span>Ops Manager</span>
        <div class="admin-topbar__avatar">${initials('Ops Manager')}</div>
      </div>
    </header>`
}
