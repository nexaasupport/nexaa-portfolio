import { qs, qsa } from '../../lib/dom.js'
import { getJobsWithDetails, getDB, assignTechnician, updateJobStatus } from '../../lib/store.js'
import { openModal } from '../../lib/modal.js'
import { showToast } from '../../lib/toast.js'
import { STATUS_OPTIONS } from '../components/table.js'
import { icon } from '../components/icons.js'

const TIME_FORMAT = { hour: 'numeric', minute: '2-digit' }
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function renderCalendar(mount) {
  const viewMonth = new Date()
  viewMonth.setDate(1)

  function daysInGrid() {
    const startWeekday = viewMonth.getDay()
    const gridStart = new Date(viewMonth)
    gridStart.setDate(gridStart.getDate() - startWeekday)
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      return d
    })
  }

  function openJobModal(job, technicians, onSaved) {
    openModal({
      title: `${job.serviceInfo?.name ?? job.service} — ${job.customer?.name ?? 'Unknown'}`,
      submitLabel: 'Save',
      content: `
        <p class="admin-calendar__modal-address">${job.address}</p>
        <div class="field"><label>Technician</label>
          <select name="technicianId">
            <option value="">Unassigned</option>
            ${technicians.map((t) => `<option value="${t.id}" ${t.id === job.technicianId ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Status</label>
          <select name="status">
            ${STATUS_OPTIONS.map((s) => `<option value="${s.value}" ${s.value === job.status ? 'selected' : ''}>${s.label}</option>`).join('')}
          </select>
        </div>`,
      onSubmit: (data) => {
        const technicianId = data.get('technicianId')
        if (technicianId) assignTechnician(job.id, technicianId)
        updateJobStatus(job.id, data.get('status'))
        showToast('Job updated.')
        onSaved?.()
      },
    })
  }

  function openDayModal(dayJobs, technicians, dateLabel, onSaved) {
    openModal({
      title: dateLabel,
      submitLabel: 'Close',
      onSubmit: () => true,
      content: dayJobs
        .map(
          (j) => `<button type="button" class="admin-calendar__day-job" data-day-job="${j.id}">
            <span class="admin-calendar__job admin-calendar__job--${j.status}">${new Date(j.scheduledAt).toLocaleTimeString('en-IN', TIME_FORMAT)}</span>
            <span>${j.customer?.name ?? 'Unknown'} · ${j.serviceInfo?.name ?? j.service}</span>
          </button>`
        )
        .join(''),
    })
    qsa('[data-day-job]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const job = dayJobs.find((j) => j.id === btn.dataset.dayJob)
        if (job) openJobModal(job, technicians, onSaved)
      })
    })
  }

  function paint() {
    const jobs = getJobsWithDetails().filter((j) => j.scheduledAt)
    const technicians = getDB().technicians
    const monthLabel = viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    const days = daysInGrid()

    mount.innerHTML = `
      <div class="admin-view">
        <div class="admin-view__head">
          <div>
            <h1>Calendar</h1>
            <p>Every scheduled job across technicians.</p>
          </div>
          <div class="admin-toolbar admin-calendar__nav">
            <button class="btn btn--ghost btn--sm admin-calendar__nav-btn" data-cal-prev aria-label="Previous month">${icon('chevron-left', { size: 16 })}</button>
            <strong>${monthLabel}</strong>
            <button class="btn btn--ghost btn--sm admin-calendar__nav-btn" data-cal-next aria-label="Next month">${icon('chevron-right', { size: 16 })}</button>
          </div>
        </div>
        <div class="admin-panel">
          <div class="admin-calendar">
            <div class="admin-calendar__weekdays">${WEEKDAYS.map((d) => `<span>${d}</span>`).join('')}</div>
            <div class="admin-calendar__grid">
              ${days
                .map((d) => {
                  const outOfMonth = d.getMonth() !== viewMonth.getMonth()
                  const dayJobs = jobs.filter((j) => new Date(j.scheduledAt).toDateString() === d.toDateString())
                  return `<div class="admin-calendar__cell${outOfMonth ? ' is-muted' : ''}">
                    <div class="admin-calendar__date">${d.getDate()}</div>
                    <div class="admin-calendar__jobs">
                      ${dayJobs
                        .slice(0, 3)
                        .map(
                          (j) => `<button type="button" class="admin-calendar__job admin-calendar__job--${j.status}" data-job="${j.id}">
                          ${new Date(j.scheduledAt).toLocaleTimeString('en-IN', TIME_FORMAT)} · ${j.customer?.name ?? 'Unknown'}
                        </button>`
                        )
                        .join('')}
                      ${dayJobs.length > 3 ? `<button type="button" class="admin-calendar__more" data-more="${d.toISOString()}">+${dayJobs.length - 3} more</button>` : ''}
                    </div>
                  </div>`
                })
                .join('')}
            </div>
          </div>
        </div>
      </div>`

    qs('[data-cal-prev]', mount).addEventListener('click', () => {
      viewMonth.setMonth(viewMonth.getMonth() - 1)
      paint()
    })
    qs('[data-cal-next]', mount).addEventListener('click', () => {
      viewMonth.setMonth(viewMonth.getMonth() + 1)
      paint()
    })
    qsa('[data-job]', mount).forEach((btn) => {
      btn.addEventListener('click', () => {
        const job = jobs.find((j) => j.id === btn.dataset.job)
        if (job) openJobModal(job, technicians, paint)
      })
    })
    qsa('[data-more]', mount).forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = new Date(btn.dataset.more)
        const dayJobs = jobs.filter((j) => new Date(j.scheduledAt).toDateString() === d.toDateString())
        openDayModal(dayJobs, technicians, d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), paint)
      })
    })
  }

  paint()
}
