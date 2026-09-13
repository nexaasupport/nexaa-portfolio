export function createRouter(routes, mountEl, defaultRoute = 'dashboard') {
  function currentRoute() {
    const hash = window.location.hash.replace(/^#\/?/, '')
    return routes[hash] ? hash : defaultRoute
  }

  function render() {
    const route = currentRoute()
    mountEl.innerHTML = ''
    routes[route](mountEl)
    document.querySelectorAll('[data-route-link]').forEach((link) => {
      link.classList.toggle('is-active', link.dataset.routeLink === route)
    })
  }

  window.addEventListener('hashchange', render)
  if (!window.location.hash) window.location.hash = `#/${defaultRoute}`
  else render()

  return { render, currentRoute }
}
