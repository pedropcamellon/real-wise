import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn, signOut } from 'next-auth/react'
import PagesOverview from './PagesOverview'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({ data: null }))
}))

describe('PagesOverview', () => {
  it('renders login button', () => {
    render(<PagesOverview />)
    const loginButton = screen.getByText('Login')
    expect(loginButton).toBeInTheDocument()
  })

  it('calls signIn when login button is clicked', async () => {
    render(<PagesOverview />)
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    expect(signIn).toHaveBeenCalled()
  })

  it('calls signOut when logout button is clicked', async () => {
    render(<PagesOverview />)
    const logoutButton = screen.getByText('Logout')
    await userEvent.click(logoutButton)
    expect(signOut).toHaveBeenCalled()
  })
})