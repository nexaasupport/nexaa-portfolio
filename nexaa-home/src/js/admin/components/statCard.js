export function statCard(label, value, delta) {
  return `
    <div class="stat-card">
      <div class="stat-card__label">${label}</div>
      <div class="stat-card__value">${value}</div>
      ${delta ? `<div class="stat-card__delta">${delta}</div>` : ''}
    </div>`
}
