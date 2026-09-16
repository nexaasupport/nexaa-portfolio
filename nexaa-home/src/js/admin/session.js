const SESSION_KEY = 'nexaa_admin_session'
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000
const ATTEMPTS_KEY = 'nexaa_admin_login_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 30 * 1000

// Demo-only accounts — this app has no backend, so there is nothing to
// authenticate against. Two fixed roles keep the login screen real (wrong
// credentials are rejected) while also modeling the two people who'd
// actually use a system like this: an owner/dispatcher and a technician.
export const DEMO_ACCOUNTS = [
  { email: 'admin@nexaahome.com', password: 'nexaa123', role: 'owner', name: 'Admin' },
  { email: 'arjun@nexaahome.com', password: 'tech123', role: 'technician', name: 'Arjun Mehta', technicianId: 'tech_1' },
]

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

export function login({ email, password, remember }) {
  const remainingLockout = getLockoutRemainingMs()
  if (remainingLockout > 0) {
    return { ok: false, error: `Too many attempts. Try again in ${Math.ceil(remainingLockout / 1000)}s.` }
  }

  const normalized = email.trim().toLowerCase()
  const account = DEMO_ACCOUNTS.find((a) => a.email === normalized && a.password === password)

  if (!account) {
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
  const session = {
    email: account.email,
    name: account.name,
    role: account.role,
    technicianId: account.technicianId || null,
    loggedInAt: new Date().toISOString(),
  }
  const payload = JSON.stringify(session)
  if (remember) localStorage.setItem(SESSION_KEY, payload)
  else sessionStorage.setItem(SESSION_KEY, payload)
  return { ok: true, session }
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(SESSION_KEY)
}
