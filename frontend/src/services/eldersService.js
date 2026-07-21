/*
 * eldersService: elder profile API calls.
 * Same setup as authService — real fetch() calls, answered by
 * Mock Service Worker in development and by the real backend
 * (VITE_API_URL) in production.
 */
import { API_URL, parseResponse } from './apiConfig.js'

/*
 * POST /elders — saves a new elder profile.
 * Takes the validated onboarding data and resolves with the
 * created record (including a server-generated id).
 */
export async function createElder(elderData) {
  const response = await fetch(`${API_URL}/elders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(elderData),
  })
  return parseResponse(response)
}
