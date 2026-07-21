/*
 * Elder onboarding tests: the multi-step wizard's logic —
 * per-step validation gates, store persistence, and the final
 * composed submit to POST /elders (answered by MSW).
 */
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp, seedUser, seedSession } from './utils.jsx'
import { useOnboardingStore } from '../stores/onboardingStore.js'

// The store is a module-level singleton, so reset it between tests
// (localStorage.clear() in setup.js wipes the persisted copy)
beforeEach(() => {
  useOnboardingStore.getState().reset()
  seedSession(seedUser()) // wizard is behind ProtectedRoute
})

describe('onboarding store', () => {
  test('updateSection merges values and persists to localStorage', () => {
    const store = useOnboardingStore.getState()

    store.updateSection('identity', { name: 'Daw Khin Myint' })
    store.updateSection('identity', { age: '72' })

    // Merging: the second update didn't wipe the first
    expect(useOnboardingStore.getState().identity).toMatchObject({
      name: 'Daw Khin Myint',
      age: '72',
    })

    // Persistence: the zustand persist middleware wrote it to
    // localStorage — this is what survives a browser refresh
    const persisted = JSON.parse(localStorage.getItem('myancare-onboarding'))
    expect(persisted.state.identity.name).toBe('Daw Khin Myint')
  })

  test('reset clears data and returns to step 0', () => {
    const store = useOnboardingStore.getState()
    store.updateSection('identity', { name: 'Test' })
    store.setStep(2)

    store.reset()

    expect(useOnboardingStore.getState().step).toBe(0)
    expect(useOnboardingStore.getState().identity.name).toBe('')
  })
})

describe('onboarding wizard', () => {
  test('Next is blocked by validation errors on an empty step', async () => {
    const user = userEvent.setup()
    renderApp('/onboarding')

    await user.click(await screen.findByRole('button', { name: 'Next' }))

    // Still on step 1, with zod's friendly messages showing
    expect(
      screen.getByRole('heading', { name: 'About your parent' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Please enter their full name.')).toBeDefined()
  })

  test('a valid step advances, and progress survives a remount (refresh)', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp('/onboarding')

    await user.type(
      await screen.findByLabelText('Full name'),
      'Daw Khin Myint',
    )
    await user.type(screen.getByLabelText('Age'), '72')
    await user.type(screen.getByLabelText('GSM phone number'), '09 450 123 456')
    await user.type(screen.getByLabelText('City or township'), 'Mandalay')
    await user.click(screen.getByRole('button', { name: 'Next' }))

    // Advanced to step 2
    expect(
      await screen.findByRole('heading', { name: 'Call preferences' }),
    ).toBeInTheDocument()

    // "Refresh": tear the whole app down and render it fresh
    unmount()
    renderApp('/onboarding')

    // Still on step 2, and step 1's data is still in the store
    expect(
      await screen.findByRole('heading', { name: 'Call preferences' }),
    ).toBeInTheDocument()
    expect(useOnboardingStore.getState().identity.name).toBe('Daw Khin Myint')
  })

  test('full walk-through submits the composed data to POST /elders', async () => {
    const user = userEvent.setup()
    renderApp('/onboarding')

    // Step 1: identity
    await user.type(
      await screen.findByLabelText('Full name'),
      'Daw Khin Myint',
    )
    await user.type(screen.getByLabelText('Age'), '72')
    await user.type(screen.getByLabelText('GSM phone number'), '09 450 123 456')
    await user.type(screen.getByLabelText('City or township'), 'Mandalay')
    await user.click(screen.getByRole('button', { name: 'Next' }))

    // Step 2: preferences (checkbox + select)
    await user.click(
      await screen.findByRole('checkbox', { name: 'Morning (8–11 AM)' }),
    )
    await user.selectOptions(
      screen.getByLabelText('Language or dialect'),
      'burmese',
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))

    // Step 3: care context (only emergency contact is required)
    await user.type(
      await screen.findByLabelText('Emergency contact name'),
      'U Tin Maung',
    )
    await user.type(
      screen.getByLabelText('Emergency contact phone'),
      '09 777 888 999',
    )
    await user.click(screen.getByRole('button', { name: 'Finish' }))

    // Success screen appears after the mocked POST resolves
    expect(
      await screen.findByRole('heading', { name: /all set/i }),
    ).toBeInTheDocument()

    // The handler stored the record — with age COERCED to a number
    // by zod's composed schema (input gave it as the string "72")
    const elders = JSON.parse(localStorage.getItem('myancare_elders'))
    expect(elders).toHaveLength(1)
    expect(elders[0].identity.age).toBe(72)
    expect(elders[0].preferences.timeWindows).toEqual(['morning'])

    // The wizard reset itself for next time
    expect(useOnboardingStore.getState().step).toBe(0)
    expect(useOnboardingStore.getState().identity.name).toBe('')
  })

  test('Back returns to the previous step without losing data', async () => {
    const user = userEvent.setup()
    // Jump straight to step 2 with step-1 data already in the store
    const store = useOnboardingStore.getState()
    store.updateSection('identity', {
      name: 'Daw Khin Myint',
      age: '72',
      phone: '09 450 123 456',
      city: 'Mandalay',
    })
    store.setStep(1)

    renderApp('/onboarding')

    await user.click(await screen.findByRole('button', { name: 'Back' }))

    // Step 1 again, fields still filled from the store
    expect(
      await screen.findByRole('heading', { name: 'About your parent' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Full name')).toHaveValue('Daw Khin Myint')
  })
})
