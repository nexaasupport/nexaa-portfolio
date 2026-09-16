import { qs, qsa, initials } from '../../lib/dom.js'
import { getDB, addTechnician, updateTechnician, removeTechnician } from '../../lib/store.js'
import { openModal } from '../../lib/modal.js'
import { showToast } from '../../lib/toast.js'
import { DEFAULT_SERVICES } from '../../data/services.js'
import { icon } from '../components/icons.js'
import { paginate, renderPagination, attachPagination } from '../components/pagination.js'

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'on_job', label: 'On job' },
  { value: 'off', label: 'Off shift' },
]
const PAGE_SIZE = 9

function specialtyModalFields(tech) {
  return `
    <div class="field"><label>Name</label><input name="name" value="${tech?.name || ''}" required /></div>
    <div class="field"><label>Specialty</label>
      <select name="serviceId">${DEFAULT_SERVICES.map((s) => `<option value="${s.id}" ${tech?.skills?.[0] === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select>
    </div>`
}

export default function renderTechnicians(mount) {
  let page = 1

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Technicians</h1>
          <p>Your service pro roster and current availability.</p>
        </div>
        <button class="btn btn--primary btn--sm" data-add-tech>${icon('plus', { size: 16 })} Add Technician</button>
      </div>
      <div class="tech-grid" data-cards></div>
      <div data-pagination></div>
    </div>`

  function paint() {
    const all = getDB().technicians
    const { rows: techs, pages, total } = paginate(all, page, PAGE_SIZE)
    qs('[data-cards]', mount).innerHTML = techs
      .map(
        (t) => `
      <div class="tech-card">
        <div class="tech-card__head">
          <div class="tech-card__avatar">${initials(t.name)}</div>
          <div>
            <div class="tech-card__name">${t.name}</div>
            <div class="tech-card__specialty">${t.specialty}</div>
          </div>
          <div class="tech-card__row-actions">
            <button class="btn btn--ghost btn--sm" data-edit="${t.id}" aria-label="Edit technician">${icon('edit', { size: 14 })}</button>
            <button class="btn btn--ghost btn--sm" data-remove="${t.id}" aria-label="Remove technician">${icon('trash', { size: 14 })}</button>
          </div>
        </div>
        <div class="tech-card__meta">
          <span class="badge badge--${t.status}">${STATUS_OPTIONS.find((s) => s.value === t.status)?.label}</span>
          <span class="tech-card__completed">${t.completedJobs} completed${t.rating ? ` · ${t.rating}★ (${t.ratingCount})` : ''}</span>
        </div>
        <select class="inline-select tech-card__status" data-status="${t.id}">
          ${STATUS_OPTIONS.map((s) => `<option value="${s.value}" ${s.value === t.status ? 'selected' : ''}>${s.label}</option>`).join('')}
        </select>
      </div>`
      )
      .join('')
    qs('[data-pagination]', mount).innerHTML = renderPagination({ page, pages, total, pageSize: PAGE_SIZE })
    attachPagination(mount, { onChange: (p) => { page = p; paint() } })

    qsa('[data-status]', mount).forEach((el) => el.addEventListener('change', () => updateTechnician(el.dataset.status, { status: el.value })))

    qsa('[data-edit]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        const tech = techs.find((t) => t.id === btn.dataset.edit)
        openModal({
          title: 'Edit technician',
          submitLabel: 'Save changes',
          content: specialtyModalFields(tech),
          onSubmit: (data) => {
            const service = DEFAULT_SERVICES.find((s) => s.id === data.get('serviceId'))
            updateTechnician(tech.id, { name: data.get('name'), specialty: service?.name ?? tech.specialty, skills: service ? [service.id] : tech.skills })
            showToast('Technician updated.')
            paint()
          },
        })
      })
    )

    qsa('[data-remove]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        const tech = techs.find((t) => t.id === btn.dataset.remove)
        openModal({
          title: 'Remove technician',
          submitLabel: 'Remove',
          danger: true,
          content: `<p>Remove <strong>${tech.name}</strong> from the roster? Any jobs assigned to them will become unassigned.</p>`,
          onSubmit: () => {
            removeTechnician(tech.id)
            showToast('Technician removed.')
            paint()
          },
        })
      })
    )
  }

  paint()

  qs('[data-add-tech]', mount).addEventListener('click', () => {
    openModal({
      title: 'Add technician',
      submitLabel: 'Add technician',
      content: specialtyModalFields(),
      onSubmit: (data) => {
        const service = DEFAULT_SERVICES.find((s) => s.id === data.get('serviceId'))
        addTechnician({ name: data.get('name'), specialty: service?.name ?? '', skills: service ? [service.id] : [] })
        showToast('Technician added.')
        paint()
      },
    })
  })
}
