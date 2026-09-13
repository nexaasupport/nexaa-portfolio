import { qs, qsa } from '../../lib/dom.js'
import { getDB, updateSettings, addService, removeService, resetDemoData } from '../../lib/store.js'
import { showToast } from '../../lib/toast.js'

export default function renderSettings(mount) {
  const { settings } = getDB()

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Settings</h1>
          <p>Business details and the services catalog shown on the public site.</p>
        </div>
      </div>

      <div class="admin-cols-2">
        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Business details</h2></div>
          <form data-settings-form style="display:flex;flex-direction:column;gap:14px">
            <div class="field"><label>Business name</label><input name="businessName" value="${settings.businessName}" /></div>
            <div class="field"><label>Notification email</label><input name="notificationEmail" type="email" value="${settings.notificationEmail}" /></div>
            <button type="submit" class="btn btn--primary" style="align-self:flex-start">Save changes</button>
          </form>
        </div>

        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Services catalog</h2></div>
          <div data-services-list style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px"></div>
          <form data-add-service style="display:flex;gap:8px">
            <input name="name" placeholder="New service name" required style="flex:1;padding:10px 12px;border:1px solid #ddd;border-radius:8px" />
            <input name="price" type="number" placeholder="Price" required style="width:100px;padding:10px 12px;border:1px solid #ddd;border-radius:8px" />
            <button type="submit" class="btn btn--ghost btn--sm">Add</button>
          </form>
        </div>
      </div>

      <div class="admin-panel" style="margin-top:18px;border-color:oklch(0.7 0.15 25 / 0.4)">
        <div class="admin-panel__head"><h2>Danger zone</h2></div>
        <p style="color:#666;font-size:0.88rem;margin-bottom:12px">Reset all jobs, customers, technicians and payments back to the original demo data.</p>
        <button class="btn btn--danger btn--sm" data-reset>Reset demo data</button>
      </div>
    </div>`

  function paintServices() {
    const list = getDB().settings.services
    qs('[data-services-list]', mount).innerHTML = list
      .map(
        (s) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border:1px solid #eee;border-radius:8px">
        <span>${s.name} — ₹${s.basePrice}</span>
        <button class="btn btn--ghost btn--sm" data-remove-service="${s.id}">Remove</button>
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
    updateSettings({ businessName: data.get('businessName'), notificationEmail: data.get('notificationEmail') })
    showToast('Settings saved.')
  })

  qs('[data-add-service]', mount).addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const name = data.get('name').trim()
    if (!name) return
    addService({ id: name.toLowerCase().replace(/\s+/g, '-'), name, icon: 'check', basePrice: Number(data.get('price')) || 0, description: `Professional ${name.toLowerCase()} service.` })
    e.target.reset()
    showToast('Service added.')
    paintServices()
  })

  qs('[data-reset]', mount).addEventListener('click', () => {
    if (confirm('This will erase all current jobs, customers and payments. Continue?')) {
      resetDemoData()
      showToast('Demo data reset.')
    }
  })
}
