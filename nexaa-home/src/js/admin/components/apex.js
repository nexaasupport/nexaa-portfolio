// ApexCharts is a large dependency (~1MB) only needed on the Dashboard and
// Reports views — lazy-loaded on first chart mount so it doesn't bloat the
// initial bundle for every other admin page.
let apexChartsPromise = null
function loadApexCharts() {
  apexChartsPromise ??= import('apexcharts').then((m) => m.default)
  return apexChartsPromise
}

// Mirrors src/scss/base/_variables.scss (admin's _tokens.scss aliases the
// same source) — kept in sync by hand since Sass variables aren't reachable
// from JS without a build-time bridge.
export const PALETTE = {
  accent: '#456ed1', // $brand-500
  accentDark: '#2244a0', // $brand-700
  success: '#32b36e',
  warning: '#e9ab2b',
  danger: '#d74745',
  ink500: '#64748b',
  ink300: '#94a3b8',
}

const STATUS_COLORS = {
  new: PALETTE.warning,
  assigned: PALETTE.accent,
  in_progress: PALETTE.accent,
  completed: PALETTE.success,
  cancelled: PALETTE.danger,
}

const BASE_FONT = "'Inter', 'Segoe UI', sans-serif"

const instances = new WeakMap()

async function mount(el, options) {
  if (!el) return null
  instances.get(el)?.destroy()
  const ApexCharts = await loadApexCharts()
  if (el.isConnected === false) return null // view navigated away while loading
  const chart = new ApexCharts(el, options)
  chart.render()
  instances.set(el, chart)
  return chart
}

// Destroys any chart mounted on `el` or any descendant of `el` that this
// module tracked — call before an innerHTML wipe if you're not re-mounting
// into the same nodes, to avoid leaking ApexCharts instances/canvases.
export function destroyChartsIn(root) {
  root?.querySelectorAll?.('[data-chart]').forEach((el) => {
    instances.get(el)?.destroy()
    instances.delete(el)
  })
}

export function renderTrendChart(el, { categories, revenue, jobs }) {
  return mount(el, {
    chart: { type: 'area', height: 280, fontFamily: BASE_FONT, toolbar: { show: false }, animations: { easing: 'easeinout', speed: 500 } },
    series: [
      { name: 'Revenue (₹)', data: revenue },
      { name: 'Jobs completed', data: jobs },
    ],
    colors: [PALETTE.accent, PALETTE.success],
    stroke: { curve: 'smooth', width: 2.5 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
    dataLabels: { enabled: false },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4 },
    xaxis: { categories, labels: { style: { colors: '#64748b', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: [
      { seriesName: 'Revenue (₹)', labels: { style: { colors: '#64748b', fontSize: '11px' }, formatter: (v) => `₹${Math.round(v / 1000)}k` } },
      { seriesName: 'Jobs completed', opposite: true, labels: { style: { colors: '#64748b', fontSize: '11px' }, formatter: (v) => Math.round(v) } },
    ],
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '12px', labels: { colors: '#1e293b' } },
    tooltip: { theme: 'light' },
  })
}

export function renderStatusDonut(el, breakdown) {
  const labels = Object.keys(breakdown)
  const series = Object.values(breakdown)
  return mount(el, {
    chart: { type: 'donut', height: 260, fontFamily: BASE_FONT },
    series,
    labels: labels.map((l) => l.replace('_', ' ')),
    colors: labels.map((l) => STATUS_COLORS[l] || PALETTE.ink300),
    dataLabels: { enabled: true, style: { fontSize: '11px' } },
    legend: { position: 'bottom', fontSize: '12px', labels: { colors: '#1e293b' } },
    plotOptions: { pie: { donut: { labels: { show: true, total: { show: true, label: 'Total jobs', color: '#64748b' } } } } },
    stroke: { width: 2, colors: ['#fff'] },
  })
}

export function renderHorizontalBar(el, { categories, series, color = PALETTE.accent, formatter }) {
  return mount(el, {
    chart: { type: 'bar', height: Math.max(220, categories.length * 44), fontFamily: BASE_FONT, toolbar: { show: false } },
    series: [{ name: series.name, data: series.data }],
    colors: [color],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%' } },
    dataLabels: { enabled: true, style: { colors: ['#1e293b'], fontSize: '11px' }, formatter: formatter || ((v) => v), offsetX: 8 },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4 },
    xaxis: { categories, labels: { style: { colors: '#64748b', fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: '#1e293b', fontSize: '12px', fontWeight: 600 } } },
    tooltip: { theme: 'light' },
  })
}
