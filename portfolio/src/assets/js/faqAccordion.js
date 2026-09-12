export function initFaqAccordion(container) {
  if (!container) return

  container.addEventListener('click', (event) => {
    const item = event.target.closest('.faq-item')
    if (!item || !container.contains(item)) return

    const answer = item.querySelector('.faq-item__a')
    const symbol = item.querySelector('.faq-item__symbol')
    const isOpen = !answer.hidden

    container.querySelectorAll('.faq-item').forEach((other) => {
      if (other === item) return
      other.querySelector('.faq-item__a').hidden = true
      other.querySelector('.faq-item__symbol').textContent = '+'
    })

    answer.hidden = isOpen
    symbol.textContent = isOpen ? '+' : '−'
  })
}
