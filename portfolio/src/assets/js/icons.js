const ICON_PATHS = {
  react: 'M12 3c1.5 2 2.7 4 3.4 6M12 3c-1.5 2-2.7 4-3.4 6M12 21c1.5-2 2.7-4 3.4-6M12 21c-1.5-2-2.7-4-3.4-6M3.5 8.5c2.3-.9 4.6-1.4 6.8-1.7M3.5 8.5c-.3 2.4-.1 4.8.6 7M3.5 8.5c1.6 1.8 3.4 3.4 5.4 4.8M20.5 8.5c-2.3-.9-4.6-1.4-6.8-1.7M20.5 8.5c.3 2.4.1 4.8-.6 7M20.5 8.5c-1.6 1.8-3.4 3.4-5.4 4.8',
  layers: 'M12 3l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18',
  stack: 'M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4',
  api: 'M8 4H5a1 1 0 00-1 1v3M16 4h3a1 1 0 011 1v3M8 20H5a1 1 0 01-1-1v-3M16 20h3a1 1 0 001-1v-3M9 9h6v6H9z',
  db: 'M12 5c4.4 0 8-1.1 8-2.5S16.4 0 12 0 4 1.1 4 2.5 7.6 5 12 5zM4 2.5V17c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V2.5M4 9.75c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5',
  redo: 'M4 12a8 8 0 1114.6 4.6M20 12l-3-1 1-3',
  bug: 'M9 9l-2-3M15 9l2-3M9 5a3 3 0 116 0M6 12h12M6 12a6 6 0 1012 0M6 12a6 6 0 016-6 6 6 0 016 6',
  spark: 'M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M19 5l-4 4M5 19l4-4M19 19l-4-4',
  check: 'M4 12h16M4 6h16M4 18h10',
  shield: 'M12 3l7 3v6c0 5-3.2 8-7 9-3.8-1-7-4-7-9V6l7-3z',
  chat: 'M4 5h16v11H8l-4 4V5z',
  bolt: 'M13 2L4 14h6l-1 8 9-12h-6z',
}

export function svgIcon(name, { color = 'currentColor', size = 20 } = {}) {
  const d = ICON_PATHS[name] || ICON_PATHS.spark
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`
}
