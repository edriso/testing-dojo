import { http, HttpResponse } from 'msw'

// MSW v2 intercepts requests at the network layer using the Fetch standard
// `http` + `HttpResponse` API. These are the default ("happy path") handlers.
// Individual tests can override a handler with `server.use(...)` to simulate
// errors, slow responses, or empty results.
export const handlers = [
  http.get('https://api.example.com/users/:id', ({ params }) => {
    const { id } = params
    if (id === '404') {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json({ id, name: 'Ada Lovelace', email: 'ada@example.com' })
  }),
]
