import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { fetchUser } from './users'

describe('fetchUser', () => {
  it('returns the parsed user on success', async () => {
    // The default handler in src/mocks/handlers.ts answers this happily.
    const user = await fetchUser('1')
    expect(user).toEqual({
      id: '1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    })
  })

  it('throws a helpful error on a 404', async () => {
    // Our default handler returns 404 for the special id "404".
    await expect(fetchUser('404')).rejects.toThrow(/status 404/)
  })

  it('throws when the server is having a bad day (500)', async () => {
    // Override the handler JUST for this test to simulate a server error.
    // afterEach(server.resetHandlers) in setup.ts undoes it automatically.
    server.use(
      http.get('https://api.example.com/users/:id', () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    )
    await expect(fetchUser('1')).rejects.toThrow(/status 500/)
  })
})
