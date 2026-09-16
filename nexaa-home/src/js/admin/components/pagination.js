// Simple client-side pagination for admin list views. Usage:
//   let page = 1
//   function paint() {
//     const { rows, pages, total } = paginate(filtered, page, PAGE_SIZE)
//     mount.innerHTML = renderTable(...) + renderPagination({ page, pages, total, pageSize: PAGE_SIZE })
//     attachPagination(mount, { onChange: (p) => { page = p; paint() } })
//   }
export function paginate(rows, page, pageSize) {
  const total = rows.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), pages)
  const start = (current - 1) * pageSize
  return { rows: rows.slice(start, start + pageSize), page: current, pages, total }
}

export function renderPagination({ page, pages, total, pageSize }) {
  if (pages <= 1) return ''
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return `
    <div class="pagination" data-pagination="${page}">
      <span class="pagination__info">${start}–${end} of ${total}</span>
      <div class="pagination__controls">
        <button type="button" class="pagination__btn" data-page-nav="${page - 1}" ${page <= 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>
        <span class="pagination__current">Page ${page} of ${pages}</span>
        <button type="button" class="pagination__btn" data-page-nav="${page + 1}" ${page >= pages ? 'disabled' : ''} aria-label="Next page">›</button>
      </div>
    </div>`
}

export function attachPagination(container, { onChange }) {
  container.querySelectorAll('[data-page-nav]').forEach((btn) => {
    btn.addEventListener('click', () => onChange(Number(btn.dataset.pageNav)))
  })
}
