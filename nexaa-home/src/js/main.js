import '../scss/main.scss'
import { renderAll } from './public/render.js'
import { initScrollSpy } from './public/scrollspy.js'
import { initBookingForm } from './public/bookingForm.js'
import { initStickyHeader } from './public/stickyHeader.js'
import { initNavToggle } from './public/navToggle.js'
import { subscribe } from './lib/store.js'

renderAll()
initScrollSpy()
initBookingForm()
initStickyHeader()
initNavToggle()

subscribe(() => renderAll())
