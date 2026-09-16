import { initials } from '../../lib/dom.js'
import { getDB } from '../../lib/store.js'
import { icon } from './icons.js'
import { titleForRoute } from '../nav.js'

export function renderTopbar(route, session) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const businessName = getDB().settings.businessName
  const name = session?.name || 'Ops Manager'
  const isOwner = session?.role !== 'technician'
  const hasAlerts = getDB().notifications.some((n) => n.status === 'failed')

  return `
    <header class="admin-topbar">
      <div class="admin-topbar__left">
        <button type="button" class="admin-topbar__menu" data-sidebar-toggle aria-label="Open menu">
          ${icon('menu', { size: 20 })}
        </button>
        <div>
          <div class="admin-topbar__title">${titleForRoute(route)}</div>
          <div class="admin-topbar__meta">${businessName} &middot; ${today}</div>
        </div>
      </div>
      <div class="admin-topbar__right">
        ${
          isOwner
            ? `<a class="admin-topbar__bell" href="#/notifications" aria-label="Notifications">
                ${icon('notifications', { size: 18 })}
                ${hasAlerts ? '<span class="admin-topbar__bell-dot"></span>' : ''}
              </a>`
            : ''
        }
        <details class="admin-topbar__user">
          <summary class="admin-topbar__user-summary">
            <div class="admin-topbar__avatar">${initials(name)}</div>
            <span>${name}</span>
            ${icon('chevron-right', { size: 14, class: 'admin-topbar__chevron' })}
          </summary>
          <div class="admin-topbar__user-panel">
            <div class="admin-topbar__user-email">${session?.email || ''}</div>
            <button type="button" class="admin-topbar__user-action" data-logout>${icon('log-out', { size: 15 })} Log out</button>
          </div>
        </details>
      </div>
    </header>`
}
