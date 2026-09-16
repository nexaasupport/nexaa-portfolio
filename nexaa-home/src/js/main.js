import '../scss/main.scss'
import { renderAll } from './public/render.js'
import { initScrollSpy } from './public/scrollspy.js'
import { initStickyHeader } from './public/stickyHeader.js'
import { initNavToggle } from './public/navToggle.js'
import { initScrollReveal } from './public/scrollReveal.js'
import { animateCounters } from './lib/counter.js'
import { initPageRouter } from './public/account/pageRouter.js'
import { subscribe, onPersistError } from './lib/store.js'
import { showToast } from './lib/toast.js'

renderAll()
initScrollSpy()
initStickyHeader()
initNavToggle()
initScrollReveal()
animateCounters()
initPageRouter()

subscribe(() => {
  renderAll()
  initScrollReveal()
  animateCounters()
})
onPersistError(() => showToast("Couldn't save — your browser storage may be full or disabled."))
