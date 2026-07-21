/*
 * Single source of truth for where the API lives.
 *
 * Vite exposes env vars that start with VITE_ to the browser via
 * import.meta.env. They come from .env files or the shell:
 *
 *   .env.development  → used by `npm run dev`
 *   .env.production   → used by `npm run build`
 *
 * Swapping the whole app from mocks to a real backend is env-only:
 *   VITE_USE_MOCKS=false
 *   VITE_API_URL=https://api.your-real-domain.com
 * No code changes anywhere.
 */
export const API_URL = import.meta.env.VITE_API_URL || '/api'

/*
 * Shared response handling: turn non-2xx responses into thrown
 * Errors with the server's friendly message (or a fallback).
 */
export async function parseResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || 'Something went wrong. Please try again.')
  }
  return response.json()
}
