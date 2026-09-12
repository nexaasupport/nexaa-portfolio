const ICONS = {
  droplet: '<path d="M12 2s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
  sparkle: '<path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h9"/>',
  brush: '<path d="M9 15l6-6 3 3-6 6H9v-3z"/><path d="M14 6l3-3 3 3-3 3"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
}

export function icon(name, size = 20) {
  const path = ICONS[name] || ICONS.check
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`
}
