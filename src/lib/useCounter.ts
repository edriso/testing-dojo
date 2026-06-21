import { useCallback, useState } from 'react'

type UseCounterOptions = { initial?: number; min?: number; max?: number }

/**
 * A counter hook with optional bounds. Custom hooks hold real logic, so they
 * deserve real tests - but you test them through their public result, never by
 * reaching inside React's internals.
 */
export function useCounter({ initial = 0, min = -Infinity, max = Infinity }: UseCounterOptions = {}) {
  const [count, setCount] = useState(initial)

  const increment = useCallback(
    () => setCount((c) => Math.min(c + 1, max)),
    [max],
  )
  const decrement = useCallback(
    () => setCount((c) => Math.max(c - 1, min)),
    [min],
  )
  const reset = useCallback(() => setCount(initial), [initial])

  return { count, increment, decrement, reset }
}
