// A small shopping-cart pricing module.
//
// This is exactly the kind of code that is WORTH testing well: it does money
// math, it has branches (discounts, caps), and a bug here costs real cash.
// Notice we store money as integer cents, never as floating-point dollars,
// because 0.1 + 0.2 !== 0.3 in JavaScript (IEEE-754 floating point).

export type CartItem = {
  name: string
  /** Price for ONE unit, in cents. e.g. $4.99 -> 499 */
  unitPriceCents: number
  quantity: number
}

/** Sum of every line item, in cents. An empty cart costs 0. */
export function subtotalCents(items: CartItem[]): number {
  return items.reduce((total, item) => {
    if (item.quantity < 0) {
      throw new Error(`quantity cannot be negative: got ${item.quantity}`)
    }
    return total + item.unitPriceCents * item.quantity
  }, 0)
}

/**
 * Apply a percentage discount to an amount in cents.
 * - percent is 0-100.
 * - Result is rounded to the nearest cent (no fractional cents exist).
 */
export function applyDiscount(amountCents: number, percent: number): number {
  if (percent < 0 || percent > 100) {
    throw new Error(`discount must be between 0 and 100, got ${percent}`)
  }
  const discounted = amountCents * (1 - percent / 100)
  return Math.round(discounted)
}

/** Format an amount in cents as a human-readable price string. */
export function formatMoney(amountCents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    amountCents / 100,
  )
}
