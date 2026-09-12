export function initReveal(root = document) {
  const els = root.querySelectorAll('[data-reveal]')
  if (!('IntersectionObserver' in window) || !els.length) return

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )

  els.forEach((el) => io.observe(el))
}
