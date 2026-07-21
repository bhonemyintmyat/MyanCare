/*
 * Verifies the mock ↔ real API swap is controlled by env vars ALONE.
 *
 * The services build their URLs from VITE_API_URL (via apiConfig.js).
 * Here we point that env var at a fake "real" API host, re-import
 * the service fresh, and prove the request goes to the new host —
 * no application code changed, only the environment.
 */
import { http, HttpResponse } from 'msw'
import { server } from './server.js'

const REAL_API = 'https://api.myancare-real.example'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

test('API_URL falls back to /api when no env var is set', async () => {
  const { API_URL } = await import('../services/apiConfig.js')
  expect(API_URL).toBe('/api')
})

test('API_URL comes from VITE_API_URL when set', async () => {
  vi.stubEnv('VITE_API_URL', REAL_API)
  vi.resetModules() // force apiConfig.js to re-read the env

  const { API_URL } = await import('../services/apiConfig.js')
  expect(API_URL).toBe(REAL_API)
})

test('authService sends requests to the real API host, env change only', async () => {
  vi.stubEnv('VITE_API_URL', REAL_API)
  vi.resetModules()

  // Stand in for the real backend at the new host
  let receivedBody = null
  server.use(
    http.post(`${REAL_API}/auth/login`, async ({ request }) => {
      receivedBody = await request.json()
      return HttpResponse.json({ fullName: 'Aye Chan', email: 'a@b.com' })
    }),
  )

  // Fresh import so the service picks up the stubbed env
  const { login } = await import('../services/authService.js')
  const user = await login('a@b.com', 'secret123')

  // The request reached the "real" host with the right payload,
  // and the service worked identically — proving the swap is
  // configuration, not code
  expect(receivedBody).toEqual({ email: 'a@b.com', password: 'secret123' })
  expect(user.fullName).toBe('Aye Chan')
})

test('eldersService also follows VITE_API_URL', async () => {
  vi.stubEnv('VITE_API_URL', REAL_API)
  vi.resetModules()

  let receivedUrl = null
  server.use(
    http.post(`${REAL_API}/elders`, ({ request }) => {
      receivedUrl = request.url
      return HttpResponse.json({ id: 1 }, { status: 201 })
    }),
  )

  const { createElder } = await import('../services/eldersService.js')
  await createElder({ identity: { name: 'Test' } })

  expect(receivedUrl).toBe(`${REAL_API}/elders`)
})
