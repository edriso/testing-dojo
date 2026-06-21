import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('shows a validation error and does NOT submit when the email is bad', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm onSubmit={onSubmit} />)

    // Find fields by their label - the same way a person reads the form.
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'hunter2-secret')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/looks invalid/i)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the credentials when the input is valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'hunter2-secret')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'hunter2-secret',
    })
  })

  it('surfaces an error message when submission fails', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error('network down'))
    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'hunter2-secret')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    // findBy* waits for the element to appear after the async submit settles.
    // No arbitrary sleeps, no "act(...)" warning - just await the outcome.
    expect(await screen.findByRole('alert')).toHaveTextContent(/failed/i)
  })
})
