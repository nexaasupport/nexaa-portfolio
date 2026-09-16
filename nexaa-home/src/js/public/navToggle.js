import { qs, qsa } from '../lib/dom.js'

export function initNavToggle() {
  const header = qs('.site-header')
  const toggle = qs('[data-nav-toggle]')
  const mobileNav = qs('.site-header__mobile-nav')
  const backdrop = qs('[data-nav-backdrop]')
  if (!header || !toggle || !mobileNav) return

  const close = () => {
    header.classList.remove('is-nav-open')
    toggle.setAttribute('aria-expanded', 'false')
    document.body.style.removeProperty('overflow')
  }

  const open = () => {
    header.classList.add('is-nav-open')
    toggle.setAttribute('aria-expanded', 'true')
    document.body.style.overflow = 'hidden'
  }

  toggle.addEventListener('click', () => {
    header.classList.contains('is-nav-open') ? close() : open()
  })

  backdrop?.addEventListener('click', close)

  qsa('a', mobileNav).forEach((link) => link.addEventListener('click', close))

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) close()
  })
}
