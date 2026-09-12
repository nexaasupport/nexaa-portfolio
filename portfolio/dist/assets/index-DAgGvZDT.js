(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const u={react:"M12 3c1.5 2 2.7 4 3.4 6M12 3c-1.5 2-2.7 4-3.4 6M12 21c1.5-2 2.7-4 3.4-6M12 21c-1.5-2-2.7-4-3.4-6M3.5 8.5c2.3-.9 4.6-1.4 6.8-1.7M3.5 8.5c-.3 2.4-.1 4.8.6 7M3.5 8.5c1.6 1.8 3.4 3.4 5.4 4.8M20.5 8.5c-2.3-.9-4.6-1.4-6.8-1.7M20.5 8.5c.3 2.4.1 4.8-.6 7M20.5 8.5c-1.6 1.8-3.4 3.4-5.4 4.8",layers:"M12 3l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4",globe:"M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18",stack:"M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4",api:"M8 4H5a1 1 0 00-1 1v3M16 4h3a1 1 0 011 1v3M8 20H5a1 1 0 01-1-1v-3M16 20h3a1 1 0 001-1v-3M9 9h6v6H9z",db:"M12 5c4.4 0 8-1.1 8-2.5S16.4 0 12 0 4 1.1 4 2.5 7.6 5 12 5zM4 2.5V17c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V2.5M4 9.75c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5",redo:"M4 12a8 8 0 1114.6 4.6M20 12l-3-1 1-3",bug:"M9 9l-2-3M15 9l2-3M9 5a3 3 0 116 0M6 12h12M6 12a6 6 0 1012 0M6 12a6 6 0 016-6 6 6 0 016 6",spark:"M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M19 5l-4 4M5 19l4-4M19 19l-4-4",check:"M4 12h16M4 6h16M4 18h10",shield:"M12 3l7 3v6c0 5-3.2 8-7 9-3.8-1-7-4-7-9V6l7-3z",chat:"M4 5h16v11H8l-4 4V5z",bolt:"M13 2L4 14h6l-1 8 9-12h-6z"};function l(t,{color:e="currentColor",size:n=20}={}){const s=u[t]||u.spark;return`<svg viewBox="0 0 24 24" width="${n}" height="${n}" fill="none" stroke="${e}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${s}"/></svg>`}const v=[{label:"Home",href:"#top"},{label:"Services",href:"#services"},{label:"Work",href:"#work"},{label:"Packages",href:"#packages"},{label:"About",href:"#about"},{label:"FAQ",href:"#faq"},{label:"Contact",href:"#contact"}],f=[{label:"Delivery",value:"Fixed timeline"},{label:"Pricing",value:"Standard, published"},{label:"Stack",value:"Modern & scalable"}],h=[{name:"React.js",note:"Core frontend library behind every Nexaa interface.",icon:"react"},{name:"Next.js",note:"App Router, SSR and SEO-ready production builds.",icon:"layers"}],m=["TypeScript","JavaScript","Node.js","Express.js","Tailwind CSS","Redux Toolkit","REST APIs","Git","GitHub"],g=[{num:"01",title:"Website Design & Development",body:"Fast, responsive websites built to load quickly, look credible and convert visitors into customers.",icon:"react",tone:"accent"},{num:"02",title:"Web Application Development",body:"Custom dashboards, portals and internal tools built around how your business actually works.",icon:"layers",tone:"accent"},{num:"03",title:"Business Websites",body:"Modern responsive websites designed to establish a strong, credible online presence.",icon:"globe",tone:"accent"},{num:"04",title:"Full-Stack Development",body:"Complete web applications with frontend, backend, APIs and database integration.",icon:"stack",tone:"accent2"},{num:"05",title:"API & Backend Integration",body:"Reliable, secure backend systems that connect your tools, data and services.",icon:"api",tone:"accent2"},{num:"06",title:"Website Redesign",body:"Rebuild outdated, slow websites into fast, modern, maintainable ones.",icon:"redo",tone:"accent2"},{num:"07",title:"Ongoing Support & Maintenance",body:"Continuous fixes, updates and improvements for existing websites and applications.",icon:"bug",tone:"accent2"}],y=[{name:"Local Service Booking Platform",label:"Demo Project",tech:"Vanilla JS · Vite · SCSS",shot:"screenshot: booking flow",brief:"Small service businesses lose bookings to phone tag and no-shows with no reminder system.",outcome:"Live services catalog and a real booking form that creates a customer + job record — built to replace a paper diary or shared spreadsheet.",features:["Live services catalog","Working booking form","Client-side validation","Feeds the ops dashboard","Mobile-first"],band:"a",demo:"/nexaa-home/"},{name:"Operations Dashboard",label:"Demo Project",tech:"Vanilla JS · Vite · SCSS",shot:"screenshot: KPI dashboard",brief:"Owners can't see daily revenue, bookings or no-shows without opening three different spreadsheets.",outcome:"One screen with today's numbers, a live jobs table, technician assignment and payments — the daily check-in a manager actually opens.",features:["Live KPIs","Jobs/customers/technicians/payments","Assign & status workflow","Filterable tables","Hash-routed views"],band:"b",demo:"/nexaa-home/admin/"},{name:"Business Management System",label:"Personal Project",tech:"React.js · Node.js · Express.js",shot:"screenshot: user management",brief:"Growing teams outgrow shared logins and manual record-keeping with no audit trail.",outcome:"Authentication, roles, full CRUD on records and an activity log — the backbone an organization runs staff and clients through.",features:["Authentication","Role-based access","CRUD operations","Activity log","REST API"],band:"c"}].map(t=>({repo:"#add-github-repo-link",demo:"#add-live-demo-link",...t})),_=[{name:"Landing Page",scope:"A focused one-page site built to convert a single offer, launch or campaign.",icon:"bolt",iconTone:"accent",includes:["Responsive one-page build","Contact form","Basic SEO metadata","Deploy + handover"],timeline:"[ set typical timeline ]",price:"[ set standard price ]",featured:!1},{name:"Business Website",scope:"A multi-section site that gives an established organization a credible, professional presence.",icon:"globe",iconTone:"accent2-solid",includes:["Up to 5 sections or pages","Modern, fast front-end build","SEO + Open Graph setup","One revision round","Deploy + handover"],timeline:"[ set typical timeline ]",price:"[ set standard price ]",featured:!0},{name:"Web Application",scope:"A dashboard or internal tool built around real data, roles and workflows.",icon:"stack",iconTone:"accent",includes:["Authentication and user roles","REST API + database integration","CRUD screens and data tables","Staging + production deploy"],timeline:"[ set typical timeline ]",price:"[ set standard price ]",featured:!1}],M=[{title:"Faster delivery",body:"A fixed process and reusable components mean less time spent re-solving what's already solved.",icon:"bolt",tone:"accent2"},{title:"Consistent quality",body:"The same checklist and standards apply to a landing page and a full application alike.",icon:"check",tone:"accent"},{title:"Standard pricing",body:"One published rate card. No client pays a different price for the same scope.",icon:"spark",tone:"accent2"},{title:"Built for organizations",body:"Role-based access, audit trails and handover documentation from day one, not bolted on later.",icon:"shield",tone:"accent"},{title:"Clear communication",body:"Plain-language updates and visible progress, no jargon standing in for a status report.",icon:"chat",tone:"accent2"},{title:"You own the outcome",body:"Code, credentials and documentation transfer to you at handover — no lock-in.",icon:"check",tone:"accent"}],S=[{num:"01",title:"Diagnose",body:"Identify the operational problem and who it costs time or money.",icon:"chat",tone:"accent"},{num:"02",title:"Scope",body:"Fix the deliverables, technology and standard price in writing.",icon:"check",tone:"accent"},{num:"03",title:"Build",body:"Develop and test against the agreed scope, on a fixed timeline.",icon:"stack",tone:"accent2"},{num:"04",title:"Launch & support",body:"Deploy, hand over documentation, and stay available for fixes.",icon:"bolt",tone:"accent2"}],w=[{q:"Who is this for?",a:"Organizations — small businesses, startups and teams — with an operational problem that software can fix, not just an idea for a website."},{q:"Why a standard price instead of a quote?",a:"The same package costs the same for everyone. You see the price before you commit, and it doesn't move once work starts."},{q:"How fast is delivery?",a:"Faster than a from-scratch build, because a fixed process and reusable components remove most of the setup time. Exact timelines are listed per package."},{q:"Do we own the code?",a:"Yes — the repository, deployment access and documentation transfer to you at handover."},{q:"Can you fix or extend an existing system?",a:"Yes. Redesigns, bug fixes and maintenance on existing websites and applications run on the same standard rate card."},{q:"How are payments handled?",a:"[ add your payment terms — e.g. deposit up front, balance on delivery ]"}],k=[{label:"GitHub",icon:"react",href:"#add-github-link"},{label:"WhatsApp",icon:"chat",href:"https://wa.me/919488479124"},{label:"Email",icon:"spark",href:"mailto:nexaa.support@gmail.com"}],$=["Business Website","Website Design & Development","Web Application","Full-Stack Application","API Integration","Website Redesign","Bug Fixing","Maintenance","Other"],j=["Under ₹5,000","₹5,000 – ₹15,000","₹15,000 – ₹30,000","₹30,000 – ₹50,000","₹50,000+"],d=t=>t==="accent2"?"var(--accent2)":"var(--accent)";function q(t){t.innerHTML=v.map(e=>`<a href="${e.href}">${e.label}</a>`).join("")}function A(t){t.innerHTML=f.map((e,n)=>`
    <div class="hero-stat hero-stat--${n}">
      <div class="hero-stat__label">${e.label}</div>
      <div class="hero-stat__value">${e.value}</div>
    </div>
  `).join("")}function T(t){const n=[...m,...h.map(s=>s.name)].map(s=>`<span>${s}</span><span class="marquee__dot" aria-hidden="true">✦</span>`).join("");t.innerHTML=n+n}function L(t){t.innerHTML=h.map(e=>`
    <div class="tech-card" data-reveal>
      <div class="tech-card__row">
        <div class="tech-card__title">
          <span class="tech-card__icon">${l(e.icon,{color:"var(--accent)",size:24})}</span>
          <span>${e.name}</span>
        </div>
        <span class="tag-mono">Primary</span>
      </div>
      <p class="tech-card__note">${e.note}</p>
    </div>
  `).join("")}function x(t){t.innerHTML=m.map(e=>`<span class="tech-pill">${e}</span>`).join("")}function P(t){t.innerHTML=g.map(e=>`
    <div class="service-card" data-reveal>
      <div class="service-card__row">
        <span class="service-card__icon service-card__icon--${e.tone}">${l(e.icon,{color:d(e.tone)})}</span>
        <div class="service-card__num">${e.num}</div>
      </div>
      <h3 class="service-card__title">${e.title}</h3>
      <p class="service-card__body">${e.body}</p>
    </div>
  `).join("")}function H(t){t.innerHTML=y.map(e=>`
    <article class="project-card project-card--${e.band}" data-reveal>
      <div class="project-card__band">
        <span>${e.shot}</span>
      </div>
      <div class="project-card__body">
        <span class="tag-mono project-card__label">${e.label}</span>
        <h3 class="project-card__name">${e.name}</h3>
        <div class="project-card__tech">${e.tech}</div>
        <div class="project-card__block">
          <div class="project-card__block-label">The problem</div>
          <p>${e.brief}</p>
        </div>
        <div class="project-card__block">
          <div class="project-card__block-label">What it does</div>
          <p>${e.outcome}</p>
        </div>
        <ul class="project-card__features">
          ${e.features.map(n=>`<li>${n}</li>`).join("")}
        </ul>
        <div class="project-card__actions">
          <a href="${e.demo}" class="btn btn--pill btn--gradient">Live demo</a>
          <a href="${e.repo}" class="btn btn--pill btn--outline">View code</a>
        </div>
      </div>
    </article>
  `).join("")}function O(t){t.innerHTML=_.map(e=>`
    <div class="package-card ${e.featured?"package-card--featured":""}" data-reveal>
      ${e.featured?'<span class="package-card__badge">Most requested</span>':""}
      <span class="package-card__icon package-card__icon--${e.iconTone}">${l(e.icon,{color:e.featured?"var(--accent2)":"var(--accent)",size:22})}</span>
      <div class="package-card__name">${e.name}</div>
      <p class="package-card__scope">${e.scope}</p>
      <ul class="package-card__includes">
        ${e.includes.map(n=>`<li><span class="package-card__dash">—</span>${n}</li>`).join("")}
      </ul>
      <div class="package-card__meta">
        <div>Timeline: ${e.timeline}</div>
        <div>Standard price: ${e.price}</div>
      </div>
      <a href="#contact" class="btn btn--pill ${e.featured?"btn--accent2":"btn--dark"}">Enquire</a>
    </div>
  `).join("")}function C(t){t.innerHTML=M.map(e=>`
    <div class="why-card" data-reveal>
      <span class="why-card__icon why-card__icon--${e.tone}">${l(e.icon,{color:d(e.tone),size:18})}</span>
      <div class="why-card__title">${e.title}</div>
      <p class="why-card__body">${e.body}</p>
    </div>
  `).join("")}function R(t){t.innerHTML=S.map(e=>`
    <div class="process-card" data-reveal>
      <div class="process-card__row">
        <div class="process-card__num">${e.num}</div>
        ${l(e.icon,{color:d(e.tone)})}
      </div>
      <div class="process-card__title">${e.title}</div>
      <p class="process-card__body">${e.body}</p>
    </div>
  `).join("")}function D(t){t.innerHTML=w.map(e=>`
    <div class="faq-item" data-reveal>
      <div class="faq-item__q">${e.q}</div>
      <p class="faq-item__a">${e.a}</p>
    </div>
  `).join("")}function E(t){t.innerHTML=k.map(e=>`
    <a href="${e.href}" class="social-pill">${l(e.icon,{color:"oklch(0.9 0.005 260)",size:16})}${e.label}</a>
  `).join("")}function p(t,e){t.innerHTML=e.map(n=>`<option>${n}</option>`).join("")}function I(){document.querySelectorAll("[data-nav]").forEach(q),A(document.querySelector("[data-hero-stats]")),T(document.querySelector("[data-marquee]")),L(document.querySelector("[data-primary-tech]")),x(document.querySelector("[data-other-tech]")),P(document.querySelector("[data-services]")),H(document.querySelector("[data-projects]")),O(document.querySelector("[data-packages]")),C(document.querySelector("[data-why]")),R(document.querySelector("[data-process]")),D(document.querySelector("[data-faqs]")),E(document.querySelector("[data-socials]")),p(document.querySelector('[name="type"]'),$),p(document.querySelector('[name="budget"]'),j)}function W(t=document){const e=t.querySelectorAll("[data-reveal]");if(!("IntersectionObserver"in window)||!e.length)return;const n=new IntersectionObserver(s=>{s.forEach(a=>{a.isIntersecting&&(a.target.classList.add("is-visible"),n.unobserve(a.target))})},{threshold:.12});e.forEach(s=>n.observe(s))}function z(t){if(!t)return;const e=t.querySelector('button[type="submit"]'),n=t.querySelector('[role="status"]'),s=a=>{const o={idle:"Send message",sending:"Sending…",sent:"Message sent"},i={error:"Add your name, a valid email and a short message.",sending:"Validating and sending…",sent:"Received — connect your form endpoint to deliver it.",idle:""};e.textContent=o[a]||o.idle,n.textContent=i[a]||"",n.style.color=a==="error"?"oklch(0.72 0.16 25)":a==="sent"?"oklch(0.8 0.14 155)":"oklch(0.75 0.01 260)"};t.addEventListener("submit",a=>{a.preventDefault();const o=c=>(t[c]&&t[c].value?t[c].value:"").trim(),i=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o("email"));if(!o("name")||!i||!o("message")){s("error");return}s("sending"),setTimeout(()=>s("sent"),900)})}function F(){const t=Array.from(document.querySelectorAll("[data-nav] a"));if(!t.length)return;const e=t.map(i=>{const c=i.getAttribute("href");if(!c||c==="#top")return null;const r=document.querySelector(c);return r?{id:c,el:r}:null}).filter(Boolean);if(!e.length)return;const n=i=>{t.forEach(c=>{c.classList.toggle("is-active",c.getAttribute("href")===i)})},s=document.querySelector(".site-header"),a=(s?s.offsetHeight:0)+24,o=new IntersectionObserver(i=>{const c=i.filter(r=>r.isIntersecting).sort((r,b)=>r.boundingClientRect.top-b.boundingClientRect.top);if(c.length){const r="#"+c[0].target.id;n(r)}else window.scrollY<200&&n("#top")},{rootMargin:`-${a}px 0px -60% 0px`,threshold:0});e.forEach(({el:i})=>o.observe(i)),window.addEventListener("scroll",()=>{window.scrollY<200&&n("#top")},{passive:!0})}I();W();z(document.querySelector("#contact-form"));F();
