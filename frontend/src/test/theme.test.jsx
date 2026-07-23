/*
 * Theme tests: default is light, the toggle flips dark/light,
 * the choice persists, and <html data-theme> drives the CSS.
 */
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from './utils.jsx'

test('defaults to light mode with no data-theme attribute', async () => {
  renderApp('/')
  await screen.findByRole('heading', { name: /be there for your parents/i })

  expect(document.documentElement.dataset.theme).toBeUndefined()
  // The toggle offers dark mode (that's the action available from light)
  expect(
    screen.getByRole('button', { name: 'Switch to dark mode' }),
  ).toBeInTheDocument()
})

test('toggle switches to dark, persists, and updates <html>', async () => {
  const user = userEvent.setup()
  renderApp('/')

  const toggle = await screen.findByRole('button', {
    name: 'Switch to dark mode',
  })
  await user.click(toggle)

  // CSS hook set on <html> and choice cached for next visit
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(localStorage.getItem('myancare_theme')).toBe('dark')

  // The button now offers the reverse action
  expect(
    screen.getByRole('button', { name: 'Switch to light mode' }),
  ).toBeInTheDocument()

  // Toggling back removes the attribute (light is the default)
  await user.click(screen.getByRole('button', { name: 'Switch to light mode' }))
  expect(document.documentElement.dataset.theme).toBeUndefined()
  expect(localStorage.getItem('myancare_theme')).toBe('light')
})

test('a saved dark preference is applied on load', async () => {
  // Simulate the pre-paint inline script having run for a returning
  // dark-mode user
  localStorage.setItem('myancare_theme', 'dark')
  document.documentElement.dataset.theme = 'dark'

  renderApp('/')
  await screen.findByRole('heading', { name: /be there for your parents/i })

  // Provider starts in dark, so the toggle offers the light action
  expect(
    screen.getByRole('button', { name: 'Switch to light mode' }),
  ).toBeInTheDocument()
})
