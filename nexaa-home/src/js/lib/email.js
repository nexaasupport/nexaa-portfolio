import emailjs from '@emailjs/browser'
import { getDB, addNotification, updateNotificationStatus } from './store.js'

// Sends a booking-related email via EmailJS (client-side, no server) using the
// service/template/public key configured in Admin → Settings. If those aren't
// configured yet, the notification is still logged with status "skipped" so
// the demo works end-to-end without external setup.
export async function sendBookingEmail({ type, jobId = null, to, subject, body, params = {} }) {
  const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } = getDB().settings

  if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
    return addNotification({ type, jobId, to, subject, body, status: 'skipped' })
  }

  const notification = addNotification({ type, jobId, to, subject, body, status: 'sending' })
  try {
    await emailjs.send(
      emailjsServiceId,
      emailjsTemplateId,
      { to_email: to, subject, message: body, ...params },
      { publicKey: emailjsPublicKey }
    )
    updateNotificationStatus(notification.id, 'sent')
  } catch (err) {
    console.warn('EmailJS send failed', err)
    updateNotificationStatus(notification.id, 'failed')
  }
  return notification
}
