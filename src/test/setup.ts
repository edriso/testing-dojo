// This file runs once before every test file (configured in vite.config.ts).
//
// 1. It teaches Vitest's `expect` the extra DOM matchers from jest-dom,
//    so you can write things like `expect(el).toBeInTheDocument()`.
// 2. It wires up the mock API server so tests never hit the real network.
import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../mocks/server'

// Start intercepting network requests before the test run.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset any per-test handler overrides so tests stay isolated from each other.
afterEach(() => server.resetHandlers())

// Stop intercepting once everything is done.
afterAll(() => server.close())
