import { initials } from '../../lib/dom.js'
import { icon } from './icons.js'
import { groupsForRole } from '../nav.js'

export function renderSidebar(session) {
  const name = session?.name || 'Ops Manager'
  const email = session?.email || ''
  const groups = groupsForRole(session?.role)

  return `
    <aside class="admin-sidebar">
      <div class="admin-sidebar__head">
        <a class="admin-sidebar__logo" href="/">
          <img src="/logo-mark.svg" alt="" width="20" height="20" />
          Nexaa Home
        </a>
        <button type="button" class="admin-sidebar__close" data-sidebar-toggle aria-label="Close menu">
          ${icon('close', { size: 18 })}
        </button>
      </div>
      <nav class="admin-sidebar__nav">
        ${groups
          .map(
            (group) => `
          <div class="admin-sidebar__group">
            ${group.label ? `<div class="admin-sidebar__group-label">${group.label}</div>` : ''}
            ${group.links
              .map(
                (l) => `<a class="admin-sidebar__link" href="#/${l.route}" data-route-link="${l.route}">
                ${icon(l.icon, { size: 18, class: 'admin-sidebar__icon' })}
                <span>${l.label}</span>
              </a>`
              )
              .join('')}
          </div>`
          )
          .join('')}
      </nav>
      <div class="admin-sidebar__footer">
        <div class="admin-sidebar__user-avatar">${initials(name)}</div>
        <div class="admin-sidebar__user-info">
          <div class="admin-sidebar__user-name">${name}</div>
          <div class="admin-sidebar__user-role">${email || 'Signed in'}</div>
        </div>
        <button type="button" class="admin-sidebar__logout" data-logout aria-label="Log out" title="Log out">
          ${icon('log-out', { size: 16 })}
        </button>
      </div>
    </aside>`
}
