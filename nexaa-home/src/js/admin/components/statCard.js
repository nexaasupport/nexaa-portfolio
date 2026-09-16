import { icon } from './icons.js'

export function statCard(label, value, { delta, icon: iconName } = {}) {
  return `
    <div class="stat-card">
      ${iconName ? `<div class="stat-card__icon">${icon(iconName, { size: 18 })}</div>` : ''}
      <div class="stat-card__label">${label}</div>
      <div class="stat-card__value" data-counter>${value}</div>
      ${delta ? `<div class="stat-card__delta">${delta}</div>` : ''}
    </div>`
}
