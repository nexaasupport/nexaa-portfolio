import { qs, qsa, formatDateTime } from '../../lib/dom.js'
import { getNotifications } from '../../lib/store.js'
import { sendBookingEmail } from '../../lib/email.js'
import { renderTable } from '../components/table.js'
import { paginate, renderPagination, attachPagination } from '../components/pagination.js'
import { showToast } from '../../lib/toast.js'
import { icon } from '../components/icons.js'

const TYPE_LABELS = { booking: 'Booking confirmation', reschedule: 'Reschedule', cancellation: 'Cancellation' }
const STATUS_LABELS = { sent: 'Sent', failed: 'Failed', skipped: 'Simulated', sending: 'Sending…' }
const PAGE_SIZE = 15

export default function renderNotifications(mount) {
  let search = ''
  let page = 1

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Notifications</h1>
          <p>Every booking, reschedule and cancellation alert — email via EmailJS (or simulated), SMS always simulated (no provider configured).</p>
        </div>
        <div class="admin-toolbar">
          <div class="admin-search">${icon('search', { size: 16 })}<input type="search" placeholder="Search recipient or subject" aria-label="Search notifications" data-search /></div>
        </div>
      </div>
      <div class="admin-panel">
        <div data-table></div>
        <div data-pagination></div>
      </div>
    </div>`

  function paint() {
    const term = search.toLowerCase()
    const all = getNotifications().filter((n) => !term || n.to?.toLowerCase().includes(term) || n.subject?.toLowerCase().includes(term))
    const { rows, pages, total } = paginate(all, page, PAGE_SIZE)

    qs('[data-table]', mount).innerHTML = renderTable({
      columns: [
        { label: 'Time', render: (n) => formatDateTime(n.sentAt) },
        { label: 'Channel', render: (n) => (n.channel === 'sms' ? 'SMS' : 'Email') },
        { label: 'Type', render: (n) => TYPE_LABELS[n.type] || n.type },
        { label: 'To', render: (n) => n.to || '—' },
        { label: 'Subject', render: (n) => n.subject },
        { label: 'Status', render: (n) => `<span class="badge badge--notif-${n.status}">${STATUS_LABELS[n.status] || n.status}</span>` },
        { label: '', render: (n) => (n.status === 'failed' && n.channel !== 'sms' ? `<button class="btn btn--ghost btn--sm" data-resend="${n.id}">${icon('refresh', { size: 14 })} Resend</button>` : '') },
      ],
      rows,
      emptyMessage: 'No notifications yet — they appear here as customers book, reschedule or cancel.',
    })
    qs('[data-pagination]', mount).innerHTML = renderPagination({ page, pages, total, pageSize: PAGE_SIZE })
    attachPagination(mount, { onChange: (p) => { page = p; paint() } })

    qsa('[data-resend]', mount).forEach((btn) =>
      btn.addEventListener('click', async () => {
        const notification = rows.find((n) => n.id === btn.dataset.resend)
        if (!notification) return
        await sendBookingEmail({
          type: notification.type,
          jobId: notification.jobId,
          to: notification.to,
          subject: notification.subject,
          body: notification.body,
        })
        showToast('Resend attempted.')
        paint()
      })
    )
  }

  paint()

  qs('[data-search]', mount).addEventListener('input', (e) => { search = e.target.value.trim(); page = 1; paint() })
}
