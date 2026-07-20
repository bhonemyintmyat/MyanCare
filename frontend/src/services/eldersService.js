/*
 * eldersService: mock API for elder profiles.
 * Same pattern as authService — setTimeout fakes the network,
 * localStorage fakes the database. See authService.js for the
 * full explanation of this approach.
 */

const ELDERS_KEY = 'myancare_elders'

function fakeDelay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/*
 * "POST /elders" — saves a new elder profile.
 * Takes the validated onboarding data and resolves with the
 * created record (including a server-generated id).
 */
export async function createElder(elderData) {
  // TODO(real API): replace with:
  //   const res = await fetch('/api/elders', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(elderData),
  //   })
  //   if (!res.ok) throw new Error('Could not save the profile. Please try again.')
  //   return res.json()
  await fakeDelay()

  const elders = JSON.parse(localStorage.getItem(ELDERS_KEY)) || []

  // A real server would generate the id; Date.now() is our stand-in
  const created = {
    id: Date.now(),
    ...elderData,
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(ELDERS_KEY, JSON.stringify([...elders, created]))
  return created
}
