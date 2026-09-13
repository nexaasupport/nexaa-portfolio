import { buildSeed } from '../data/seed.js'
import { uid } from './dom.js'

const STORAGE_KEY = 'nexaa_home_db'
const CHANGE_EVENT = 'nexaa-home:change'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to read nexaa-home store, reseeding.', err)
  }
  const seed = buildSeed()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

let db = load()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
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
export function findOrCreateCustomer({ name, email, phone, address }) {
  const existing = db.customers.find((c) => c.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    Object.assign(existing, { name, phone, address: address || existing.address })
    persist()
    return existing
  }
  const customer = { id: uid('cust'), name, email, phone, address: address || '', createdAt: new Date().toISOString() }
  db.customers.push(customer)
  persist()
  return customer
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

// --- jobs ---
export function addJob({ customer, service, address, notes, price, scheduledAt = null, status = 'new' }) {
  const job = {
    id: uid('job'),
    customerId: customer.id,
    service,
    address,
    notes,
    price,
    status,
    technicianId: null,
    scheduledAt,
    createdAt: new Date().toISOString(),
  }
  db.jobs.unshift(job)
  logActivity('job_created', `New job request (${service}) from ${customer.name}.`)
  persist()
  return job
}

export function assignTechnician(jobId, technicianId) {
  const job = db.jobs.find((j) => j.id === jobId)
  const tech = db.technicians.find((t) => t.id === technicianId)
  if (!job || !tech) return
  job.technicianId = technicianId
  if (job.status === 'new') job.status = 'assigned'
  tech.status = 'on_job'
  logActivity('job_assigned', `${tech.name} assigned to job for ${db.customers.find((c) => c.id === job.customerId)?.name ?? 'a customer'}.`)
  persist()
}

export function updateJobStatus(jobId, status) {
  const job = db.jobs.find((j) => j.id === jobId)
  if (!job) return
  job.status = status
  const customerName = db.customers.find((c) => c.id === job.customerId)?.name ?? 'a customer'

  if (status === 'completed') {
    const tech = db.technicians.find((t) => t.id === job.technicianId)
    if (tech) {
      tech.completedJobs += 1
      tech.status = 'available'
    }
    if (!db.payments.some((p) => p.jobId === job.id)) {
      db.payments.unshift({ id: uid('pay'), jobId: job.id, customerId: job.customerId, amount: job.price, method: 'UPI', status: 'pending', date: new Date().toISOString() })
    }
    logActivity('job_completed', `Job for ${customerName} marked completed.`)
  } else if (status === 'cancelled') {
    const tech = db.technicians.find((t) => t.id === job.technicianId)
    if (tech) tech.status = 'available'
    logActivity('job_cancelled', `Job for ${customerName} was cancelled.`)
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
export function markPaymentPaid(paymentId) {
  const payment = db.payments.find((p) => p.id === paymentId)
  if (!payment) return
  payment.status = 'paid'
  logActivity('payment_received', `Payment of ${payment.amount} marked as paid.`)
  persist()
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
