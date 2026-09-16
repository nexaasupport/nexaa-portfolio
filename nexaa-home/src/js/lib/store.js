import { buildSeed } from '../data/seed.js'
import { uid } from './dom.js'

const STORAGE_KEY = 'nexaa_home_db'
const CHANGE_EVENT = 'nexaa-home:change'
const PERSIST_ERROR_EVENT = 'nexaa-home:persist-error'

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

// Fills in fields added after a browser already has a persisted DB, so
// existing localStorage demos don't break when the schema grows.
function backfill(data) {
  const seed = buildSeed()
  data.notifications = data.notifications || []
  data.reviews = data.reviews || []
  data.settings = { ...seed.settings, ...data.settings }
  data.settings.businessHours = data.settings.businessHours || seed.settings.businessHours
  data.settings.servedPincodes = data.settings.servedPincodes || seed.settings.servedPincodes
  data.settings.nextInvoiceNumber = data.settings.nextInvoiceNumber || seed.settings.nextInvoiceNumber
  data.customers = (data.customers || []).map((c) => ({ passwordHash: null, passwordSalt: null, ...c }))
  data.technicians = (data.technicians || []).map((t) => ({ skills: [], rating: null, ratingCount: 0, ...t }))
  data.jobs = (data.jobs || []).map((j) => ({ durationMinutes: data.settings.slotDurationMinutes || 60, cancellationReason: null, ...j }))
  return data
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return backfill(JSON.parse(raw))
  } catch (err) {
    console.warn('Failed to read nexaa-home store, reseeding.', err)
  }
  const seed = buildSeed()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

let db = load()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch (err) {
    console.warn('Failed to save — storage may be full or disabled.', err)
    window.dispatchEvent(new CustomEvent(PERSIST_ERROR_EVENT))
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function onPersistError(handler) {
  window.addEventListener(PERSIST_ERROR_EVENT, handler)
  return () => window.removeEventListener(PERSIST_ERROR_EVENT, handler)
}

function logActivity(type, message) {
  db.activity.unshift({ id: uid('act'), type, message, at: new Date().toISOString() })
  db.activity = db.activity.slice(0, 50)
}

export function subscribe(handler) {
  const onChange = () => handler(db)
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      db = load()
      handler(db)
    }
  })
  return () => window.removeEventListener(CHANGE_EVENT, onChange)
}

export function getDB() {
  return db
}

export function resetDemoData() {
  db = buildSeed()
  persist()
}

// --- customers ---
export function getCustomerByEmail(email) {
  return db.customers.find((c) => c.email.toLowerCase() === email.toLowerCase()) || null
}

export function findOrCreateCustomer({ name, email, phone, address }) {
  const existing = getCustomerByEmail(email)
  if (existing) {
    Object.assign(existing, { name, phone, address: address || existing.address })
    persist()
    return existing
  }
  const customer = { id: uid('cust'), name, email, phone, address: address || '', createdAt: new Date().toISOString(), passwordHash: null, passwordSalt: null }
  db.customers.push(customer)
  persist()
  return customer
}

export function setCustomerCredentials(customerId, { passwordHash, passwordSalt }) {
  const customer = db.customers.find((c) => c.id === customerId)
  if (!customer) return
  customer.passwordHash = passwordHash
  customer.passwordSalt = passwordSalt
  persist()
}

export function addCustomer(data) {
  const customer = { id: uid('cust'), createdAt: new Date().toISOString(), ...data }
  db.customers.push(customer)
  logActivity('customer_added', `New customer added: ${customer.name}.`)
  persist()
  return customer
}

export function updateCustomer(id, patch) {
  const customer = db.customers.find((c) => c.id === id)
  if (!customer) return
  Object.assign(customer, patch)
  persist()
}

// --- technicians ---
export function addTechnician(data) {
  const tech = { id: uid('tech'), status: 'available', completedJobs: 0, createdAt: new Date().toISOString(), ...data }
  db.technicians.push(tech)
  logActivity('technician_added', `${tech.name} joined the technician roster.`)
  persist()
  return tech
}

export function updateTechnician(id, patch) {
  const tech = db.technicians.find((t) => t.id === id)
  if (!tech) return
  Object.assign(tech, patch)
  persist()
}

