// Single source of truth for admin navigation — route name, label and icon
// — consumed by both the sidebar (nav links) and the topbar (page title),
// plus admin-main.js's route tables, so adding a view means editing one file.
// Grouped for the sidebar (section headers) — order here is display order.
// admin-main.js's route tables just need the flat route→view map, but the
// groups double as that flat list via OWNER_LINKS below.
export const OWNER_GROUPS = [
  {
    label: 'Overview',
    links: [
      { route: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
      { route: 'reports', icon: 'trending-up', label: 'Reports' },
    ],
  },
  {
    label: 'Operations',
    links: [
      { route: 'jobs', icon: 'jobs', label: 'Jobs' },
      { route: 'calendar', icon: 'calendar', label: 'Calendar' },
    ],
  },
  {
    label: 'People',
    links: [
      { route: 'customers', icon: 'customers', label: 'Customers' },
      { route: 'technicians', icon: 'technicians', label: 'Technicians' },
    ],
  },
  {
    label: 'Business',
    links: [
      { route: 'payments', icon: 'payments', label: 'Payments' },
      { route: 'notifications', icon: 'notifications', label: 'Notifications' },
      { route: 'settings', icon: 'settings', label: 'Settings' },
    ],
  },
]

export const OWNER_LINKS = OWNER_GROUPS.flatMap((g) => g.links)

export const TECHNICIAN_LINKS = [{ route: 'myjobs', icon: 'jobs', label: 'My Jobs' }]

const ALL_LINKS = [...OWNER_LINKS, ...TECHNICIAN_LINKS]

export function groupsForRole(role) {
  return role === 'technician' ? [{ label: '', links: TECHNICIAN_LINKS }] : OWNER_GROUPS
}

export function linksForRole(role) {
  return role === 'technician' ? TECHNICIAN_LINKS : OWNER_LINKS
}

export function titleForRoute(route) {
  return ALL_LINKS.find((l) => l.route === route)?.label || 'Dashboard'
}
