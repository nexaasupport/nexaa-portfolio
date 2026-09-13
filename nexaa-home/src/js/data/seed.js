import { DEFAULT_SERVICES } from './services.js'

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString()

export function buildSeed() {
  const technicians = [
    { id: 'tech_1', name: 'Arjun Mehta', specialty: 'Plumbing', status: 'available', completedJobs: 0, createdAt: daysAgo(120) },
    { id: 'tech_2', name: 'Divya Rao', specialty: 'Electrical', status: 'available', completedJobs: 0, createdAt: daysAgo(110) },
    { id: 'tech_3', name: 'Karthik Iyer', specialty: 'HVAC & AC', status: 'on_job', completedJobs: 0, createdAt: daysAgo(95) },
    { id: 'tech_4', name: 'Sneha Pillai', specialty: 'Deep Cleaning', status: 'available', completedJobs: 0, createdAt: daysAgo(80) },
    { id: 'tech_5', name: 'Rahul Nair', specialty: 'Painting', status: 'off', completedJobs: 0, createdAt: daysAgo(60) },
  ]

  const customers = [
    { id: 'cust_1', name: 'Meera Krishnan', email: 'meera.k@example.com', phone: '+91 98765 43210', address: '12 Lake View Rd, Chennai', createdAt: daysAgo(45) },
    { id: 'cust_2', name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '+91 91234 56780', address: '4th Cross, Indiranagar, Bengaluru', createdAt: daysAgo(30) },
    { id: 'cust_3', name: 'Ananya Das', email: 'ananya.das@example.com', phone: '+91 99887 76655', address: '221 Park Street, Kolkata', createdAt: daysAgo(15) },
  ]

  const priceFor = (serviceId) => DEFAULT_SERVICES.find((s) => s.id === serviceId)?.basePrice ?? 999

  const jobs = [
    { id: 'job_1', customerId: 'cust_1', service: 'plumbing', address: customers[0].address, notes: 'Kitchen sink leaking under the cabinet.', status: 'completed', technicianId: 'tech_1', price: priceFor('plumbing'), createdAt: daysAgo(20), scheduledAt: daysAgo(19) },
    { id: 'job_2', customerId: 'cust_2', service: 'electrical', address: customers[1].address, notes: 'Switchboard sparking near the hallway.', status: 'completed', technicianId: 'tech_2', price: priceFor('electrical'), createdAt: daysAgo(12), scheduledAt: daysAgo(11) },
    { id: 'job_3', customerId: 'cust_3', service: 'hvac', address: customers[2].address, notes: 'AC not cooling, needs a service check.', status: 'in_progress', technicianId: 'tech_3', price: priceFor('hvac'), createdAt: daysAgo(2), scheduledAt: daysAgo(0) },
    { id: 'job_4', customerId: 'cust_1', service: 'cleaning', address: customers[0].address, notes: 'Full deep clean before guests arrive.', status: 'assigned', technicianId: 'tech_4', price: priceFor('cleaning'), createdAt: daysAgo(1), scheduledAt: daysAgo(0) },
    { id: 'job_5', customerId: 'cust_2', service: 'appliance', address: customers[1].address, notes: 'Washing machine drum not spinning.', status: 'new', technicianId: null, price: priceFor('appliance'), createdAt: daysAgo(0), scheduledAt: null },
  ]

  technicians.find((t) => t.id === 'tech_1').completedJobs = 1
  technicians.find((t) => t.id === 'tech_2').completedJobs = 1

  const payments = jobs
    .filter((j) => j.status === 'completed')
    .map((j, i) => ({
      id: `pay_${i + 1}`,
      jobId: j.id,
      customerId: j.customerId,
      amount: j.price,
      method: 'UPI',
      status: i === 0 ? 'paid' : 'pending',
      date: j.scheduledAt,
    }))

  const activity = [
    { id: 'act_1', type: 'job_completed', message: 'Arjun Mehta completed the plumbing job for Meera Krishnan.', at: daysAgo(19) },
    { id: 'act_2', type: 'job_completed', message: 'Divya Rao completed the electrical job for Vikram Singh.', at: daysAgo(11) },
    { id: 'act_3', type: 'job_assigned', message: 'Sneha Pillai assigned to a deep cleaning job for Meera Krishnan.', at: daysAgo(1) },
  ]

  const settings = {
    businessName: 'Nexaa Home',
    notificationEmail: 'ops@nexaahome.com',
    timezone: 'Asia/Kolkata',
    services: DEFAULT_SERVICES,
  }

  return { jobs, customers, technicians, payments, activity, settings }
}
