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
  check: () => `<path d="M20 6 9 17l-5-5"/>`,
  chat: () => `<path d="M21 15a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
}

const TONE_FILL = {
  brand: 'color-mix(in srgb, currentColor 16%, transparent)',
  inverse: 'rgba(255, 255, 255, 0.35)',
}

export function icon(name, size = 20, { tone = 'brand' } = {}) {
  const build = ICONS[name] || ICONS.check
  const fill = TONE_FILL[tone] || TONE_FILL.brand
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${build(fill)}</svg>`
}
