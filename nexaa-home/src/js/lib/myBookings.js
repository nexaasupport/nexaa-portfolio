const KEY = 'nexaa_my_bookings'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

// Remembers a booking reference locally so a returning visitor doesn't have
// to re-type the reference code — purely a convenience, not authentication
// (the manage-booking lookup still re-verifies email + job id against the store).
export function rememberBooking(jobId, email) {
  const list = read().filter((b) => b.jobId !== jobId)
  list.unshift({ jobId, email, at: new Date().toISOString() })
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10)))
}

export function getRememberedBookings() {
  return read()
}