export function removeTechnician(id) {
  db.technicians = db.technicians.filter((t) => t.id !== id)
  db.jobs.forEach((j) => { if (j.technicianId === id) j.technicianId = null })
  persist()
}

// --- jobs ---
export function addJob({ customer, service, address, pincode = '', notes, price, scheduledAt = null, durationMinutes = null, status = 'new' }) {
  const serviceInfo = db.settings.services.find((s) => s.id === service)
  const gstRate = serviceInfo?.gstRate ?? 0

  const job = {
    id: uid('job'),
    customerId: customer.id,
    service,
    address,
    pincode,
    notes,
    price,
    gstRate,
    taxAmount: Math.round(price * (gstRate / 100)),
    total: price + Math.round(price * (gstRate / 100)),
    status,
    technicianId: null,
    scheduledAt,
    durationMinutes: durationMinutes || db.settings.slotDurationMinutes || 60,
    cancellationReason: null,
    createdAt: new Date().toISOString(),
    assignedAt: null,
    startedAt: null,
    completedAt: null,
    cancelledAt: null,
  }
  db.jobs.unshift(job)
  logActivity('job_created', `New job request (${service}) from ${customer.name}.`)
  persist()
  return job
}

export function isServedPincode(pincode) {
  const list = db.settings.servedPincodes || []
  if (!list.length) return true
  return list.includes(String(pincode).trim())
}

// --- scheduling ---
function overlaps(aStart, aMinutes, bStart, bMinutes) {
  const aEnd = aStart + aMinutes * 60000
  const bEnd = bStart + bMinutes * 60000
  return aStart < bEnd && bStart < aEnd
}

function dayKeyFor(date) {
  return DAY_KEYS[date.getDay()]
}

function techniciansForService(serviceId) {
  return db.technicians.filter((t) => t.status !== 'off' && (t.skills || []).includes(serviceId))
}

function isTechnicianFree(technicianId, startIso, durationMinutes, ignoreJobId = null) {
  const start = new Date(startIso).getTime()
  return !db.jobs.some((j) => {
    if (j.id === ignoreJobId) return false
    if (j.technicianId !== technicianId) return false
    if (j.status === 'cancelled' || !j.scheduledAt) return false
    return overlaps(start, durationMinutes, new Date(j.scheduledAt).getTime(), j.durationMinutes || 60)
  })
}

// Returns available start times (ISO strings) for a given calendar day + service,
// based on business hours and per-technician job overlap.
export function getAvailableSlots({ date, serviceId }) {
  const day = new Date(date)
  const hours = db.settings.businessHours?.[dayKeyFor(day)]
  const duration = db.settings.slotDurationMinutes || 60
  if (!hours || hours.closed) return []

  const technicians = techniciansForService(serviceId)
  if (!technicians.length) return []

  const [openH, openM] = hours.open.split(':').map(Number)
  const [closeH, closeM] = hours.close.split(':').map(Number)

  const slotStart = new Date(day)
  slotStart.setHours(openH, openM, 0, 0)
  const slotEnd = new Date(day)
  slotEnd.setHours(closeH, closeM, 0, 0)

  const now = Date.now()
  const slots = []
  for (let t = slotStart.getTime(); t + duration * 60000 <= slotEnd.getTime(); t += duration * 60000) {
    if (t <= now) continue
    const iso = new Date(t).toISOString()
    const hasFreeTechnician = technicians.some((tech) => isTechnicianFree(tech.id, iso, duration))
    if (hasFreeTechnician) slots.push(iso)
  }
  return slots
}

export function bookJob({ customer, service, address, pincode, notes, price, scheduledAt, durationMinutes }) {
  const duration = durationMinutes || db.settings.slotDurationMinutes || 60
  const technician = techniciansForService(service).find((tech) => isTechnicianFree(tech.id, scheduledAt, duration))

  const job = addJob({ customer, service, address, pincode, notes, price, scheduledAt, durationMinutes: duration })
  if (technician) assignTechnician(job.id, technician.id)
  return job
}

