import { addNotification } from './store.js'

// SMS has no real provider wired up (that needs a backend + a service like
// Twilio/MSG91), so this always logs a simulated send — same audit-trail
// pattern as email.js's fallback, just without ever attempting a real send.
export function sendSms({ type, jobId = null, to, body }) {
  return addNotification({ type, channel: 'sms', jobId, to, subject: 'SMS', body, status: 'skipped' })
}
