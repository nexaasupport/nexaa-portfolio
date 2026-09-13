export function barChart(rows) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return `
    <div class="bar-chart">
      ${rows
        .map(
          (r) => `
        <div class="bar-chart__row">
          <div class="bar-chart__name">${r.label}</div>
          <div class="bar-chart__track"><div class="bar-chart__fill" style="width:${Math.round((r.value / max) * 100)}%"></div></div>
          <div class="bar-chart__pct">${r.value}</div>
        </div>`
        )
        .join('')}
    </div>`
}
