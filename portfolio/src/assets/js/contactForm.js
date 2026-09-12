export function initContactForm(form) {
  if (!form) return
  const button = form.querySelector('button[type="submit"]')
  const status = form.querySelector('[role="status"]')

  const setState = (state) => {
    const labels = { idle: 'Send message', sending: 'Sending…', sent: 'Message sent' }
    const messages = {
      error: 'Add your name, a valid email and a short message.',
      sending: 'Validating and sending…',
      sent: 'Received — connect your form endpoint to deliver it.',
      idle: '',
    }
    button.textContent = labels[state] || labels.idle
    status.textContent = messages[state] || ''
    status.style.color =
      state === 'error' ? 'oklch(0.72 0.16 25)' : state === 'sent' ? 'oklch(0.8 0.14 155)' : 'oklch(0.75 0.01 260)'
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const value = (name) => (form[name] && form[name].value ? form[name].value : '').trim()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))

    if (!value('name') || !emailOk || !value('message')) {
      setState('error')
      return
    }

    setState('sending')
    setTimeout(() => setState('sent'), 900)
  })
}
