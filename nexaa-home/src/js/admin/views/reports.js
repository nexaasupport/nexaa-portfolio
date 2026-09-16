import { formatCurrency } from '../../lib/dom.js'
import { getRevenueTrend, getJobStatusBreakdown, getServicePopularity, getTechnicianPerformance, getDB } from '../../lib/store.js'
import { statCard } from '../components/statCard.js'
import { renderTrendChart, renderStatusDonut, renderHorizontalBar, destroyChartsIn } from '../components/apex.js'
import { qs } from '../../lib/dom.js'

export default function renderReports(mount) {
  destroyChartsIn(mount)

  const trend = getRevenueTrend(6)
  const statusBreakdown = getJobStatusBreakdown()
  const services = getServicePopularity().filter((s) => s.count > 0)
  const technicians = getTechnicianPerformance()

  const totalRevenue = trend.reduce((sum, t) => sum + t.revenue, 0)
  const totalCompleted = trend.reduce((sum, t) => sum + t.jobs, 0)
  const totalJobs = Object.values(statusBreakdown).reduce((a, b) => a + b, 0)
  const cancelled = statusBreakdown.cancelled || 0
  const completionRate = totalJobs ? Math.round(((totalJobs - cancelled) / totalJobs) * 100) : 0
  const avgJobValue = totalCompleted ? Math.round(totalRevenue / totalCompleted) : 0

  mount.innerHTML = `
    <div class="admin-view">
      <div class="admin-view__head">
        <div>
          <h1>Reports</h1>
          <p>Revenue, job mix and technician performance over the last 6 months.</p>
        </div>
      </div>

      <div class="admin-grid">
        ${statCard('Revenue (6mo)', formatCurrency(totalRevenue), { icon: 'trending-up' })}
        ${statCard('Jobs Completed (6mo)', totalCompleted, { icon: 'jobs' })}
        ${statCard('Completion Rate', `${completionRate}%`, { icon: 'user-check' })}
        ${statCard('Avg. Job Value', formatCurrency(avgJobValue), { icon: 'wallet' })}
      </div>

      <div class="admin-panel admin-panel--mb">
        <div class="admin-panel__head"><h2>Revenue &amp; completed jobs</h2></div>
        <div data-chart="trend"></div>
      </div>

      <div class="admin-cols-2">
        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Jobs by status</h2></div>
          ${totalJobs ? '<div data-chart="status"></div>' : '<div class="empty-state">No jobs yet.</div>'}
        </div>
        <div class="admin-panel">
          <div class="admin-panel__head"><h2>Most-booked services</h2></div>
          ${services.length ? '<div data-chart="services"></div>' : '<div class="empty-state">No completed bookings yet.</div>'}
        </div>
      </div>

      <div class="admin-panel">
        <div class="admin-panel__head"><h2>Technician performance</h2></div>
        ${technicians.length ? '<div data-chart="technicians"></div>' : '<div class="empty-state">No technicians yet.</div>'}
      </div>
    </div>`

  renderTrendChart(qs('[data-chart="trend"]', mount), {
    categories: trend.map((t) => t.label),
    revenue: trend.map((t) => t.revenue),
    jobs: trend.map((t) => t.jobs),
  })

  if (totalJobs) renderStatusDonut(qs('[data-chart="status"]', mount), statusBreakdown)

  if (services.length) {
    renderHorizontalBar(qs('[data-chart="services"]', mount), {
      categories: services.map((s) => s.name),
      series: { name: 'Bookings', data: services.map((s) => s.count) },
    })
  }

  if (technicians.length) {
    renderHorizontalBar(qs('[data-chart="technicians"]', mount), {
      categories: technicians.map((t) => t.name),
      series: { name: 'Completed jobs', data: technicians.map((t) => t.completedJobs) },
      color: '#16a34a',
    })
  }
}
