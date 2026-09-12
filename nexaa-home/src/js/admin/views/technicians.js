import { qs, qsa, initials } from '../../lib/dom.js'
import { getDB, addTechnician, updateTechnician } from '../../lib/store.js'
import { openModal } from '../../lib/modal.js'
import { showToast } from '../../lib/toast.js'
import { DEFAULT_SERVICES } from '../../data/services.js'

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'on_job', label: 'On job' },
  { value: 'off', label: 'Off shift' },
]

export default function renderTechnicians(mount) {
  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Technicians</h1>
          <p>Your service pro roster and current availability.</p>
        </div>
        <button class="btn btn--primary btn--sm" data-add-tech>+ Add Technician</button>
      </div>
      <div class="admin-grid" data-cards style="grid-template-columns:repeat(3,1fr)"></div>
    </div>`

  function paint() {
    const techs = getDB().technicians
    qs('[data-cards]', mount).innerHTML = techs
      .map(
        (t) => `
      <div class="admin-panel">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div class="avatar-sm" style="width:40px;height:40px;font-size:0.85rem">${initials(t.name)}</div>
          <div>
            <div style="font-weight:600">${t.name}</div>
            <div style="font-size:0.8rem;color:var(--ink-500,#666)">${t.specialty}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span class="badge badge--${t.status}">${STATUS_OPTIONS.find((s) => s.value === t.status)?.label}</span>
          <span style="font-size:0.82rem;color:#666">${t.completedJobs} completed</span>
        </div>
        <select class="inline-select" data-status="${t.id}" style="width:100%">
          ${STATUS_OPTIONS.map((s) => `<option value="${s.value}" ${s.value === t.status ? 'selected' : ''}>${s.label}</option>`).join('')}
        </select>
      </div>`
      )
      .join('')

    qsa('[data-status]', mount).forEach((el) => el.addEventListener('change', () => updateTechnician(el.dataset.status, { status: el.value })))
  }

  paint()

  qs('[data-add-tech]', mount).addEventListener('click', () => {
    openModal({
      title: 'Add technician',
      submitLabel: 'Add technician',
      content: `
        <div class="field"><label>Name</label><input name="name" required /></div>
        <div class="field"><label>Specialty</label>
          <select name="specialty">${DEFAULT_SERVICES.map((s) => `<option value="${s.name}">${s.name}</option>`).join('')}</select>
        </div>`,
      onSubmit: (data) => {
        addTechnician({ name: data.get('name'), specialty: data.get('specialty') })
        showToast('Technician added.')
        paint()
      },
    })
  })
}
