export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Our Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Book Now', href: '#book' },
]

export const heroStats = [
  { label: 'Homes served', value: '8,000+' },
  { label: 'Vetted pros', value: '450+' },
  { label: 'Avg. match time', value: '30 min' },
  { label: 'Customer rating', value: '4.8 / 5' },
]

export const steps = [
  { title: 'Request a service', body: 'Tell us what you need fixed, cleaned or installed and when.' },
  { title: 'Get matched', body: 'We match you with a vetted, background-checked local pro.' },
  { title: 'Schedule the visit', body: 'Pick a time that works — confirmed instantly, no phone tag.' },
  { title: 'Job done', body: 'Pay securely after the work is done, rate your pro.' },
]

export const workGallery = [
  { label: 'Kitchen remodel', descriptor: 'Full renovation, 3-week turnaround', tone: 1, icon: 'wrench' },
  { label: 'Bathroom repair', descriptor: 'Leak fix and fixture replacement', tone: 2, icon: 'droplet' },
  { label: 'AC installation', descriptor: 'Split-AC install, same-day service', tone: 3, icon: 'wind' },
  { label: 'Full home deep clean', descriptor: 'Move-in ready in one visit', tone: 4, icon: 'sparkle', wide: true },
  { label: 'Electrical rewiring', descriptor: 'Whole-home rewire, code compliant', tone: 5, icon: 'bolt' },
]

export const plans = [
  {
    name: 'Basic', price: 19, featured: false,
    desc: 'For occasional repairs and one-off jobs.',
    includes: ['Priority booking', 'Standard support', 'Verified pros only'],
  },
  {
    name: 'Standard', price: 39, featured: true,
    desc: 'For households that book a few times a month.',
    includes: ['Everything in Basic', '10% off every booking', 'Same-day matching', 'Dedicated support line'],
  },
  {
    name: 'Premium', price: 69, featured: false,
    desc: 'For larger homes with recurring maintenance needs.',
    includes: ['Everything in Standard', '20% off every booking', 'Free annual inspection', 'Priority emergency dispatch'],
  },
]

export const testimonials = [
  { quote: 'Booked an electrician at 9am, someone was at my door by 10:30. Genuinely faster than calling around myself.', name: 'Priya Nambiar', role: 'Homeowner, Chennai' },
  { quote: "The membership plan paid for itself after two bookings. I don't think about home repairs anymore, I just book.", name: 'Rohan Verma', role: 'Homeowner, Bengaluru' },
]
