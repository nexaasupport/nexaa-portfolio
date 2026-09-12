export function initNavToggle() {
  const header = document.querySelector('.site-header')
  const toggle = header?.querySelector('.site-header__toggle')
  const nav = header?.querySelector('.site-header__nav')
  if (!header || !toggle || !nav) return

  const close = () => {
    header.classList.remove('is-nav-open')
    nav.classList.remove('is-open')
    toggle.setAttribute('aria-expanded', 'false')
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open')
    header.classList.toggle('is-nav-open', isOpen)
    toggle.setAttribute('aria-expanded', String(isOpen))
  })

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) close()
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) close()
  })
}
