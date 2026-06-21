import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// A single mock server shared by the whole test run. It is started, reset,
// and stopped from src/test/setup.ts.
export const server = setupServer(...handlers)
