import { createEl, qs } from './dom.js'

let overlayEl = null

function ensureOverlay() {
  if (overlayEl) return overlayEl
  overlayEl = createEl('div', { class: 'modal-overlay', id: 'modal-root' })
  document.body.append(overlayEl)
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) closeModal()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })
  return overlayEl
}

export function openModal({ title, content, onSubmit, submitLabel = 'Save' }) {
  const overlay = ensureOverlay()
  const form = createEl('form', { class: 'modal-card' }, [
    createEl('div', { class: 'modal-card__header' }, [
      createEl('h3', {}, title),
      createEl('button', { type: 'button', class: 'modal-card__close', 'aria-label': 'Close', onclick: closeModal }, '×'),
    ]),
    createEl('div', { class: 'modal-card__body' }, content),
    createEl('div', { class: 'modal-card__footer' }, [
      createEl('button', { type: 'button', class: 'btn btn--ghost', onclick: closeModal }, 'Cancel'),
      createEl('button', { type: 'submit', class: 'btn btn--primary' }, submitLabel),
    ]),
  ])
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const ok = onSubmit?.(new FormData(form), form)
    if (ok !== false) closeModal()
  })
  overlay.innerHTML = ''
  overlay.append(form)
  overlay.classList.add('is-open')
  const firstInput = qs('input, select, textarea', form)
  firstInput?.focus()
}

export function closeModal() {
  if (overlayEl) overlayEl.classList.remove('is-open')
}
