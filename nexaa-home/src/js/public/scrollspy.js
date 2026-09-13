export function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('[data-nav] a'))
  if (!navLinks.length) return

  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute('href')
      if (!id || id === '#top') return null
      const el = document.querySelector(id)
      return el ? { id, el } : null
    })
    .filter(Boolean)

  if (!sections.length) return

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === id)
    })
  }

  const header = document.querySelector('.site-header')
  const offset = (header ? header.offsetHeight : 0) + 24

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (visible.length) {
        setActive('#' + visible[0].target.id)
      } else if (window.scrollY < 200) {
        setActive('#top')
      }
    },
    { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 }
  )

  sections.forEach(({ el }) => io.observe(el))

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < 200) setActive('#top')
    },
    { passive: true }
  )
}
