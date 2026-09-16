import { qs, qsa } from '../lib/dom.js'
import { getAvailableSlots } from '../lib/store.js'

const MONTH_FORMAT = { month: 'long', year: 'numeric' }
const TIME_FORMAT = { hour: 'numeric', minute: '2-digit' }

const CHEVRON_LEFT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>'
const CHEVRON_RIGHT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function sameDay(a, b) {
  return a.toDateString() === b.toDateString()
}

// Renders a month calendar + slot list into `container`, calling
// `onSlotSelected(isoStringOrNull)` whenever the chosen slot changes.
export function renderCalendarPicker(container, { serviceId, onSlotSelected }) {
  const today = startOfDay(new Date())
  let viewMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  let selectedDate = null
  let selectedSlot = null

  function daysInGrid() {
    const firstOfMonth = new Date(viewMonth)
    const startWeekday = firstOfMonth.getDay()
    const gridStart = new Date(firstOfMonth)
    gridStart.setDate(gridStart.getDate() - startWeekday)
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      return d
    })
  }

  function paint() {
    const days = daysInGrid()
    const monthLabel = viewMonth.toLocaleDateString('en-IN', MONTH_FORMAT)

    container.innerHTML = `
      <div class="calendar-picker">
        <div class="calendar-picker__head">
          <button type="button" class="calendar-picker__nav" data-cal-prev aria-label="Previous month">${CHEVRON_LEFT}</button>
          <strong>${monthLabel}</strong>
          <button type="button" class="calendar-picker__nav" data-cal-next aria-label="Next month">${CHEVRON_RIGHT}</button>
        </div>
        <div class="calendar-picker__weekdays">
          ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span>${d}</span>`).join('')}
        </div>
        <div class="calendar-picker__grid">
          ${days
            .map((d) => {
              const outOfMonth = d.getMonth() !== viewMonth.getMonth()
              const isPast = d < today
              const slots = !outOfMonth && !isPast ? getAvailableSlots({ date: d, serviceId }) : []
              const full = !outOfMonth && !isPast && slots.length === 0
              const isSelected = selectedDate && sameDay(d, selectedDate)
              const disabled = outOfMonth || isPast || full
              return `<button type="button" class="calendar-picker__day${isSelected ? ' is-selected' : ''}${outOfMonth ? ' is-muted' : ''}${full ? ' is-full' : ''}"
                data-cal-day="${d.toISOString()}" ${disabled ? 'disabled' : ''}>${d.getDate()}</button>`
            })
            .join('')}
        </div>
        <div class="calendar-picker__slots" data-cal-slots>
          ${selectedDate ? '' : '<p class="calendar-picker__hint">Pick a date to see available times.</p>'}
        </div>
      </div>`

    if (selectedDate) paintSlots()

    qs('[data-cal-prev]', container).addEventListener('click', () => {
      viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
      paint()
    })
    qs('[data-cal-next]', container).addEventListener('click', () => {
      viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
      paint()
    })
    qsa('[data-cal-day]:not([disabled])', container).forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedDate = new Date(btn.dataset.calDay)
        selectedSlot = null
        onSlotSelected(null)
        paint()
      })
    })
  }

  function paintSlots() {
    const slotsEl = qs('[data-cal-slots]', container)
    const slots = getAvailableSlots({ date: selectedDate, serviceId })
    if (!slots.length) {
      slotsEl.innerHTML = '<p class="calendar-picker__hint">No times left that day — try another date.</p>'
      return
    }
    slotsEl.innerHTML = `
      <div class="calendar-picker__slot-grid">
        ${slots
          .map(
            (iso) => `<button type="button" class="calendar-picker__slot${selectedSlot === iso ? ' is-selected' : ''}" data-cal-slot="${iso}">
              ${new Date(iso).toLocaleTimeString('en-IN', TIME_FORMAT)}
            </button>`
          )
          .join('')}
      </div>`
    qsa('[data-cal-slot]', slotsEl).forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedSlot = btn.dataset.calSlot
        onSlotSelected(selectedSlot)
        paintSlots()
      })
    })
  }

  paint()
}