export function rescheduleJob(jobId, newScheduledAt) {
  const job = db.jobs.find((j) => j.id === jobId)
  if (!job) return { ok: false, error: 'Booking not found.' }

  const duration = job.durationMinutes || db.settings.slotDurationMinutes || 60
  if (job.technicianId && !isTechnicianFree(job.technicianId, newScheduledAt, duration, jobId)) {
    const stillHasOption = techniciansForService(job.service).some((tech) => isTechnicianFree(tech.id, newScheduledAt, duration, jobId))
    if (!stillHasOption) return { ok: false, error: 'That slot is no longer available.' }
  }

  job.scheduledAt = newScheduledAt
  const customer = db.customers.find((c) => c.id === job.customerId)
  logActivity('job_updated', `Booking for ${customer?.name ?? 'a customer'} rescheduled.`)
  persist()
  return { ok: true, job, customer }
}

export function cancelJob(jobId, reason = '') {
  const job = db.jobs.find((j) => j.id === jobId)
  if (!job) return { ok: false, error: 'Booking not found.' }
  const customer = db.customers.find((c) => c.id === job.customerId)
  job.cancellationReason = reason || null
  updateJobStatus(jobId, 'cancelled')
  return { ok: true, job, customer, reason }
}

// --- notifications ---
export function getNotifications() {
  return db.notifications
}

export function addNotification({ type, jobId, to, subject, body, status = 'skipped', channel = 'email' }) {
  const notification = { id: uid('notif'), type, channel, jobId, to, subject, body, status, sentAt: new Date().toISOString() }
  db.notifications.unshift(notification)
  db.notifications = db.notifications.slice(0, 50)
  persist()
  return notification
}

export function updateNotificationStatus(id, status) {
  const notification = db.notifications.find((n) => n.id === id)
  if (!notification) return
  notification.status = status
  persist()
}

export function assignTechnician(jobId, technicianId) {
  const job = db.jobs.find((j) => j.id === jobId)
  const tech = db.technicians.find((t) => t.id === technicianId)
  if (!job || !tech) return
  job.technicianId = technicianId
  if (job.status === 'new') job.status = 'assigned'
  if (!job.assignedAt) job.assignedAt = new Date().toISOString()
  tech.status = 'on_job'
  logActivity('job_assigned', `${tech.name} assigned to job for ${db.customers.find((c) => c.id === job.customerId)?.name ?? 'a customer'}.`)
  persist()
}

function nextInvoiceNumber() {
  const year = new Date().getFullYear()
  const n = db.settings.nextInvoiceNumber || 1
  db.settings.nextInvoiceNumber = n + 1
  return `INV-${year}-${String(n).padStart(4, '0')}`
}

export function updateJobStatus(jobId, status) {
  const job = db.jobs.find((j) => j.id === jobId)
  if (!job) return
  job.status = status
  const now = new Date().toISOString()
  const customerName = db.customers.find((c) => c.id === job.customerId)?.name ?? 'a customer'

  if (status === 'in_progress') {
    job.startedAt = job.startedAt || now
    logActivity('job_updated', `Job for ${customerName} started.`)
  } else if (status === 'completed') {
    job.completedAt = now
    const tech = db.technicians.find((t) => t.id === job.technicianId)
    if (tech) {
      tech.completedJobs += 1
      tech.status = 'available'
    }
    if (!db.payments.some((p) => p.jobId === job.id)) {
      db.payments.unshift({
        id: uid('pay'),
        jobId: job.id,
        customerId: job.customerId,
        invoiceNumber: nextInvoiceNumber(),
        subtotal: job.price,
        taxRate: job.gstRate || 0,
        taxAmount: job.taxAmount || 0,
        amount: job.total ?? job.price,
        method: 'UPI',
        status: 'pending',
        date: now,
      })
    }
    logActivity('job_completed', `Job for ${customerName} marked completed.`)
  } else if (status === 'cancelled') {
    job.cancelledAt = now
    const tech = db.technicians.find((t) => t.id === job.technicianId)
    if (tech) tech.status = 'available'
    logActivity('job_cancelled', `Job for ${customerName} was cancelled.${job.cancellationReason ? ` Reason: ${job.cancellationReason}.` : ''}`)
  } else {
    logActivity('job_updated', `Job for ${customerName} moved to "${status.replace('_', ' ')}".`)
  }
  persist()
}

export function deleteJob(jobId) {
  db.jobs = db.jobs.filter((j) => j.id !== jobId)
  db.payments = db.payments.filter((p) => p.jobId !== jobId)
  persist()
}

