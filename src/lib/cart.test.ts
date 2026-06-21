import { describe, it, expect } from 'vitest'
import {
  subtotalCents,
  applyDiscount,
  formatMoney,
  type CartItem,
} from './cart'

// A tiny helper keeps each test readable: we only spell out what matters.
const item = (over: Partial<CartItem> = {}): CartItem => ({
  name: 'Coffee',
  unitPriceCents: 499,
  quantity: 1,
  ...over,
})

describe('subtotalCents', () => {
  // Arrange - Act - Assert: the three beats of almost every good test.
  it('adds up quantity x unit price across all items', () => {
    // Arrange
    const cart = [
      item({ unitPriceCents: 499, quantity: 2 }), // 998
      item({ unitPriceCents: 150, quantity: 3 }), // 450
    ]
    // Act
    const total = subtotalCents(cart)
    // Assert
    expect(total).toBe(1448)
  })

  // The empty case is the edge case people forget - and it is one line to cover.
  it('returns 0 for an empty cart', () => {
    expect(subtotalCents([])).toBe(0)
  })

  it('throws when a quantity is negative', () => {
    expect(() => subtotalCents([item({ quantity: -1 })])).toThrow(/negative/)
  })
})

describe('applyDiscount', () => {
  it('takes the right amount off', () => {
    expect(applyDiscount(1000, 20)).toBe(800)
  })

  // Boundary value analysis: bugs love the edges. Test 0% and 100%.
  it('changes nothing at 0%', () => {
    expect(applyDiscount(1000, 0)).toBe(1000)
  })

  it('zeroes the price at 100%', () => {
    expect(applyDiscount(1000, 100)).toBe(0)
  })

  // Rounding is a classic money bug. 333 * 0.9 = 299.7 -> must round to 300.
  it('rounds to the nearest whole cent', () => {
    expect(applyDiscount(333, 10)).toBe(300)
  })

  // Table-driven tests (it.each) keep many invalid inputs from becoming
  // many near-identical copy-pasted test functions.
  it.each([-1, 101, 200])('rejects an out-of-range percent (%i)', (percent) => {
    expect(() => applyDiscount(1000, percent)).toThrow(/between 0 and 100/)
  })
})

describe('formatMoney', () => {
  it('renders cents as a currency string', () => {
    expect(formatMoney(499)).toBe('$4.99')
  })

  // This is WHY we keep money in cents. If we did dollar math with floats,
  // 0.1 + 0.2 would be 0.30000000000000004. In cents it is just 10 + 20 = 30.
  it('never suffers from floating-point drift', () => {
    expect(0.1 + 0.2).not.toBe(0.3) // the famous JavaScript gotcha
    expect(formatMoney(10 + 20)).toBe('$0.30') // cents math stays exact
  })
})
