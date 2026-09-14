export function initNavToggle() {
  const header = document.querySelector('.site-header')
  const toggle = header?.querySelector('.site-header__toggle')
  const panel = document.querySelector('[data-mobile-panel]')
  const closeBtn = panel?.querySelector('[data-nav-close]')
  if (!header || !toggle || !panel) return

  const close = () => {
    header.classList.remove('is-nav-open')
    panel.classList.remove('is-open')
    toggle.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('nav-locked')
  }

  const open = () => {
    header.classList.add('is-nav-open')
    panel.classList.add('is-open')
    toggle.setAttribute('aria-expanded', 'true')
    document.body.classList.add('nav-locked')
  }

  toggle.addEventListener('click', () => {
    panel.classList.contains('is-open') ? close() : open()
  })

  closeBtn?.addEventListener('click', close)

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) close()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) close()
  })
}
