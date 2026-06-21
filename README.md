# The Testing Dojo

A hands-on app for learning how to test JavaScript and TypeScript. It is built
for someone who has never written a test before and wants to get genuinely good
at it: not just the "how", but the "when", "what", and "why".

Every example in the app is real, runnable code that lives in this repository.
The code snippets you read in the lessons are imported straight from the files
that the test runner actually runs, so what you see is always what is tested.
Nothing is faked for show, and nothing can quietly go out of date.

## What you will learn

The lessons are grouped into four parts.

**1. Mindset**
- Why we test, and the famous debates about TDD and coverage
- What is worth testing and what is a waste of time
- The testing trophy: write tests, not too many, mostly integration

**2. Fundamentals**
- Anatomy of a test: Arrange, Act, Assert
- Assertions and table-driven tests with `it.each`
- Test doubles: mocks, stubs, spies, and fakes

**3. Testing React**
- Testing components the way a user sees them, with React Testing Library
- Simulating real users with user-event
- Async code, waiting, and mocking APIs with MSW
- Testing custom hooks with `renderHook`

**4. Wisdom**
- Test-driven development without the dogma
- The truth about code coverage
- Common pitfalls and anti-patterns
- Your toolkit and where to go next

## The stack

This project uses a current, mainstream testing setup.

| Tool | Role |
| --- | --- |
| Vitest 4 | The test runner. Fast, Vite-native, with a Jest-style API. |
| React Testing Library 16 | Render and query components like a user. |
| @testing-library/jest-dom 6 | Friendly DOM matchers such as `toBeInTheDocument()`. |
| @testing-library/user-event 14 | Realistic clicks, typing, and tabbing. |
| MSW 2 | Mock the network at the network layer. |
| jsdom | The simulated browser the component tests run in. |

## Getting started

```bash
git clone git@github.com:edriso/testing-dojo.git
cd testing-dojo
npm install      # install dependencies
npm run dev      # start the learning app at http://localhost:5173
```

## Running the tests

The whole point of the app is the tests, so go run them.

```bash
npm test         # watch mode: re-runs tests as you save
npm run test:run # run once and exit
npm run test:ui  # open the Vitest UI in the browser
npm run coverage # run once and print a coverage report
```

Try breaking something on purpose. Change a number in `src/lib/cart.ts`, save,
and watch the matching test turn red and tell you exactly what broke. That fast
feedback loop is the feeling you are learning to rely on.

## How the project is organized

The example code is split from the lesson UI so the tested parts are easy to find.

```
src/
  lib/                  Plain, tested logic (the "real cases")
    cart.ts             Money math in cents, with edge cases
    validation.ts       Input validation with boundary values
    useCounter.ts       A custom hook
    users.ts            A fetch-based API client
    *.test.ts           The tests for each of the above
  components/
    examples/           Tested React components
      StarRating.tsx    A component, tested by behaviour not internals
      LoginForm.tsx     A form with validation, async submit, and errors
      *.test.tsx        Their tests
    ...                 The lesson UI (code blocks, callouts, demos)
  mocks/                MSW handlers and the mock server
  test/setup.ts         Test setup: jest-dom matchers and the mock server
  content/lessons.ts    The curriculum, as plain data
```

Open any `.test.ts` or `.test.tsx` file. They are written to be read, with
comments that explain the choices, and they are all green.

## The one-paragraph version

A test exists to buy you confidence: that your code works, and that it keeps
working while you change everything around it. Spend that effort where being
wrong actually hurts, such as money, complex logic, edge cases, and error
handling. Skip the theatre, like a test for every getter or chasing 100%
coverage for its own sake. Test what a user can see, not how the code is wired
inside, so your tests survive a refactor. That is the whole craft, and this app
is a place to practice it.
