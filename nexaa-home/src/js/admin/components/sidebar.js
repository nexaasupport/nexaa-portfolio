const LINKS = [
  { route: 'dashboard', label: 'Dashboard' },
  { route: 'jobs', label: 'Jobs' },
  { route: 'customers', label: 'Customers' },
  { route: 'technicians', label: 'Technicians' },
  { route: 'payments', label: 'Payments' },
  { route: 'settings', label: 'Settings' },
]

export function renderSidebar() {
  return `
    <aside class="admin-sidebar">
      <a class="admin-sidebar__logo" href="/">Nexaa Home</a>
      <nav class="admin-sidebar__nav">
        ${LINKS.map(
          (l) => `<a class="admin-sidebar__link" href="#/${l.route}" data-route-link="${l.route}">${l.label}</a>`
        ).join('')}
      </nav>
      <div class="admin-sidebar__footer">Signed in as Ops Manager</div>
    </aside>`
}
