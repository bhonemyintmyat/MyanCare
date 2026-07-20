/*
 * Mock data for the dashboard.
 *
 * Keeping fake data in its own file (instead of hardcoding it inside
 * components) means:
 * - components are written exactly as if the data came from an API
 * - when the real backend exists, you delete this file and fetch
 *   the same shapes from the server instead
 *
 * TODO(real API): replace these exports with fetch calls, e.g.
 *   GET /api/parent, GET /api/call-reports, GET /api/subscription
 */

// The parent receiving the calls
export const parent = {
  name: 'Daw Khin Myint',
  age: 72,
  phone: '09 450 123 456',
  township: 'Chanayethazan, Mandalay',
  // ISO format — components format it for display
  nextCall: '2026-07-22T10:00:00',
}

/*
 * Recent wellness updates, newest first.
 * mood is one of: 'good' | 'okay' | 'concerning'
 * (CallReports.jsx turns these into colored badges)
 */
export const callReports = [
  {
    id: 1,
    date: '2026-07-18',
    mood: 'good',
    caller: 'Ma Thandar',
    summary:
      'Daw Khin Myint was cheerful today. She talked about visiting the market with her neighbor and asked how your work is going. Appetite and sleep are both good.',
  },
  {
    id: 2,
    date: '2026-07-15',
    mood: 'okay',
    caller: 'Ma Thandar',
    summary:
      'A quieter call than usual. She said the rainy season makes her joints stiff, but she is taking her blood pressure medicine on time. She enjoyed your last voice note.',
  },
  {
    id: 3,
    date: '2026-07-11',
    mood: 'concerning',
    caller: 'Ko Zaw Lin',
    summary:
      'She mentioned knee pain that kept her from the morning walk two days in a row. We gently suggested she see the clinic — you may want to follow up on this.',
  },
  {
    id: 4,
    date: '2026-07-08',
    mood: 'good',
    caller: 'Ma Thandar',
    summary:
      'In great spirits — she cooked mohinga for the neighbors and was proud of it. Blood pressure check at the clinic came back normal.',
  },
]

// Current subscription details
export const subscription = {
  plan: 'Monthly Care Plan',
  price: '25,000 MMK / month',
  status: 'Active',
  nextPaymentDate: '2026-08-01',
}
