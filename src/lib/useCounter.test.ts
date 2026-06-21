import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

// `renderHook` lets you exercise a hook without building a throwaway component.
// Note: it lives in @testing-library/react now. The old
// @testing-library/react-hooks package is deprecated - a common stale tutorial.
describe('useCounter', () => {
  it('starts at the initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 5 }))
    expect(result.current.count).toBe(5)
  })

  it('increments and decrements', () => {
    const { result } = renderHook(() => useCounter())

    // State updates must be wrapped in act() so React flushes them before
    // we assert. Awaited userEvent / RTL helpers do this for you elsewhere.
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)

    act(() => result.current.decrement())
    expect(result.current.count).toBe(0)
  })

  it('does not go above max', () => {
    const { result } = renderHook(() => useCounter({ initial: 3, max: 3 }))
    act(() => result.current.increment())
    expect(result.current.count).toBe(3)
  })

  it('does not go below min', () => {
    const { result } = renderHook(() => useCounter({ initial: 0, min: 0 }))
    act(() => result.current.decrement())
    expect(result.current.count).toBe(0)
  })

  it('resets back to the initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 10 }))
    act(() => result.current.increment())
    act(() => result.current.reset())
    expect(result.current.count).toBe(10)
  })
})
