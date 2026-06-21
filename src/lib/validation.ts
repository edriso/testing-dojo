// Input validation: another high-value target. It is pure logic, full of
// branches and boundaries, and it guards the rest of your app from bad data.

export type ValidationResult = { valid: true } | { valid: false; reason: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** An email must look like text@text.text and contain no spaces. */
export function validateEmail(value: string): ValidationResult {
  if (value.trim() === '') return { valid: false, reason: 'Email is required' }
  if (!EMAIL.test(value)) return { valid: false, reason: 'Email looks invalid' }
  return { valid: true }
}

/**
 * A password must be 8-64 characters and contain at least one number.
 * The length limits are the interesting part to test: 7 fails, 8 passes,
 * 64 passes, 65 fails (boundary value analysis).
 */
export function validatePassword(value: string): ValidationResult {
  if (value.length < 8) return { valid: false, reason: 'Too short (min 8)' }
  if (value.length > 64) return { valid: false, reason: 'Too long (max 64)' }
  if (!/[0-9]/.test(value)) return { valid: false, reason: 'Needs a number' }
  return { valid: true }
}
