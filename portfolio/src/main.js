import './assets/styles/scss/main.scss'
import { renderAll } from './assets/js/render.js'
import { initReveal } from './assets/js/reveal.js'
import { initContactForm } from './assets/js/contactForm.js'
import { initScrollSpy } from './assets/js/scrollspy.js'

renderAll()
initReveal()
initContactForm(document.querySelector('#contact-form'))
initScrollSpy()
