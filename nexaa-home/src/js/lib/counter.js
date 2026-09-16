const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function parseValue(raw) {
  const match = raw.trim().match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, numStr, suffix] = match
  const hasComma = numStr.includes(',')
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  const target = parseFloat(numStr.replace(/,/g, ''))
  if (Number.isNaN(target)) return null
  return { prefix, suffix, target, decimals, hasComma }
}

function format(value, { decimals, hasComma }) {
  const fixed = value.toFixed(decimals)
  if (!hasComma) return fixed
  const [int, dec] = fixed.split('.')
  const withCommas = Number(int).toLocaleString('en-IN')
  return dec ? `${withCommas}.${dec}` : withCommas
}

function run(el, parsed, duration) {
  const { prefix, suffix } = parsed
  const start = performance.now()
  function frame(now) {
    const p = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - p, 3)
    el.textContent = `${prefix}${format(parsed.target * eased, parsed)}${suffix}`
    if (p < 1) requestAnimationFrame(frame)
    else el.textContent = `${prefix}${format(parsed.target, parsed)}${suffix}`
  }
  requestAnimationFrame(frame)
}

let io

// Animates the number inside any `[data-counter]` element from 0 up to its
// current text content once it scrolls into view, preserving prefix/suffix
// (currency symbols, "+", "/5", commas, decimals). Call again after a
// re-render to pick up newly-mounted counters.
export function animateCounters(root = document, { duration = 900 } = {}) {
  const els = [...root.querySelectorAll('[data-counter]:not([data-counter-done])')]
  if (!els.length) return

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.setAttribute('data-counter-done', ''))
    return
  }

  io?.disconnect()
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const parsed = parseValue(el.textContent)
        el.setAttribute('data-counter-done', '')
        io.unobserve(el)
        if (parsed) run(el, parsed, duration)
      })
    },
    { threshold: 0.4 }
  )

  els.forEach((el) => io.observe(el))
}
