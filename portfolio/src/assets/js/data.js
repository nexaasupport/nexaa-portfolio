export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Packages', href: '#packages' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export const heroStats = [
  { label: 'Delivery', value: 'Fixed timeline' },
  { label: 'Pricing', value: 'Standard, published' },
  { label: 'Stack', value: 'Modern & scalable' },
]

export const primaryTech = [
  { name: 'React.js', note: 'Core frontend library behind every Nexaa interface.', icon: 'react' },
  { name: 'Next.js', note: 'App Router, SSR and SEO-ready production builds.', icon: 'layers' },
]

export const otherTech = ['TypeScript', 'JavaScript', 'Node.js', 'Express.js', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs', 'Git', 'GitHub']

export const services = [
  { num: '01', title: 'Website Design & Development', body: 'Fast, responsive websites built to load quickly, look credible and convert visitors into customers.', icon: 'react', tone: 'accent' },
  { num: '02', title: 'Web Application Development', body: 'Custom dashboards, portals and internal tools built around how your business actually works.', icon: 'layers', tone: 'accent' },
  { num: '03', title: 'Business Websites', body: 'Modern responsive websites designed to establish a strong, credible online presence.', icon: 'globe', tone: 'accent' },
  { num: '04', title: 'Full-Stack Development', body: 'Complete web applications with frontend, backend, APIs and database integration.', icon: 'stack', tone: 'accent2' },
  { num: '05', title: 'API & Backend Integration', body: 'Reliable, secure backend systems that connect your tools, data and services.', icon: 'api', tone: 'accent2' },
  { num: '06', title: 'Website Redesign', body: "Rebuild outdated, slow websites into fast, modern, maintainable ones.", icon: 'redo', tone: 'accent2' },
  { num: '07', title: 'Ongoing Support & Maintenance', body: 'Continuous fixes, updates and improvements for existing websites and applications.', icon: 'bug', tone: 'accent2' },
]

export const projects = [
  {
    name: 'Local Service Booking Platform', label: 'Demo Project', tech: 'Vanilla JS · Vite · SCSS',
    shot: 'screenshot: booking flow',
    brief: 'Small service businesses lose bookings to phone tag and no-shows with no reminder system.',
    outcome: 'Live services catalog and a real booking form that creates a customer + job record — built to replace a paper diary or shared spreadsheet.',
    features: ['Live services catalog', 'Working booking form', 'Client-side validation', 'Feeds the ops dashboard', 'Mobile-first'],
    band: 'a',
    demo: '/nexaa-home/',
  },
  {
    name: 'Operations Dashboard', label: 'Demo Project', tech: 'Vanilla JS · Vite · SCSS',
    shot: 'screenshot: KPI dashboard',
    brief: "Owners can't see daily revenue, bookings or no-shows without opening three different spreadsheets.",
    outcome: "One screen with today's numbers, a live jobs table, technician assignment and payments — the daily check-in a manager actually opens.",
    features: ['Live KPIs', 'Jobs/customers/technicians/payments', 'Assign & status workflow', 'Filterable tables', 'Hash-routed views'],
    band: 'b',
    demo: '/nexaa-home/admin/',
  },
  {
    name: 'Business Management System', label: 'Personal Project', tech: 'React.js · Node.js · Express.js',
    shot: 'screenshot: user management',
    brief: 'Growing teams outgrow shared logins and manual record-keeping with no audit trail.',
    outcome: 'Authentication, roles, full CRUD on records and an activity log — the backbone an organization runs staff and clients through.',
    features: ['Authentication', 'Role-based access', 'CRUD operations', 'Activity log', 'REST API'],
    band: 'c',
  },
].map((p) => ({ repo: '#add-github-repo-link', demo: '#add-live-demo-link', ...p }))

export const packages = [
  {
    name: 'Landing Page', scope: 'A focused one-page site built to convert a single offer, launch or campaign.', icon: 'bolt', iconTone: 'accent',
    includes: ['Responsive one-page build', 'Contact form', 'Basic SEO metadata', 'Deploy + handover'],
    timeline: '[ set typical timeline ]', price: '[ set standard price ]', featured: false,
  },
  {
    name: 'Business Website', scope: 'A multi-section site that gives an established organization a credible, professional presence.', icon: 'globe', iconTone: 'accent2-solid',
    includes: ['Up to 5 sections or pages', 'Modern, fast front-end build', 'SEO + Open Graph setup', 'One revision round', 'Deploy + handover'],
    timeline: '[ set typical timeline ]', price: '[ set standard price ]', featured: true,
  },
  {
    name: 'Web Application', scope: 'A dashboard or internal tool built around real data, roles and workflows.', icon: 'stack', iconTone: 'accent',
    includes: ['Authentication and user roles', 'REST API + database integration', 'CRUD screens and data tables', 'Staging + production deploy'],
    timeline: '[ set typical timeline ]', price: '[ set standard price ]', featured: false,
  },
]

export const why = [
  { title: 'Faster delivery', body: 'A fixed process and reusable components mean less time spent re-solving what\'s already solved.', icon: 'bolt', tone: 'accent2' },
  { title: 'Consistent quality', body: 'The same checklist and standards apply to a landing page and a full application alike.', icon: 'check', tone: 'accent' },
  { title: 'Standard pricing', body: 'One published rate card. No client pays a different price for the same scope.', icon: 'spark', tone: 'accent2' },
  { title: 'Built for organizations', body: 'Role-based access, audit trails and handover documentation from day one, not bolted on later.', icon: 'shield', tone: 'accent' },
  { title: 'Clear communication', body: 'Plain-language updates and visible progress, no jargon standing in for a status report.', icon: 'chat', tone: 'accent2' },
  { title: 'You own the outcome', body: 'Code, credentials and documentation transfer to you at handover — no lock-in.', icon: 'check', tone: 'accent' },
]

export const process = [
  { num: '01', title: 'Diagnose', body: 'Identify the operational problem and who it costs time or money.', icon: 'chat', tone: 'accent' },
  { num: '02', title: 'Scope', body: 'Fix the deliverables, technology and standard price in writing.', icon: 'check', tone: 'accent' },
  { num: '03', title: 'Build', body: 'Develop and test against the agreed scope, on a fixed timeline.', icon: 'stack', tone: 'accent2' },
  { num: '04', title: 'Launch & support', body: 'Deploy, hand over documentation, and stay available for fixes.', icon: 'bolt', tone: 'accent2' },
]

export const faqs = [
  { q: 'Who is this for?', a: 'Organizations — small businesses, startups and teams — with an operational problem that software can fix, not just an idea for a website.' },
  { q: 'Why a standard price instead of a quote?', a: "The same package costs the same for everyone. You see the price before you commit, and it doesn't move once work starts." },
  { q: 'How fast is delivery?', a: 'Faster than a from-scratch build, because a fixed process and reusable components remove most of the setup time. Exact timelines are listed per package.' },
  { q: 'Do we own the code?', a: 'Yes — the repository, deployment access and documentation transfer to you at handover.' },
  { q: 'Can you fix or extend an existing system?', a: 'Yes. Redesigns, bug fixes and maintenance on existing websites and applications run on the same standard rate card.' },
  { q: 'How are payments handled?', a: '[ add your payment terms — e.g. deposit up front, balance on delivery ]' },
]

export const socials = [
  { label: 'GitHub', short: 'GH', href: '#add-github-link' },
  { label: 'WhatsApp', short: 'WA', href: 'https://wa.me/919488479124' },
  { label: 'Email', short: '@', href: 'mailto:nexaa.support@gmail.com' },
]

export const projectTypes = ['Business Website', 'Website Design & Development', 'Web Application', 'Full-Stack Application', 'API Integration', 'Website Redesign', 'Bug Fixing', 'Maintenance', 'Other']

export const budgets = ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹30,000', '₹30,000 – ₹50,000', '₹50,000+']
