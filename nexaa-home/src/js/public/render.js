import { qs, qsa } from '../lib/dom.js'
import { getServices } from '../lib/store.js'
import { icon, iconPaths } from './icons.js'
import { nav, heroStats, steps, workGallery, plans, testimonials } from './content.js'

export function renderNav() {
  qsa('[data-nav]').forEach((el) => {
    el.innerHTML = nav.map((item) => `<a href="${item.href}" class="site-header__link">${item.label}</a>`).join('')
  })
}

export function renderHeroStats() {
  const el = qs('[data-hero-stats]')
  if (!el) return
  el.innerHTML = heroStats
    .map((s) => `<div class="hero__stat"><strong>${s.value}</strong><span>${s.label}</span></div>`)
    .join('')
}

export function renderHeroArt() {
  const el = qs('[data-hero-art]')
  if (!el) return
  const items = getServices().slice(0, 6)
  el.innerHTML = `
    <div class="hero-services">
      <div class="hero-services__head">
        <span>Popular services</span>
        <a href="#services">See all →</a>
      </div>
      <div class="hero-services__grid">
        ${items
          .map(
            (s) => `
          <a href="#book" class="hero-services__item">
            <span class="hero-services__icon">${icon(s.icon, 19)}</span>
            <span class="hero-services__name">${s.name}</span>
            <span class="hero-services__price">From ₹${s.basePrice}</span>
          </a>`
          )
          .join('')}
      </div>
    </div>
  `
}

export function renderServices() {
  const el = qs('[data-services]')
  if (!el) return
  el.innerHTML = getServices()
    .map(
      (s) => `
      <div class="service-card">
        <div class="service-card__icon">${icon(s.icon)}</div>
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <div class="service-card__price">From ₹${s.basePrice}</div>
      </div>`
    )
    .join('')

  document.querySelectorAll('[data-service-options]').forEach((select) => {
    select.innerHTML = getServices().map((s) => `<option value="${s.id}">${s.name}</option>`).join('')
  })
}

export function renderSteps() {
  const el = qs('[data-steps]')
  if (!el) return
  el.innerHTML = steps
    .map(
      (s, i) => `
      <div class="step-card">
        <div class="step-card__num">${String(i + 1).padStart(2, '0')}</div>
        <h3>${s.title}</h3>
        <p>${s.body}</p>
      </div>`
    )
    .join('')
}

export function renderWork() {
  const el = qs('[data-work]')
  if (!el) return
  el.innerHTML = workGallery
    .map(
      (w) => `
      <div class="work-card work-card--${w.tone}${w.wide ? ' work-card--wide' : ''}">
        <svg class="work-card__watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths(w.icon, 'none')}</svg>
        <div class="work-card__icon">${icon(w.icon, 28, { tone: 'inverse' })}</div>
        <div class="work-card__text">
          <span class="work-card__label">${w.label}</span>
          <span class="work-card__descriptor">${w.descriptor}</span>
        </div>
      </div>`
    )
    .join('')
}

export function renderPricing() {
  const el = qs('[data-pricing]')
  if (!el) return
  el.innerHTML = plans
    .map(
      (p) => `
      <div class="price-card ${p.featured ? 'price-card--featured' : ''}">
        ${p.featured ? '<span class="price-card__badge">Most popular</span>' : ''}
        <h3>${p.name}</h3>
        <div class="price-card__price">₹${p.price}<span>/mo</span></div>
        <p class="desc">${p.desc}</p>
        <ul>${p.includes.map((f) => `<li>${icon('check', 16)} ${f}</li>`).join('')}</ul>
        <a class="btn btn--${p.featured ? 'primary' : 'ghost'}" href="#book" style="width:100%">Choose ${p.name}</a>
      </div>`
    )
    .join('')
}

export function renderTestimonials() {
  const el = qs('[data-testimonials]')
  if (!el) return
  el.innerHTML = testimonials
    .map(
      (t) => `
      <div class="testimonial-card">
        <p class="testimonial-card__quote">"${t.quote}"</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar">${t.name.split(' ').map((n) => n[0]).join('')}</div>
          <div><strong>${t.name}</strong><span>${t.role}</span></div>
        </div>
      </div>`
    )
    .join('')
}

export function renderAll() {
  renderNav()
  renderHeroStats()
  renderHeroArt()
  renderServices()
  renderSteps()
  renderWork()
  renderPricing()
  renderTestimonials()
}
