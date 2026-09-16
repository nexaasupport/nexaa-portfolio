export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Our Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Book Now', href: '#/book' },
]

export const heroStats = [
  { label: 'Homes served', value: '8,000+' },
  { label: 'Vetted pros', value: '450+' },
  { label: 'Avg. match time', value: '30 min' },
  { label: 'Customer rating', value: '4.8 / 5' },
]

export const steps = [
  { title: 'Request a service', body: 'Tell us what you need fixed, cleaned or installed and when.', icon: 'chat' },
  { title: 'Get matched', body: 'We match you with a vetted, background-checked local pro.', icon: 'user-check' },
  { title: 'Schedule the visit', body: 'Pick a time that works — confirmed instantly, no phone tag.', icon: 'calendar' },
  { title: 'Job done', body: 'Pay securely after the work is done, rate your pro.', icon: 'check' },
]

export const workGallery = [
  { label: 'Kitchen remodel', descriptor: 'Full renovation, 3-week turnaround', tone: 1, icon: 'wrench', image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=80' },
  { label: 'Bathroom repair', descriptor: 'Leak fix and fixture replacement', tone: 2, icon: 'droplet', image: 'https://images.unsplash.com/photo-1676210134188-4c05dd172f89?auto=format&fit=crop&w=900&q=80' },
  { label: 'AC installation', descriptor: 'Split-AC install, same-day service', tone: 3, icon: 'wind', image: 'https://images.unsplash.com/photo-1698479603408-1a66a6d9e80f?auto=format&fit=crop&w=900&q=80' },
  { label: 'Full home deep clean', descriptor: 'Move-in ready in one visit', tone: 4, icon: 'sparkle', wide: true, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80' },
  { label: 'Electrical rewiring', descriptor: 'Whole-home rewire, code compliant', tone: 5, icon: 'bolt', image: 'https://images.unsplash.com/photo-1665242043190-0ef29390d289?auto=format&fit=crop&w=900&q=80' },
  { label: 'Laundry & dry cleaning', descriptor: 'Pickup, wash, fold and delivery', tone: 6, icon: 'shirt', image: 'https://images.unsplash.com/photo-1611878821586-eb39c951c236?auto=format&fit=crop&w=900&q=80' },
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
  { quote: 'Booked an electrician at 9am, someone was at my door by 10:30. Genuinely faster than calling around myself.', name: 'Priya Nambiar', role: 'Homeowner, Chennai', avatar: 'https://images.unsplash.com/photo-1580746453801-37b0bc56f3b4?auto=format&fit=crop&w=200&q=80' },
  { quote: "The membership plan paid for itself after two bookings. I don't think about home repairs anymore, I just book.", name: 'Rohan Verma', role: 'Homeowner, Bengaluru', avatar: 'https://images.unsplash.com/photo-1586138888839-4990b010bb23?auto=format&fit=crop&w=200&q=80' },
  { quote: 'I send my laundry out every week now through Nexaa — pickup, fold, delivery, done. One less thing on my plate.', name: 'Ananya Iyer', role: 'Homeowner, Bengaluru', avatar: 'https://images.unsplash.com/photo-1496813146940-1601b02f81a4?auto=format&fit=crop&w=200&q=80' },
]
