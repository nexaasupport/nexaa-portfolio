import { DEFAULT_SERVICES } from './services.js'

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString()

const atHour = (dayOffset, hour, minute = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const DEFAULT_BUSINESS_HOURS = {
  mon: { open: '09:00', close: '18:00', closed: false },
  tue: { open: '09:00', close: '18:00', closed: false },
  wed: { open: '09:00', close: '18:00', closed: false },
  thu: { open: '09:00', close: '18:00', closed: false },
  fri: { open: '09:00', close: '18:00', closed: false },
  sat: { open: '10:00', close: '16:00', closed: false },
  sun: { open: '10:00', close: '16:00', closed: true },
}

// Pincodes the demo "serves" — matches the seeded customer cities loosely.
const DEFAULT_SERVED_PINCODES = ['600001', '600028', '600041', '560001', '560038', '700001', '700016']

export function buildSeed() {
  const technicians = [
    { id: 'tech_1', name: 'Arjun Mehta', email: 'arjun@nexaahome.com', specialty: 'Plumbing', skills: ['plumbing'], status: 'available', completedJobs: 0, rating: 4.8, ratingCount: 1, createdAt: daysAgo(120) },
    { id: 'tech_2', name: 'Divya Rao', email: 'divya@nexaahome.com', specialty: 'Electrical', skills: ['electrical'], status: 'available', completedJobs: 0, rating: null, ratingCount: 0, createdAt: daysAgo(110) },
    { id: 'tech_3', name: 'Karthik Iyer', email: 'karthik@nexaahome.com', specialty: 'HVAC & AC', skills: ['hvac'], status: 'on_job', completedJobs: 0, rating: null, ratingCount: 0, createdAt: daysAgo(95) },
    { id: 'tech_4', name: 'Sneha Pillai', email: 'sneha@nexaahome.com', specialty: 'Deep Cleaning', skills: ['cleaning'], status: 'available', completedJobs: 0, rating: null, ratingCount: 0, createdAt: daysAgo(80) },
    { id: 'tech_5', name: 'Rahul Nair', email: 'rahul@nexaahome.com', specialty: 'Painting', skills: ['painting', 'appliance'], status: 'off', completedJobs: 0, rating: null, ratingCount: 0, createdAt: daysAgo(60) },
  ]

  const customers = [
    // Demo login: meera.k@example.com / demo1234 — lets the "My Account"
    // demo button land on a customer who already has booking history.
    { id: 'cust_1', name: 'Meera Krishnan', email: 'meera.k@example.com', phone: '+91 98765 43210', address: '12 Lake View Rd, Chennai', createdAt: daysAgo(45), passwordHash: '7e66196c4fa1bf2ab1dd4f49afeec15b7e4aa62b994ac8444b73b0c182eb430e', passwordSalt: 'nexaa-demo-salt' },
    { id: 'cust_2', name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '+91 91234 56780', address: '4th Cross, Indiranagar, Bengaluru', createdAt: daysAgo(30), passwordHash: null, passwordSalt: null },
    { id: 'cust_3', name: 'Ananya Das', email: 'ananya.das@example.com', phone: '+91 99887 76655', address: '221 Park Street, Kolkata', createdAt: daysAgo(15), passwordHash: null, passwordSalt: null },
  ]

  const serviceFor = (serviceId) => DEFAULT_SERVICES.find((s) => s.id === serviceId)
  const priceFor = (serviceId) => serviceFor(serviceId)?.basePrice ?? 999
  const gstFor = (serviceId) => serviceFor(serviceId)?.gstRate ?? 0
  const taxFor = (serviceId) => Math.round(priceFor(serviceId) * (gstFor(serviceId) / 100))
  const totalFor = (serviceId) => priceFor(serviceId) + taxFor(serviceId)

  const jobs = [
    {
      id: 'job_1', customerId: 'cust_1', service: 'plumbing', address: customers[0].address, pincode: '600001', notes: 'Kitchen sink leaking under the cabinet.',
      status: 'completed', technicianId: 'tech_1', price: priceFor('plumbing'), gstRate: gstFor('plumbing'), taxAmount: taxFor('plumbing'), total: totalFor('plumbing'),
      createdAt: daysAgo(20), scheduledAt: atHour(-19, 10), durationMinutes: 60, cancellationReason: null,
      assignedAt: daysAgo(20), startedAt: atHour(-19, 10), completedAt: atHour(-19, 11), cancelledAt: null,
    },
    {
      id: 'job_2', customerId: 'cust_2', service: 'electrical', address: customers[1].address, pincode: '560001', notes: 'Switchboard sparking near the hallway.',
      status: 'completed', technicianId: 'tech_2', price: priceFor('electrical'), gstRate: gstFor('electrical'), taxAmount: taxFor('electrical'), total: totalFor('electrical'),
      createdAt: daysAgo(12), scheduledAt: atHour(-11, 14), durationMinutes: 60, cancellationReason: null,
      assignedAt: daysAgo(12), startedAt: atHour(-11, 14), completedAt: atHour(-11, 15), cancelledAt: null,
    },
    {
      id: 'job_3', customerId: 'cust_3', service: 'hvac', address: customers[2].address, pincode: '700001', notes: 'AC not cooling, needs a service check.',
      status: 'in_progress', technicianId: 'tech_3', price: priceFor('hvac'), gstRate: gstFor('hvac'), taxAmount: taxFor('hvac'), total: totalFor('hvac'),
      createdAt: daysAgo(2), scheduledAt: atHour(0, 11), durationMinutes: 60, cancellationReason: null,
      assignedAt: daysAgo(2), startedAt: atHour(0, 11), completedAt: null, cancelledAt: null,
    },
    {
      id: 'job_4', customerId: 'cust_1', service: 'cleaning', address: customers[0].address, pincode: '600028', notes: 'Full deep clean before guests arrive.',
      status: 'assigned', technicianId: 'tech_4', price: priceFor('cleaning'), gstRate: gstFor('cleaning'), taxAmount: taxFor('cleaning'), total: totalFor('cleaning'),
      createdAt: daysAgo(1), scheduledAt: atHour(1, 9), durationMinutes: 120, cancellationReason: null,
      assignedAt: daysAgo(1), startedAt: null, completedAt: null, cancelledAt: null,
    },
    {
      id: 'job_5', customerId: 'cust_2', service: 'appliance', address: customers[1].address, pincode: '560038', notes: 'Washing machine drum not spinning.',
      status: 'new', technicianId: null, price: priceFor('appliance'), gstRate: gstFor('appliance'), taxAmount: taxFor('appliance'), total: totalFor('appliance'),
      createdAt: daysAgo(0), scheduledAt: atHour(2, 15), durationMinutes: 60, cancellationReason: null,
      assignedAt: null, startedAt: null, completedAt: null, cancelledAt: null,
    },
  ]

  technicians.find((t) => t.id === 'tech_1').completedJobs = 1
  technicians.find((t) => t.id === 'tech_2').completedJobs = 1

  const payments = jobs
    .filter((j) => j.status === 'completed')
    .map((j, i) => ({
      id: `pay_${i + 1}`,
      jobId: j.id,
      customerId: j.customerId,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
      subtotal: j.price,
      taxRate: j.gstRate,
      taxAmount: j.taxAmount,
      amount: j.total,
      method: 'UPI',
      status: i === 0 ? 'paid' : 'pending',
      date: j.scheduledAt,
    }))

  const reviews = [
    { id: 'review_1', jobId: 'job_1', technicianId: 'tech_1', rating: 5, comment: 'Fixed the leak in 20 minutes, very professional.', createdAt: daysAgo(19) },
  ]

  const activity = [
    { id: 'act_1', type: 'job_completed', message: 'Arjun Mehta completed the plumbing job for Meera Krishnan.', at: daysAgo(19) },
    { id: 'act_2', type: 'job_completed', message: 'Divya Rao completed the electrical job for Vikram Singh.', at: daysAgo(11) },
    { id: 'act_3', type: 'job_assigned', message: 'Sneha Pillai assigned to a deep cleaning job for Meera Krishnan.', at: daysAgo(1) },
  ]

  const notifications = [
    { id: 'notif_1', type: 'booking', jobId: 'job_4', to: customers[0].email, subject: 'Your Nexaa Home booking is confirmed', body: 'Deep Cleaning scheduled.', status: 'skipped', sentAt: daysAgo(1) },
    { id: 'notif_2', type: 'booking', jobId: 'job_5', to: customers[1].email, subject: 'Your Nexaa Home booking is confirmed', body: 'Appliance Repair scheduled.', status: 'skipped', sentAt: daysAgo(0) },
  ]

  const settings = {
    businessName: 'Nexaa Home',
    notificationEmail: 'ops@nexaahome.com',
    timezone: 'Asia/Kolkata',
    services: DEFAULT_SERVICES,
    businessHours: DEFAULT_BUSINESS_HOURS,
    slotDurationMinutes: 60,
    servedPincodes: DEFAULT_SERVED_PINCODES,
    nextInvoiceNumber: payments.length + 1,
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
  }

  return { jobs, customers, technicians, payments, reviews, activity, notifications, settings }
}
