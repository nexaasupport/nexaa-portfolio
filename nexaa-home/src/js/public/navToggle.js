import { qs, qsa } from '../lib/dom.js'

export function initNavToggle() {
  const header = qs('.site-header')
  const toggle = qs('[data-nav-toggle]')
  const mobileNav = qs('.site-header__mobile-nav')
  if (!header || !toggle || !mobileNav) return

  const close = () => {
    header.classList.remove('is-nav-open')
    toggle.setAttribute('aria-expanded', 'false')
  }

  const open = () => {
    header.classList.add('is-nav-open')
    toggle.setAttribute('aria-expanded', 'true')
  }

  toggle.addEventListener('click', () => {
    header.classList.contains('is-nav-open') ? close() : open()
  })

  qsa('a', mobileNav).forEach((link) => link.addEventListener('click', close))

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) close()
  })
}
