/*
 * Auth flow tests: signup validation, signup success, login failure
 * and success — exercised through the real App, real services, and
 * MSW answering the network calls.
 */
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp, seedUser } from './utils.jsx'

describe('signup', () => {
  test('shows friendly validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderApp('/signup')

    // Pages are lazy-loaded, so wait for the form to appear
    await user.click(
      await screen.findByRole('button', { name: /create account/i }),
    )

    expect(
      screen.getByText('Please tell us your full name.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText("That email doesn't look right — please double-check it."),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Please choose the country you work in.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Your password needs at least 8 characters.'),
    ).toBeInTheDocument()

    // The invalid fields are marked for screen readers too
    expect(screen.getByLabelText('Full name')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  test('valid signup creates the account and lands on the dashboard', async () => {
    const user = userEvent.setup()
    renderApp('/signup')

    await user.type(await screen.findByLabelText('Full name'), 'Aye Chan')
    await user.type(screen.getByLabelText('Email'), 'ayechan@example.com')
    await user.type(screen.getByLabelText('Phone number'), '+65 9123 4567')
    await user.selectOptions(
      screen.getByLabelText('Country you work in'),
      'singapore',
    )
    await user.type(screen.getByLabelText('Password'), 'testpass123')
    await user.type(screen.getByLabelText('Confirm password'), 'testpass123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    // Redirected to the (lazy-loaded, protected) dashboard
    expect(
      await screen.findByRole('heading', { name: /welcome back, aye/i }),
    ).toBeInTheDocument()

    // Mutation feedback: the success toast appeared
    expect(
      screen.getByText('Welcome to MyanCare! Your account is ready.'),
    ).toBeInTheDocument()

    // The mock backend actually stored the account
    const users = JSON.parse(localStorage.getItem('myancare_users'))
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('ayechan@example.com')
  })

  test('duplicate email is rejected with the server message', async () => {
    seedUser() // account with this email already exists
    const user = userEvent.setup()
    renderApp('/signup')

    await user.type(await screen.findByLabelText('Full name'), 'Aye Chan')
    await user.type(screen.getByLabelText('Email'), 'ayechan@example.com')
    await user.type(screen.getByLabelText('Phone number'), '+65 9123 4567')
    await user.selectOptions(
      screen.getByLabelText('Country you work in'),
      'singapore',
    )
    await user.type(screen.getByLabelText('Password'), 'testpass123')
    await user.type(screen.getByLabelText('Confirm password'), 'testpass123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      await screen.findByText(
        'An account with this email already exists. Try logging in instead.',
      ),
    ).toBeInTheDocument()
  })
})

describe('login', () => {
  test('wrong password shows the vague server error', async () => {
    seedUser()
    const user = userEvent.setup()
    renderApp('/login')

    await user.type(
      await screen.findByLabelText('Email'),
      'ayechan@example.com',
    )
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(
      await screen.findByText(
        "Email or password doesn't match. Please try again.",
      ),
    ).toBeInTheDocument()
  })

  test('correct credentials log in and land on the dashboard', async () => {
    seedUser()
    const user = userEvent.setup()
    renderApp('/login')

    await user.type(
      await screen.findByLabelText('Email'),
      'ayechan@example.com',
    )
    await user.type(screen.getByLabelText('Password'), 'testpass123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(
      await screen.findByRole('heading', { name: /welcome back, aye/i }),
    ).toBeInTheDocument()
  })
})

describe('route protection', () => {
  test('visiting /dashboard logged out redirects to the login page', async () => {
    renderApp('/dashboard')

    expect(
      await screen.findByRole('heading', { name: /welcome back$/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })
})
