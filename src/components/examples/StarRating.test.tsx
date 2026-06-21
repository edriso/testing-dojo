import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StarRating } from './StarRating'

describe('StarRating', () => {
  it('renders the right number of stars with accessible names', () => {
    render(<StarRating max={5} />)
    // getByRole is the top-priority query: it is what a screen reader sees too.
    expect(screen.getAllByRole('radio')).toHaveLength(5)
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeInTheDocument()
  })

  it('marks stars up to the clicked one as selected', async () => {
    // user-event v14: set up first, then await every interaction.
    const user = userEvent.setup()
    render(<StarRating max={5} />)

    await user.click(screen.getByRole('radio', { name: '3 stars' }))

    // We assert on observable state (aria-checked), not the component's
    // internal `rating` variable. This survives refactors and catches real bugs.
    expect(screen.getByRole('radio', { name: '1 star' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '4 stars' })).not.toBeChecked()
  })

  it('calls onChange with the chosen value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn() // a spy: it records how it was called
    render(<StarRating onChange={onChange} />)

    await user.click(screen.getByRole('radio', { name: '4 stars' }))

    expect(onChange).toHaveBeenCalledExactlyOnceWith(4)
  })
})
