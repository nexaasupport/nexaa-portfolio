import { timeAgo } from '../../lib/dom.js'

export function activityFeed(items) {
  if (!items.length) return '<div class="empty-state">No activity yet.</div>'
  return `
    <div class="activity-feed">
      ${items
        .slice(0, 8)
        .map(
          (a) => `
        <div class="activity-item">
          <div class="activity-item__dot"></div>
          <div>
            <div class="activity-item__message">${a.message}</div>
            <div class="activity-item__time">${timeAgo(a.at)}</div>
          </div>
        </div>`
        )
        .join('')}
    </div>`
}
