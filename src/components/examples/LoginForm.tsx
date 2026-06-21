import { useState } from 'react'
import { validateEmail } from '../../lib/validation'

type LoginFormProps = {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>
}

// A realistic little form: client-side validation, an async submit, a loading
// state, and an error message. Every one of those is a behaviour worth testing.
export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    const emailCheck = validateEmail(email)
    if (!emailCheck.valid) {
      setError(emailCheck.reason)
      return
    }

    setPending(true)
    try {
      await onSubmit({ email, password })
    } catch {
      setError('Sign in failed. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Sign in">
      <label>
        Email
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
