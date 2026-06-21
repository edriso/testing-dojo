// A tiny API client. The lesson here: do NOT stub `fetch` by hand. Instead let
// MSW intercept the real network call (see src/mocks/handlers.ts) so you test
// your code's behaviour - parsing, error handling - against realistic traffic.

export type User = { id: string; name: string; email: string }

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`https://api.example.com/users/${id}`)

  if (!res.ok) {
    // The error path is the part most worth testing - it is where real bugs hide.
    throw new Error(`Failed to load user ${id} (status ${res.status})`)
  }

  return (await res.json()) as User
}
