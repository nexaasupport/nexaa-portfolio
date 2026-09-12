export function renderTable({ columns, rows, emptyMessage = 'Nothing to show yet.' }) {
  if (!rows.length) return `<div class="empty-state">${emptyMessage}</div>`
  return `
    <div class="data-table__wrap">
      <table class="data-table">
        <thead>
          <tr>${columns.map((c) => `<th>${c.label}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${columns.map((c) => `<td>${c.render(row)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>`
}

export const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function statusBadge(status) {
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label || status
  return `<span class="badge badge--${status}">${label}</span>`
}
