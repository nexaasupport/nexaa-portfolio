import { createEl } from './dom.js'

let container = null

export function showToast(message, type = 'success') {
  if (!container) {
    container = createEl('div', { class: 'toast-stack', id: 'toast-root' })
    document.body.append(container)
  }
  const toast = createEl('div', { class: `toast toast--${type}` }, message)
  container.append(toast)
  requestAnimationFrame(() => toast.classList.add('is-visible'))
  setTimeout(() => {
    toast.classList.remove('is-visible')
    setTimeout(() => toast.remove(), 250)
  }, 3200)
}
