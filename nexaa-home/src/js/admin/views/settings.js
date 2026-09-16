import { qs, qsa } from '../../lib/dom.js'
import { getDB, updateSettings, addService, removeService, resetDemoData } from '../../lib/store.js'
import { showToast } from '../../lib/toast.js'
import { openModal } from '../../lib/modal.js'
import { icon } from '../components/icons.js'

// Matches the icon keys understood by src/js/public/icons.js, so a service
// added here actually renders an icon on the public site instead of an
// empty svg (the old hardcoded `icon: 'check'` bug).
const SERVICE_ICONS = [
  { value: 'wrench', label: 'Wrench (repair)' },
  { value: 'droplet', label: 'Droplet (plumbing)' },
  { value: 'bolt', label: 'Bolt (electrical)' },
  { value: 'sparkle', label: 'Sparkle (cleaning)' },
  { value: 'wind', label: 'Wind (HVAC)' },
  { value: 'brush', label: 'Brush (painting)' },
  { value: 'shirt', label: 'Shirt (laundry)' },
]

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
]

export default function renderSettings(mount) {
  const { settings } = getDB()

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Settings</h1>
          <p>Business details, booking hours, notifications and the services catalog.</p>
        </div>
      </div>

      <div class="admin-cols-2">
        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Business details</h2></div>
          <form data-settings-form class="settings-form">
            <div class="field"><label>Business name</label><input name="businessName" value="${settings.businessName}" /></div>
            <div class="field"><label>Notification email</label><input name="notificationEmail" type="email" value="${settings.notificationEmail}" /></div>
            <div class="field"><label>Slot duration (minutes)</label><input name="slotDurationMinutes" type="number" min="15" step="15" value="${settings.slotDurationMinutes}" /></div>
            <button type="submit" class="btn btn--primary settings-form__submit">Save changes</button>
          </form>
        </div>

        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Services catalog</h2></div>
          <div data-services-list class="settings-service-list"></div>
          <form data-add-service class="settings-add-service">
            <input name="name" placeholder="New service name" required />
            <input name="price" type="number" placeholder="Price" required />
            <input name="gstRate" type="number" placeholder="GST %" value="18" />
            <select name="icon">${SERVICE_ICONS.map((i) => `<option value="${i.value}">${i.label}</option>`).join('')}</select>
            <button type="submit" class="btn btn--ghost btn--sm">Add</button>
          </form>
        </div>
      </div>

      <div class="admin-cols-2">
        <div class="admin-panel settings-hours">
          <div class="admin-panel__head"><h2>Booking hours</h2></div>
          <form data-hours-form>
            <div class="settings-hours__grid">
              ${DAYS.map((d) => {
                const hours = settings.businessHours?.[d.key] || { open: '09:00', close: '18:00', closed: false }
                return `
                <div class="settings-hours__row">
                  <span class="settings-hours__day">${d.label}</span>
                  <input type="time" name="${d.key}-open" value="${hours.open}" ${hours.closed ? 'disabled' : ''} />
                  <span>to</span>
                  <input type="time" name="${d.key}-close" value="${hours.close}" ${hours.closed ? 'disabled' : ''} />
                  <label class="settings-hours__closed">
                    <input type="checkbox" name="${d.key}-closed" data-closed-toggle="${d.key}" ${hours.closed ? 'checked' : ''} /> Closed
                  </label>
                </div>`
              }).join('')}
            </div>
            <button type="submit" class="btn btn--primary settings-form__submit">Save booking hours</button>
          </form>
        </div>

        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Service area</h2></div>
          <p class="settings-hint">Pincodes you currently serve — bookings outside this list are rejected. Leave empty to serve everywhere.</p>
          <form data-pincodes-form class="settings-form">
            <div class="field">
              <label>Served pincodes (comma separated)</label>
              <textarea name="pincodes" rows="4">${(settings.servedPincodes || []).join(', ')}</textarea>
            </div>
            <button type="submit" class="btn btn--primary settings-form__submit">Save service area</button>
          </form>
        </div>
      </div>

      <div class="admin-panel">
        <div class="admin-panel__head"><h2>Email notifications (EmailJS)</h2></div>
        <p class="settings-hint">Optional — without these, booking emails are simulated and logged under Notifications instead of actually sent.</p>
        <form data-emailjs-form class="settings-form">
          <div class="field"><label>EmailJS Service ID</label><input name="emailjsServiceId" value="${settings.emailjsServiceId || ''}" placeholder="service_xxxxxxx" /></div>
          <div class="field"><label>EmailJS Template ID</label><input name="emailjsTemplateId" value="${settings.emailjsTemplateId || ''}" placeholder="template_xxxxxxx" /></div>
          <div class="field"><label>EmailJS Public Key</label><input name="emailjsPublicKey" value="${settings.emailjsPublicKey || ''}" placeholder="public key" /></div>
          <button type="submit" class="btn btn--primary settings-form__submit">Save email settings</button>
        </form>
      </div>

      <div class="admin-panel settings-danger">
        <div class="admin-panel__head"><h2>Danger zone</h2></div>
        <p>Reset all jobs, customers, technicians and payments back to the original demo data.</p>
        <button class="btn btn--danger btn--sm" data-reset>${icon('trash', { size: 14 })} Reset demo data</button>
      </div>
    </div>`

  function paintServices() {
    const list = getDB().settings.services
    qs('[data-services-list]', mount).innerHTML = list
      .map(
        (s) => `
      <div class="settings-service-row">
        <span>${s.name} — ₹${s.basePrice} (GST ${s.gstRate ?? 0}%)</span>
        <button class="btn btn--ghost btn--sm" data-remove-service="${s.id}">${icon('trash', { size: 14 })}</button>
      </div>`
      )
      .join('')

    qsa('[data-remove-service]', mount).forEach((btn) =>
      btn.addEventListener('click', () => {
        removeService(btn.dataset.removeService)
        showToast('Service removed.')
        paintServices()
      })
    )
  }

  paintServices()

  qs('[data-settings-form]', mount).addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    updateSettings({
      businessName: data.get('businessName'),
      notificationEmail: data.get('notificationEmail'),
      slotDurationMinutes: Number(data.get('slotDurationMinutes')) || 60,
    })
    showToast('Settings saved.')
  })

  qs('[data-emailjs-form]', mount).addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    updateSettings({
      emailjsServiceId: data.get('emailjsServiceId').trim(),
      emailjsTemplateId: data.get('emailjsTemplateId').trim(),
      emailjsPublicKey: data.get('emailjsPublicKey').trim(),
    })
    showToast('Email settings saved.')
  })

  qsa('[data-closed-toggle]', mount).forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const day = checkbox.dataset.closedToggle
      const form = qs('[data-hours-form]', mount)
      form.elements[`${day}-open`].disabled = checkbox.checked
      form.elements[`${day}-close`].disabled = checkbox.checked
    })
  })

  qs('[data-hours-form]', mount).addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const businessHours = {}
    DAYS.forEach((d) => {
      businessHours[d.key] = {
        open: data.get(`${d.key}-open`),
        close: data.get(`${d.key}-close`),
        closed: data.get(`${d.key}-closed`) === 'on',
      }
    })
    updateSettings({ businessHours })
    showToast('Booking hours saved.')
  })

  qs('[data-add-service]', mount).addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const name = data.get('name').trim()
    if (!name) return
    addService({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: data.get('icon') || 'wrench',
      basePrice: Number(data.get('price')) || 0,
      gstRate: Number(data.get('gstRate')) || 0,
      hsnCode: '9987',
      description: `Professional ${name.toLowerCase()} service.`,
    })
    e.target.reset()
    showToast('Service added.')
    paintServices()
  })

  qs('[data-pincodes-form]', mount).addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const servedPincodes = data
      .get('pincodes')
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    updateSettings({ servedPincodes })
    showToast('Service area saved.')
  })

  qs('[data-reset]', mount).addEventListener('click', () => {
    openModal({
      title: 'Reset demo data',
      submitLabel: 'Reset data',
      danger: true,
      content: '<p>This will erase all current jobs, customers, technicians and payments, and restore the original demo data. This cannot be undone.</p>',
      onSubmit: () => {
        resetDemoData()
        showToast('Demo data reset.')
      },
    })
  })
}
