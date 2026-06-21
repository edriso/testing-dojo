import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword } from './validation'

describe('validateEmail', () => {
  // Equivalence partitioning: pick ONE representative from each class of input
  // instead of testing a hundred addresses that all behave the same way.
  it.each([
    'ada@example.com',
    'a.b+tag@sub.domain.org',
  ])('accepts a well-formed address: %s', (email) => {
    expect(validateEmail(email)).toEqual({ valid: true })
  })

  it.each([
    ['', 'Email is required'],
    ['   ', 'Email is required'],
    ['not-an-email', 'Email looks invalid'],
    ['missing@domain', 'Email looks invalid'],
    ['spaces in@email.com', 'Email looks invalid'],
  ])('rejects %j with the right reason', (email, reason) => {
    expect(validateEmail(email)).toEqual({ valid: false, reason })
  })
})

describe('validatePassword', () => {
  // Boundary value analysis around the 8-character minimum.
  it('rejects a password just below the minimum (7 chars)', () => {
    expect(validatePassword('abcde12')).toEqual({
      valid: false,
      reason: 'Too short (min 8)',
    })
  })

  it('accepts a password exactly at the minimum (8 chars)', () => {
    expect(validatePassword('abcdef12')).toEqual({ valid: true })
  })

  it('accepts a password exactly at the maximum (64 chars)', () => {
    const pw = 'a1'.repeat(32) // 64 characters
    expect(validatePassword(pw)).toEqual({ valid: true })
  })

  it('rejects a password just above the maximum (65 chars)', () => {
    const pw = 'a1'.repeat(32) + 'x' // 65 characters
    expect(validatePassword(pw)).toEqual({ valid: false, reason: 'Too long (max 64)' })
  })

  it('requires at least one number', () => {
    expect(validatePassword('letmeinplease')).toEqual({
      valid: false,
      reason: 'Needs a number',
    })
  })
})
