import { useState } from 'react'
import { StarRating } from './examples/StarRating'
import { LoginForm } from './examples/LoginForm'
import { useCounter } from '../lib/useCounter'

// These demos render the EXACT components and hooks that the test files in
// src/lib and src/components/examples exercise. Play with them here, then read
// the tests that pin their behaviour down. Nothing is faked for show.

export function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter({ initial: 0, min: 0, max: 10 })
  return (
    <div className="demo">
      <div className="demo-head">useCounter() &middot; bounded 0-10</div>
      <div className="demo-body counter-demo">
        <button onClick={decrement} aria-label="decrement">
          -
        </button>
        <span className="counter-value">{count}</span>
        <button onClick={increment} aria-label="increment">
          +
        </button>
        <button className="counter-reset" onClick={reset}>
          reset
        </button>
      </div>
    </div>
  )
}

export function StarRatingDemo() {
  const [value, setValue] = useState(0)
  return (
    <div className="demo">
      <div className="demo-head">&lt;StarRating /&gt;</div>
      <div className="demo-body star-demo">
        <StarRating max={5} onChange={setValue} />
        <span className="demo-readout">selected: {value || '-'}</span>
      </div>
    </div>
  )
}

// A pretend backend: succeeds normally, but rejects when the password is the
// literal word "fail" so you can watch the error path the test also checks.
async function fakeSignIn({ password }: { email: string; password: string }) {
  await new Promise((r) => setTimeout(r, 600))
  if (password === 'fail') throw new Error('bad credentials')
}

export function LoginFormDemo() {
  const [last, setLast] = useState<string>('nothing submitted yet')
  return (
    <div className="demo">
      <div className="demo-head">
        &lt;LoginForm /&gt; &middot; try password <code>fail</code> to see the error path
      </div>
      <div className="demo-body">
        <LoginForm
          onSubmit={async (creds) => {
            try {
              await fakeSignIn(creds)
              setLast(`signed in as ${creds.email}`)
            } catch (e) {
              setLast('submit rejected')
              throw e
            }
          }}
        />
        <p className="demo-readout">{last}</p>
      </div>
    </div>
  )
}

