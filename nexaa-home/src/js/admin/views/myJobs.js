import { qs, qsa, formatCurrency, formatDateTime } from '../../lib/dom.js'
import { getJobsWithDetails, updateJobStatus } from '../../lib/store.js'
import { statusBadge } from '../components/table.js'
import { showToast } from '../../lib/toast.js'

const NEXT_ACTION = {
  assigned: { next: 'in_progress', label: 'Start job' },
  in_progress: { next: 'completed', label: 'Mark complete' },
}

export default function renderMyJobs(mount, session) {
  function paint() {
    const jobs = getJobsWithDetails()
      .filter((j) => j.technicianId === session?.technicianId && j.status !== 'cancelled')
      .sort((a, b) => new Date(a.scheduledAt || 0) - new Date(b.scheduledAt || 0))

    const todayCount = jobs.filter((j) => j.scheduledAt && new Date(j.scheduledAt).toDateString() === new Date().toDateString()).length

    mount.innerHTML = `
      <div class="admin-view">
        <div class="admin-view__head">
          <div>
            <h1>My Jobs</h1>
            <p>Jobs assigned to you — ${todayCount} scheduled today.</p>
          </div>
        </div>
        <div class="my-jobs" data-list></div>
      </div>`

    const listEl = qs('[data-list]', mount)
    if (!jobs.length) {
      listEl.innerHTML = '<div class="empty-state">No jobs assigned to you right now.</div>'
      return
    }

    listEl.innerHTML = jobs
      .map((j) => {
        const action = NEXT_ACTION[j.status]
        return `
        <div class="my-jobs__card">
          <div class="my-jobs__head">
            <div>
              <div class="my-jobs__service">${j.serviceInfo?.name ?? j.service}</div>
              <div class="my-jobs__time">${formatDateTime(j.scheduledAt)}</div>
            </div>
            ${statusBadge(j.status)}
          </div>
          <div class="my-jobs__customer">
            <strong>${j.customer?.name ?? 'Unknown'}</strong>
            <span>${j.customer?.phone ?? ''}</span>
            <span>${j.address}</span>
          </div>
          ${j.notes ? `<p class="my-jobs__notes">${j.notes}</p>` : ''}
          <div class="my-jobs__footer">
            <span class="my-jobs__price">${formatCurrency(j.total ?? j.price)}</span>
            ${action ? `<button type="button" class="btn btn--primary btn--sm" data-advance="${j.id}" data-next="${action.next}">${action.label}</button>` : ''}
          </div>
        </div>`
      })
      .join('')

    qsa('[data-advance]', listEl).forEach((btn) => {
      btn.addEventListener('click', () => {
        updateJobStatus(btn.dataset.advance, btn.dataset.next)
        showToast(btn.dataset.next === 'completed' ? 'Job marked complete.' : 'Job started.')
        paint()
      })
    })
  }

  paint()
}
