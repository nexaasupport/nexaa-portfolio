import { svgIcon } from './icons.js'
import {
  nav, heroStats, primaryTech, otherTech, services, projects, packages,
  why, process, faqs, socials, projectTypes, budgets,
} from './data.js'

function renderNav(container) {
  container.innerHTML = nav.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')
}

function renderHeroStats(container) {
  container.innerHTML = heroStats.map((s) => `
    <div class="hero-stat">
      <div class="hero-stat__label">${s.label}</div>
      <div class="hero-stat__value">${s.value}</div>
    </div>
  `).join('')
}

function renderMarquee(container) {
  const words = [...otherTech, ...primaryTech.map((t) => t.name)]
  const track = words.map((w) => `<span>${w}</span><span class="marquee__dot" aria-hidden="true">✦</span>`).join('')
  container.innerHTML = track + track
}

function renderPrimaryTech(container) {
  container.innerHTML = primaryTech.map((t) => `
    <div class="tech-card" data-reveal>
      <span class="tech-card__icon">${svgIcon(t.icon, { size: 22 })}</span>
      <div>
        <div class="tech-card__title">${t.name}</div>
        <div class="tech-card__note">${t.note}</div>
      </div>
    </div>
  `).join('')
}

function renderOtherTech(container) {
  container.innerHTML = otherTech.map((t) => `<span class="tech-pill">${t}</span>`).join('')
}

function renderServices(container) {
  container.innerHTML = services.map((s) => `
    <div class="service-card" data-reveal>
      <div class="service-card__num">${s.num}</div>
      <span class="service-card__icon service-card__icon--${s.tone}">${svgIcon(s.icon, { size: 18 })}</span>
      <h3 class="service-card__title">${s.title}</h3>
      <p class="service-card__body">${s.body}</p>
    </div>
  `).join('')
}

function renderProjects(container) {
  container.innerHTML = projects.map((p) => `
    <article class="project-card project-card--${p.band}" data-reveal>
      <div class="project-card__band">
        <span>${p.shot}</span>
      </div>
      <div class="project-card__body">
        <span class="tag-mono project-card__label">${p.label}</span>
        <h3 class="project-card__name">${p.name}</h3>
        <div class="project-card__tech">${p.tech}</div>
        <div class="project-card__block"><strong>Problem: </strong>${p.brief}</div>
        <div class="project-card__block"><strong>Outcome: </strong>${p.outcome}</div>
        <ul class="project-card__features">
          ${p.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
        ${p.demo ? `<div class="project-card__actions"><a href="${p.demo}" class="btn--link">Live demo</a></div>` : ''}
      </div>
    </article>
  `).join('')
}

function renderPackages(container) {
  container.innerHTML = packages.map((k) => `
    <div class="package-card ${k.featured ? 'package-card--featured' : ''}" data-reveal>
      <span class="package-card__icon">${svgIcon(k.icon, { size: 20 })}</span>
      <div class="package-card__name">${k.name}</div>
      <p class="package-card__scope">${k.scope}</p>
      <ul class="package-card__includes">
        ${k.includes.map((i) => `<li><span class="package-card__check">✓</span>${i}</li>`).join('')}
      </ul>
      <div class="package-card__meta">
        <span>${k.timeline}</span>
        <span>${k.price}</span>
      </div>
    </div>
  `).join('')
}

function renderWhy(container) {
  container.innerHTML = why.map((w) => `
    <div class="why-card" data-reveal>
      <span class="why-card__icon why-card__icon--${w.tone}">${svgIcon(w.icon, { size: 18 })}</span>
      <div>
        <div class="why-card__title">${w.title}</div>
        <p class="why-card__body">${w.body}</p>
      </div>
    </div>
  `).join('')
}

function renderProcess(container) {
  container.innerHTML = process.map((p) => `
    <div class="process-card" data-reveal>
      <div class="process-card__num">${p.num}</div>
      <div class="process-card__title">${p.title}</div>
      <p class="process-card__body">${p.body}</p>
    </div>
  `).join('')
}

function renderFaqs(container) {
  container.innerHTML = faqs.map((f) => `
    <div class="faq-item">
      <div class="faq-item__row">
        <span class="faq-item__q">${f.q}</span>
        <span class="faq-item__symbol">+</span>
      </div>
      <div class="faq-item__a" hidden>${f.a}</div>
    </div>
  `).join('')
}

function renderSocials(container) {
  container.innerHTML = socials.map((s) => `
    <a href="${s.href}" class="social-badge" aria-label="${s.label}">${s.short}</a>
  `).join('')
}

function renderOptions(select, options) {
  select.innerHTML = options.map((o) => `<option>${o}</option>`).join('')
}

export function renderAll() {
  document.querySelectorAll('[data-nav]').forEach(renderNav)
  renderHeroStats(document.querySelector('[data-hero-stats]'))
  renderMarquee(document.querySelector('[data-marquee]'))
  renderPrimaryTech(document.querySelector('[data-primary-tech]'))
  renderOtherTech(document.querySelector('[data-other-tech]'))
  renderServices(document.querySelector('[data-services]'))
  renderProjects(document.querySelector('[data-projects]'))
  renderPackages(document.querySelector('[data-packages]'))
  renderWhy(document.querySelector('[data-why]'))
  renderProcess(document.querySelector('[data-process]'))
  renderFaqs(document.querySelector('[data-faqs]'))
  renderSocials(document.querySelector('[data-socials]'))
  renderOptions(document.querySelector('[name="type"]'), projectTypes)
  renderOptions(document.querySelector('[name="budget"]'), budgets)
}
