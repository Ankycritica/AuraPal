/* eslint-env jest */
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Hero } from '../Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    )
    expect(screen.getByText(/AuraPal — Privacy-first community for real connection/i)).toBeInTheDocument()
  })

  it('renders the subheadline', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    )
    expect(screen.getByText(/Encrypted conversations, mindful matches, zero data mining/i)).toBeInTheDocument()
  })

  it('renders the Get Started button', () => {
    render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    )
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument()
  })
})


