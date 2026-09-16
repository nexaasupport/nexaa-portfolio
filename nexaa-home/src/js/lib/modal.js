import { createEl, qs, qsa } from './dom.js'

let overlayEl = null
let lastFocused = null

function ensureOverlay() {
  if (overlayEl) return overlayEl
  overlayEl = createEl('div', { class: 'modal-overlay', id: 'modal-root' })
  document.body.append(overlayEl)
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) closeModal()
  })
  document.addEventListener('keydown', (e) => {
    if (!overlayEl.classList.contains('is-open')) return
    if (e.key === 'Escape') {
      closeModal()
      return
    }
    if (e.key === 'Tab') trapFocus(e)
  })
  return overlayEl
}

function trapFocus(e) {
  const focusable = qsa('button, input, select, textarea, [tabindex]:not([tabindex="-1"])', overlayEl).filter(
    (el) => !el.disabled && el.offsetParent !== null
  )
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

export function openModal({ title, content, onSubmit, submitLabel = 'Save', danger = false }) {
  const overlay = ensureOverlay()
  lastFocused = document.activeElement
  const body = createEl('div', { class: 'modal-card__body' })
  if (typeof content === 'string') body.innerHTML = content
  else body.append(...[].concat(content).filter((c) => c !== undefined && c !== null))

  const titleId = 'modal-title'
  const form = createEl('form', { class: 'modal-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId }, [
    createEl('div', { class: 'modal-card__header' }, [
      createEl('h3', { id: titleId }, title),
      createEl('button', { type: 'button', class: 'modal-card__close', 'aria-label': 'Close', onclick: closeModal }, '×'),
    ]),
    body,
    createEl('div', { class: 'modal-card__footer' }, [
      createEl('button', { type: 'button', class: 'btn btn--ghost', onclick: closeModal }, 'Cancel'),
      createEl('button', { type: 'submit', class: `btn ${danger ? 'btn--danger' : 'btn--primary'}` }, submitLabel),
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
  lastFocused?.focus?.()
}
