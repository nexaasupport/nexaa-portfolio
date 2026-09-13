import { qs } from '../lib/dom.js'

export function initStickyHeader() {
  const header = qs('.site-header')
  if (!header) return

  const setState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24)
  }

  setState()
  window.addEventListener('scroll', setState, { passive: true })
}
