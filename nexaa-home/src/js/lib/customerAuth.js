import { getCustomerByEmail, addCustomer, setCustomerCredentials } from './store.js'

const SESSION_KEY = 'nexaa_customer_session'
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000
const ATTEMPTS_KEY = 'nexaa_customer_login_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 30 * 1000

// Demo-only auth — this app has no backend, so "signing up" just writes a
// salted SHA-256 hash into the same localStorage store everything else
// lives in. It proves out a real account flow (signup, login, session,
// lockout) without pretending to be production-grade security.
export const DEMO_CUSTOMER = { email: 'meera.k@example.com', password: 'demo1234' }

async function hashPassword(password, salt) {
  const bytes = new TextEncoder().encode(salt + password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function randomSalt() {
  return [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function read() {
  const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    const session = JSON.parse(raw)
    if (session.loggedInAt && Date.now() - new Date(session.loggedInAt).getTime() > MAX_SESSION_AGE_MS) {
      logout()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function getSession() {
  return read()
}

export function isAuthenticated() {
  return Boolean(read())
}

function getAttempts() {
  try {
    return JSON.parse(sessionStorage.getItem(ATTEMPTS_KEY) || '{"count":0,"lockedUntil":0}')
  } catch {
    return { count: 0, lockedUntil: 0 }
  }
}

function setAttempts(attempts) {
  sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
}

export function getLockoutRemainingMs() {
  const { lockedUntil } = getAttempts()
  return Math.max(0, lockedUntil - Date.now())
}

function startSession(customer, remember) {
  const session = { customerId: customer.id, email: customer.email, name: customer.name, loggedInAt: new Date().toISOString() }
  const payload = JSON.stringify(session)
  if (remember) localStorage.setItem(SESSION_KEY, payload)
  else sessionStorage.setItem(SESSION_KEY, payload)
  return session
}

export async function signup({ name, email, phone, address, password, remember = true }) {
  const normalized = email.trim().toLowerCase()
  const existing = getCustomerByEmail(normalized)

  if (existing?.passwordHash) {
    return { ok: false, error: 'An account already exists for this email — log in instead.' }
  }

  const salt = randomSalt()
  const passwordHash = await hashPassword(password, salt)

  // A guest who booked before signing up gets their history attached to
  // the new account instead of losing it to a duplicate customer record.
  const customer = existing || addCustomer({ name, email: normalized, phone, address: address || '', createdAt: new Date().toISOString() })
  if (!existing) Object.assign(customer, { name, phone, address: address || '' })
  setCustomerCredentials(customer.id, { passwordHash, passwordSalt: salt })

  const session = startSession(customer, remember)
  return { ok: true, session }
}

export async function login({ email, password, remember }) {
  const remainingLockout = getLockoutRemainingMs()
  if (remainingLockout > 0) {
    return { ok: false, error: `Too many attempts. Try again in ${Math.ceil(remainingLockout / 1000)}s.` }
  }

  const normalized = email.trim().toLowerCase()
  const customer = getCustomerByEmail(normalized)
  const candidateHash = customer?.passwordSalt ? await hashPassword(password, customer.passwordSalt) : null
  const valid = customer?.passwordHash && candidateHash === customer.passwordHash

  if (!valid) {
    const attempts = getAttempts()
    attempts.count += 1
    if (attempts.count >= MAX_ATTEMPTS) {
      attempts.lockedUntil = Date.now() + LOCKOUT_MS
      attempts.count = 0
    }
    setAttempts(attempts)
    return { ok: false, error: 'Invalid email or password.' }
  }

  setAttempts({ count: 0, lockedUntil: 0 })
  const session = startSession(customer, remember)
  return { ok: true, session }
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(SESSION_KEY)
}
