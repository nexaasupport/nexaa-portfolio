// Each icon is a duotone composition: a soft low-opacity fill layer behind a
// crisp stroked outline. `tone: 'inverse'` swaps the fill layer to white for
// icons placed on colored/gradient surfaces (e.g. work-gallery cards).
const ICONS = {
  droplet: (fill) => `
    <path d="M12 2s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z" fill="${fill}" stroke="none"/>
    <path d="M12 2s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/>
    <path d="M9.5 15.5a2.5 2.5 0 0 0 2.5 2.5" stroke-width="1.5"/>
  `,
  bolt: (fill) => `
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="${fill}" stroke="none"/>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>
    <circle cx="18.5" cy="5.5" r="1.1" fill="currentColor" stroke="none"/>
  `,
  sparkle: (fill) => `
    <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z" fill="${fill}" stroke="none"/>
    <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z"/>
    <path d="M18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" fill="${fill}" stroke="none"/>
    <path d="M18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" stroke-width="1.3"/>
  `,
  wind: (fill) => `
    <circle cx="6" cy="6" r="3.2" fill="${fill}" stroke="none"/>
    <path d="M3 8h11a3 3 0 1 0-3-3"/>
    <path d="M3 12h13.5" stroke-width="1.75"/>
    <path d="M3 16h9.5" stroke-width="1.5" opacity="0.85"/>
    <path d="M15 16h1.5a3 3 0 1 1-3 3" stroke-width="1.75"/>
  `,
  brush: (fill) => `
    <path d="M9 15l6-6 3 3-6 6H9v-3z" fill="${fill}" stroke="none"/>
    <path d="M9 15l6-6 3 3-6 6H9v-3z"/>
    <path d="M14 6l3-3 3 3-3 3" fill="${fill}"/>
    <path d="M9 18c-1.5 1.8-2.2 2.4-4 2.6 0-2 .5-3 1.8-4.4" stroke-width="1.5"/>
  `,
  wrench: (fill) => `
    <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z" fill="${fill}" stroke="none"/>
    <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z"/>
    <path d="M17.5 4.3l2.2 2.2-1.3 1.3-2.2-2.2z" stroke-width="1.4"/>
  `,
  shirt: (fill) => `
    <path d="M8 4 4 7l2 3 2-1.5V20h8V8.5L18 10l2-3-4-3-2 2h-4L8 4z" fill="${fill}" stroke="none"/>
    <path d="M8 4 4 7l2 3 2-1.5V20h8V8.5L18 10l2-3-4-3-2 2h-4L8 4z"/>
  `,
  quote: () => `
    <path d="M7.5 8.5C5.6 8.5 4 10.1 4 12s1.6 3.5 3.5 3.5c.4 0 .7-.05 1-.15C8 17.3 6.6 18.5 5 19" stroke-width="1.6"/>
    <path d="M17 8.5c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5c.4 0 .7-.05 1-.15-.5 2-1.9 3.2-3.5 4.2" stroke-width="1.6"/>
  `,
  check: () => `<path d="M20 6 9 17l-5-5"/>`,
  chat: () => `<path d="M21 15a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  mail: (fill) => `
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="${fill}" stroke="none"/>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/>
    <path d="m3 6.5 9 6.5 9-6.5"/>
  `,
  lock: (fill) => `
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" fill="${fill}" stroke="none"/>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2"/>
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>
  `,
  user: (fill) => `
    <circle cx="12" cy="8" r="4" fill="${fill}" stroke="none"/>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20a8 8 0 0 1 16 0"/>
  `,
  'log-out': () => `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>`,
  calendar: (fill) => `
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" fill="${fill}" stroke="none"/>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5"/>
    <path d="M16 3v4M8 3v4M3 10h18"/>
  `,
  'user-check': (fill) => `
    <circle cx="9" cy="9" r="4" fill="${fill}" stroke="none"/>
    <circle cx="9" cy="9" r="4"/>
    <path d="M2 20a7 7 0 0 1 14 0"/>
    <path d="m16 11 2 2 4-4"/>
  `,
  'arrow-right': () => `<path d="M5 12h14M13 6l6 6-6 6"/>`,
  star: () => `<path d="M12 2.5l2.9 6 6.6.7-4.9 4.6 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.6 6.6-.7L12 2.5z" fill="currentColor" stroke="none"/>`,
  phone: (fill) => `
    <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.25 1z" fill="${fill}" stroke="none"/>
    <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.25 1z"/>
  `,
}

const TONE_FILL = {
  brand: 'color-mix(in srgb, currentColor 16%, transparent)',
  inverse: 'rgba(255, 255, 255, 0.35)',
}

export function iconPaths(name, fill = 'none') {
  const build = ICONS[name] || ICONS.check
  return build(fill)
}

export function icon(name, size = 20, { tone = 'brand' } = {}) {
  const fill = TONE_FILL[tone] || TONE_FILL.brand
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${iconPaths(name, fill)}</svg>`
}
