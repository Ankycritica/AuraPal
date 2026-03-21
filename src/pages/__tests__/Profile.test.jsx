/* eslint-env jest */
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Profile } from '../Profile'
import { useAuthStore } from '../../store/useStore'

// Mock the store
jest.mock('../../store/useStore', () => ({
  useAuthStore: jest.fn(),
}))

// Mock toast to avoid provider requirement
jest.mock('../../components/ui/use-toast-hook', () => ({
  useToast: () => ({ push: jest.fn() }),
}))

describe('Profile', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      user: {
        id: '1',
        displayName: 'Test User',
        handle: '@testuser',
        bio: 'Test bio',
        interests: ['coding', 'privacy'],
        visibility: 'public',
      },
      updateProfile: jest.fn(),
      updateDisplayName: jest.fn(() => ({ success: true })),
    })
  })

  it('renders the profile editor form', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    )
    expect(screen.getByText(/Test User/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument()
  })

  it('displays current user data', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    )
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
    expect(screen.getByDisplayValue('@testuser')).toBeInTheDocument()
  })
})
