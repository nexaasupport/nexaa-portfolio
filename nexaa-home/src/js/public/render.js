import { qs, qsa } from '../lib/dom.js'
import { getServices } from '../lib/store.js'
import { icon } from './icons.js'
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
    .map((s) => `<div class="hero__stat"><strong data-counter>${s.value}</strong><span>${s.label}</span></div>`)
    .join('')
}

export function renderHeroArt() {
  const el = qs('[data-hero-art]')
  if (!el) return
  const items = getServices().slice(0, 4)
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
          <a href="#/book" class="hero-services__item">
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
      (s, i) => `
      <a href="#/book" class="service-card" style="--reveal-delay:${i * 60}ms" data-reveal>
        <div class="service-card__icon">${icon(s.icon)}</div>
        <h3>${s.name}<span class="service-card__arrow">${icon('arrow-right', 18)}</span></h3>
        <p>${s.description}</p>
        <div class="service-card__price">From ₹${s.basePrice}</div>
      </a>`
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
      <div class="step-card" style="--reveal-delay:${i * 80}ms" data-reveal>
        <div class="step-card__icon">${icon(s.icon, 20)}</div>
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
      (w, i) => `
      <div class="work-card work-card--${w.tone}${w.wide ? ' work-card--wide' : ''}" style="background-image:url('${w.image}');--reveal-delay:${i * 70}ms" data-reveal>
        <span class="work-card__view">${icon('arrow-right', 13)} Completed</span>
        <div class="work-card__icon">${icon(w.icon, 22, { tone: 'inverse' })}</div>
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
      (p, i) => `
      <div class="price-card ${p.featured ? 'price-card--featured' : ''}" style="--reveal-delay:${i * 80}ms" data-reveal>
        ${p.featured ? `<span class="price-card__badge">${icon('star', 12)} Most popular</span>` : ''}
        <h3>${p.name}</h3>
        <div class="price-card__price">₹${p.price}<span>/mo</span></div>
        <p class="desc">${p.desc}</p>
        <ul>${p.includes.map((f) => `<li>${icon('check', 16)} ${f}</li>`).join('')}</ul>
        <a class="btn btn--${p.featured ? 'primary' : 'ghost'}" href="#/book" style="width:100%">Choose ${p.name}</a>
      </div>`
    )
    .join('')
}

export function renderTestimonials() {
  const el = qs('[data-testimonials]')
  if (!el) return
  el.innerHTML = testimonials
    .map(
      (t, i) => `
      <div class="testimonial-card" style="--reveal-delay:${i * 90}ms" data-reveal>
        <div class="testimonial-card__top">
          <span class="testimonial-card__mark" aria-hidden="true">${icon('quote', 26)}</span>
          <div class="testimonial-card__stars" aria-hidden="true">${Array.from({ length: 5 }, () => icon('star', 14)).join('')}</div>
        </div>
        <p class="testimonial-card__quote">"${t.quote}"</p>
        <div class="testimonial-card__author">
          <img class="testimonial-card__avatar" src="${t.avatar}" alt="" width="44" height="44" loading="lazy" />
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
