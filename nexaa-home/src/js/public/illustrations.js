import { icon } from './icons.js'

// A "live matching" concept: a soft dot-grid backdrop, a pulsing radar core,
// and floating notification chips showing pros being matched in real time.
const CHIPS = [
  { icon: 'droplet', label: 'Plumber · 12 min away', x: 18, y: 34 },
  { icon: 'bolt', label: 'Electrician · matched', x: 108, y: 108 },
  { icon: 'sparkle', label: 'Cleaner · en route', x: 10, y: 182 },
]

function dotGridPattern() {
  return `
    <pattern id="heroDotGrid" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.16)" />
    </pattern>
  `
}

function radar() {
  return `
    <g class="hero-illustration__radar" transform="translate(190, 130)">
      <circle r="70" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1.5" />
      <circle r="46" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
      <circle class="hero-illustration__pulse" r="24" fill="rgba(255,255,255,0.22)" />
      <circle r="9" fill="#fff" />
    </g>
  `
}

function chip({ icon: iconName, label, x, y }) {
  const w = 168
  const h = 44
  return `
    <g transform="translate(${x}, ${y})">
      <rect width="${w}" height="${h}" rx="14" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" stroke-width="1" />
      <g transform="translate(10, 10)" color="#fff">${icon(iconName, 24, { tone: 'inverse' })}</g>
      <text x="42" y="${h / 2 + 5}" font-family="Inter, sans-serif" font-size="11.5" font-weight="600" fill="#fff">${label}</text>
    </g>
  `
}

export function heroIllustration() {
  return `
    <svg viewBox="0 0 380 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Live pro matching">
      <defs>${dotGridPattern()}</defs>
      <rect width="380" height="300" fill="url(#heroDotGrid)" />
      ${radar()}
      ${CHIPS.map(chip).join('')}
    </svg>
  `
}