// --- payments ---
export function markPaymentPaid(paymentId, method) {
  const payment = db.payments.find((p) => p.id === paymentId)
  if (!payment) return
  payment.status = 'paid'
  if (method) payment.method = method
  logActivity('payment_received', `Payment of ${payment.amount} marked as paid.`)
  persist()
}

export function getPaymentForJob(jobId) {
  return db.payments.find((p) => p.jobId === jobId) || null
}

// --- reviews ---
export function getReviewForJob(jobId) {
  return db.reviews.find((r) => r.jobId === jobId) || null
}

export function addReview({ jobId, technicianId, rating, comment }) {
  if (getReviewForJob(jobId)) return null
  const review = { id: uid('review'), jobId, technicianId, rating, comment: comment || '', createdAt: new Date().toISOString() }
  db.reviews.push(review)

  if (technicianId) {
    const tech = db.technicians.find((t) => t.id === technicianId)
    if (tech) {
      const total = (tech.rating || 0) * (tech.ratingCount || 0) + rating
      tech.ratingCount = (tech.ratingCount || 0) + 1
      tech.rating = Math.round((total / tech.ratingCount) * 10) / 10
    }
  }
  logActivity('review_added', `New ${rating}-star review received.`)
  persist()
  return review
}

// --- settings ---
export function updateSettings(patch) {
  db.settings = { ...db.settings, ...patch }
  persist()
}

export function addService(service) {
  db.settings.services.push(service)
  persist()
}

export function removeService(serviceId) {
  db.settings.services = db.settings.services.filter((s) => s.id !== serviceId)
  persist()
}

// --- derived selectors ---
export function getServices() {
  return db.settings.services
}

export function getJobsWithDetails() {
  return db.jobs.map((job) => ({
    ...job,
    customer: db.customers.find((c) => c.id === job.customerId) || null,
    technician: db.technicians.find((t) => t.id === job.technicianId) || null,
    serviceInfo: getServices().find((s) => s.id === job.service) || null,
  }))
}

// --- reporting / analytics ---

// Last N months (oldest first) of paid revenue + completed job counts, for
// trend charts. Keys are 'YYYY-MM'.
export function getRevenueTrend(months = 6) {
  const now = new Date()
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    return { key: d.toISOString().slice(0, 7), label: d.toLocaleDateString('en-IN', { month: 'short' }), revenue: 0, jobs: 0 }
  })
  const byKey = new Map(buckets.map((b) => [b.key, b]))

  db.payments.forEach((p) => {
    if (p.status !== 'paid') return
    const bucket = byKey.get(p.date.slice(0, 7))
    if (bucket) bucket.revenue += p.amount
  })
  db.jobs.forEach((j) => {
    if (j.status !== 'completed' || !j.completedAt) return
    const bucket = byKey.get(j.completedAt.slice(0, 7))
    if (bucket) bucket.jobs += 1
  })
  return buckets
}

export function getJobStatusBreakdown() {
  const counts = {}
  db.jobs.forEach((j) => { counts[j.status] = (counts[j.status] || 0) + 1 })
  return counts
}

export function getServicePopularity() {
  const counts = {}
  db.jobs.forEach((j) => { counts[j.service] = (counts[j.service] || 0) + 1 })
  return getServices()
    .map((s) => ({ id: s.id, name: s.name, count: counts[s.id] || 0 }))
    .sort((a, b) => b.count - a.count)
}

export function getTechnicianPerformance() {
  return db.technicians
    .map((t) => ({ id: t.id, name: t.name, completedJobs: t.completedJobs || 0, rating: t.rating || 0 }))
    .sort((a, b) => b.completedJobs - a.completedJobs)
}

export function getJobsForCustomer(customerId) {
  return getJobsWithDetails().filter((j) => j.customerId === customerId)
}

export function getDashboardStats() {
  const today = new Date().toDateString()
  const monthKey = new Date().toISOString().slice(0, 7)
  const jobsToday = db.jobs.filter((j) => new Date(j.createdAt).toDateString() === today).length
  const unassigned = db.jobs.filter((j) => j.status === 'new').length
  const activeCustomers = db.customers.length
  const revenueMTD = db.payments
    .filter((p) => p.status === 'paid' && p.date.slice(0, 7) === monthKey)
    .reduce((sum, p) => sum + p.amount, 0)
  return { jobsToday, unassigned, activeCustomers, revenueMTD }
}
