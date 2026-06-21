import type { Lesson } from './types'

// Pull in the ACTUAL source of our tested examples. Because these are the real
// files Vitest runs, the code shown in the lessons can never drift from the
// code that is verified green. "Eat your own dog food."
import cartSrc from '../lib/cart.ts?raw'
import cartTestSrc from '../lib/cart.test.ts?raw'
import validationTestSrc from '../lib/validation.test.ts?raw'
import usersSrc from '../lib/users.ts?raw'
import usersTestSrc from '../lib/users.test.ts?raw'
import useCounterTestSrc from '../lib/useCounter.test.ts?raw'
import starTestSrc from '../components/examples/StarRating.test.tsx?raw'
import loginTestSrc from '../components/examples/LoginForm.test.tsx?raw'
import handlersSrc from '../mocks/handlers.ts?raw'

export const lessons: Lesson[] = [
  // ============================================================ PART I
  {
    id: 'why-test',
    part: 'Mindset',
    title: 'Why we test (and the great debate)',
    tagline: 'Tests buy confidence. The skill is buying it cheaply.',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Before a single line of test code, get the goal straight. A test exists for exactly one reason: to give you **confidence** that your code does what you think it does, and keeps doing it while you change everything around it. That is the whole product. Not coverage, not a green badge, not a ritual.',
      },
      {
        kind: 'quote',
        text: 'Program testing can be used to show the presence of bugs, but never to show their absence!',
        author: 'Edsger W. Dijkstra',
        source: 'Notes on Structured Programming, 1970',
        href: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD249.html',
      },
      {
        kind: 'p',
        text: 'Tests never prove your code is correct. They prove it is not broken in the specific ways you thought to check. That reframing matters: your job is to spend your testing effort where being wrong would hurt, and to skip the theatre everywhere else.',
      },
      {
        kind: 'h',
        text: 'The argument you have probably seen',
      },
      {
        kind: 'p',
        text: 'There is a recurring fight online: one camp says a professional writes a test for every line and chases 100% coverage; the other says most of those tests just assert that the code does what the code does, like holding a mirror up to a mirror. Both camps are half right, and the disagreement is older than you think.',
      },
      {
        kind: 'quote',
        text: 'Test-first fundamentalism is like abstinence-only sex ed: an unrealistic, ineffective morality campaign.',
        author: 'David Heinemeier Hansson (DHH)',
        source: 'TDD is dead. Long live testing. (2014)',
        href: 'https://dhh.dk/2014/tdd-is-dead-long-live-testing.html',
      },
      {
        kind: 'p',
        text: 'That post kicked off a famous series of conversations between Kent Beck (who created TDD), DHH, and Martin Fowler. The surprising consensus: all three valued self-testing code, and all three rejected test-first as a universal commandment. The lesson is not "tests bad" or "tests good" - it is that tests are an investment, and like any investment they can be over- or under-bought.',
      },
      {
        kind: 'callout',
        tone: 'key',
        text: 'A test earns its keep when it would catch a mistake you might actually make, or lets you refactor without fear. If it cannot do either, it is cost without value. You will spend the rest of this dojo learning to tell the difference.',
      },
    ],
  },

  {
    id: 'what-to-test',
    part: 'Mindset',
    title: 'What to test, and what to skip',
    tagline: 'Test what might break. Skip what cannot.',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'The single best heuristic for what to test comes from the inventor of TDD himself.',
      },
      {
        kind: 'quote',
        text: 'I get paid for code that works, not for tests, so my philosophy is to test as little as possible to reach a given level of confidence. If I do not typically make a kind of mistake, I do not test for it.',
        author: 'Kent Beck',
        source: 'How deep are your unit tests? (Stack Overflow, 2008)',
      },
      {
        kind: 'h',
        text: 'Worth testing',
      },
      {
        kind: 'list',
        items: [
          '**Complex or branchy logic** - the more `if`s, the more places a bug can hide.',
          '**Edge and boundary cases** - empty string, `null`, `0`, negative numbers, empty arrays, the first and last valid value.',
          '**Money and anything irreversible** - a rounding bug here costs real cash or real trust.',
          '**Error handling** - the unhappy paths are exactly where untested code rots.',
          '**Bug fixes** - every fixed bug gets a test that reproduces it, so it can never silently return (a regression test).',
        ],
      },
      {
        kind: 'h',
        text: 'Usually not worth a dedicated test',
      },
      {
        kind: 'list',
        items: [
          '**Trivial getters and setters** with no logic - they get exercised for free by the code that uses them.',
          '**The framework or a third-party library** - React and its maintainers already test React. Re-testing it is brittle and finds none of *your* bugs.',
          '**Pure configuration and constants** - there is no behaviour to break.',
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The nuance',
        text: 'The rule is "skip trivial code" - not "skip code forever". The moment any logic creeps into that getter (a computed value, a guard, a default), it stops being trivial and earns a test. Testing every getter and setter on principle is not professionalism; it is wasting time, professionally.',
      },
      {
        kind: 'h',
        text: 'Two classic techniques to find the cases that matter',
      },
      {
        kind: 'list',
        items: [
          '**Equivalence partitioning**: group inputs that behave the same way and test one representative of each group, instead of fifty near-identical inputs.',
          '**Boundary value analysis**: bugs cluster at the edges. For a field valid at 8-64 characters, the interesting tests are 7, 8, 64, and 65 - not "abc" and "abcdef".',
        ],
      },
      {
        kind: 'p',
        text: 'You will see both techniques used in real, runnable code two lessons from now in the matchers and edge-case examples.',
      },
    ],
  },

  {
    id: 'the-trophy',
    part: 'Mindset',
    title: 'The testing trophy',
    tagline: 'Write tests. Not too many. Mostly integration.',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'How many of each kind of test should you write? Two famous shapes answer that question.',
      },
      {
        kind: 'p',
        text: 'The older **testing pyramid** (Mike Cohn, 2009) says: lots of fast unit tests at the base, fewer integration tests, and very few slow end-to-end (E2E) tests at the top. It is still good advice for avoiding a top-heavy suite of slow, flaky UI tests.',
      },
      {
        kind: 'p',
        text: 'The **testing trophy** (Kent C. Dodds, 2019) reshapes that for modern front-end apps. From bottom to top: **Static** (TypeScript and your linter catch a whole class of bugs for free) -> **Unit** -> **Integration** (the biggest section) -> **E2E**. The bulk of your effort goes to integration tests because they hit the sweet spot between confidence and cost.',
      },
      {
        kind: 'quote',
        text: 'Write tests. Not too many. Mostly integration.',
        author: 'Guillermo Rauch',
        source: 'tweet, 2016',
        href: 'https://x.com/rauchg/status/807626710350839808',
      },
      {
        kind: 'callout',
        tone: 'note',
        text: 'This line is often credited to Kent C. Dodds because his article shares the title - but Rauch said it first, riffing on Michael Pollan&rsquo;s "Eat food. Not too much. Mostly plants." Dodds expanded it into the trophy and credits Rauch.',
      },
      {
        kind: 'table',
        head: ['Layer', 'What it checks', 'Speed', 'How many'],
        rows: [
          ['Static', 'Types, lint, typos', 'Instant', 'Free, always on'],
          ['Unit', 'One function/module alone', 'Fastest', 'Many'],
          ['Integration', 'A few pieces working together', 'Medium', '**Most of your effort**'],
          ['E2E', 'The whole app through the real UI', 'Slowest', 'A precious few'],
        ],
      },
      {
        kind: 'p',
        text: 'Why favour integration tests? A unit test of a function in isolation can pass while the app is broken, because the bug lives in how the pieces fit together. An integration test - a component plus its real validation plus a mocked network - resembles how the software is actually used, so when it passes you have earned real confidence.',
      },
      {
        kind: 'quote',
        text: 'The more your tests resemble the way your software is used, the more confidence they can give you.',
        author: 'Kent C. Dodds',
        source: 'the guiding principle of Testing Library',
        href: 'https://testing-library.com/docs/guiding-principles',
      },
    ],
  },

  // ============================================================ PART II
  {
    id: 'anatomy',
    part: 'Fundamentals',
    title: 'Anatomy of a test',
    tagline: 'Arrange, Act, Assert - the three beats of every good test.',
    minutes: 8,
    blocks: [
      {
        kind: 'p',
        text: 'We test with **Vitest**, the test runner built for Vite projects. Its API is the same shape as Jest, so everything you learn here transfers. A test file ends in `.test.ts` (or `.test.tsx`), sits next to the code it checks, and reads almost like English.',
      },
      {
        kind: 'p',
        text: 'Every solid test has the same three beats, known as **Arrange - Act - Assert** (AAA): set up the world, do the one thing you are testing, then check what happened. Keep them in that order and one concept per test.',
      },
      {
        kind: 'code',
        filename: 'aaa.test.ts',
        code: `import { describe, it, expect } from 'vitest'
import { subtotalCents } from './cart'

describe('subtotalCents', () => {
  it('adds up quantity x unit price', () => {
    // Arrange - set up the inputs
    const cart = [{ name: 'Coffee', unitPriceCents: 499, quantity: 2 }]

    // Act - run the one behaviour under test
    const total = subtotalCents(cart)

    // Assert - state what must be true
    expect(total).toBe(998)
  })
})`,
        caption: 'describe() groups related tests; it() (alias: test()) is one case; expect() makes a claim.',
      },
      {
        kind: 'p',
        text: 'Here is real, money-handling code from this very app. Notice it stores money as integer **cents**, never as floating-point dollars - because in JavaScript `0.1 + 0.2` is `0.30000000000000004`. That is not a Vitest quirk; it is how floating point works everywhere, and it is exactly the kind of thing tests should pin down.',
      },
      {
        kind: 'code',
        filename: 'src/lib/cart.ts',
        code: cartSrc,
        caption: 'The code under test. Branchy, money-handling, easy to get subtly wrong - so worth testing.',
      },
      {
        kind: 'code',
        filename: 'src/lib/cart.test.ts',
        code: cartTestSrc,
        caption: 'Its tests. Watch the boundaries (0%, 100%), the empty cart, rounding, and the float gotcha.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Run it yourself',
        text: 'These files are real. Clone the repo, run `npm test`, and Vitest re-runs them on every save. A red test names exactly what broke; a green one is confidence you can spend.',
      },
    ],
  },

  {
    id: 'matchers',
    part: 'Fundamentals',
    title: 'Assertions & table-driven tests',
    tagline: 'Say precisely what must be true - once, for many inputs.',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'An assertion is a claim that fails the test if it is not true. `expect(value)` gives you a matcher to finish the claim. The few you will reach for constantly:',
      },
      {
        kind: 'table',
        head: ['Matcher', 'Passes when'],
        rows: [
          ['`toBe(x)`', 'Strictly equal (===). Use for numbers, strings, booleans.'],
          ['`toEqual(obj)`', 'Deeply equal. Use for objects and arrays.'],
          ['`toThrow(/msg/)`', 'The wrapped function throws (optionally matching a message).'],
          ['`toContain(x)`', 'An array or string contains x.'],
          ['`toBeNull()` / `toBeUndefined()`', 'The value is exactly null / undefined.'],
          ['`.not.xxx`', 'Inverts any matcher: `expect(x).not.toBe(y)`.'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'toBe vs toEqual',
        text: 'A beginner classic: `expect({a:1}).toBe({a:1})` FAILS, because two different objects are never `===`. Use `toEqual` for structural equality and `toBe` for primitives and identity.',
      },
      {
        kind: 'h',
        text: 'One test, many inputs',
      },
      {
        kind: 'p',
        text: 'When you want to check the same rule against a table of inputs (equivalence partitioning and boundary values from the mindset lessons), do not copy-paste a dozen near-identical tests. Use `it.each` - a parametrized, table-driven test. Here is the real validation suite from this app:',
      },
      {
        kind: 'code',
        filename: 'src/lib/validation.test.ts',
        code: validationTestSrc,
        caption: 'Boundary values around the 8 and 64 char limits, plus one representative per equivalence class.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        text: 'Each row in `it.each` becomes its own named, independently-failing test. When the 65-character case breaks, the report tells you precisely that - not just "validatePassword failed somewhere".',
      },
    ],
  },

  {
    id: 'test-doubles',
    part: 'Fundamentals',
    title: 'Test doubles: mocks, stubs, spies & fakes',
    tagline: 'Stand-ins for the parts you do not want to really run.',
    minutes: 8,
    blocks: [
      {
        kind: 'p',
        text: 'Sometimes the code under test depends on something slow, unpredictable, or expensive - a network call, a payment, the clock. A **test double** is a stand-in for that dependency. The umbrella term comes from Gerard Meszaros; Martin Fowler popularised the distinctions. People use these names loosely, but the differences are worth knowing.',
      },
      {
        kind: 'table',
        head: ['Double', 'What it does'],
        rows: [
          ['**Dummy**', 'Fills a parameter slot but is never actually used.'],
          ['**Stub**', 'Returns canned answers. You assert on the resulting state.'],
          ['**Spy**', 'A stub that also records how it was called, so you can check that later.'],
          ['**Mock**', 'Pre-programmed with expectations; it can fail the test itself on an unexpected call.'],
          ['**Fake**', 'A real but simplified implementation, e.g. an in-memory database.'],
        ],
      },
      {
        kind: 'callout',
        tone: 'key',
        text: 'The distinction beginners blur: a **stub** provides state for your code to read; a **mock/spy** is about verifying interactions - that a function was called, and how. In Vitest you create both with `vi.fn()`.',
      },
      {
        kind: 'code',
        filename: 'spy.test.ts',
        code: `import { vi, expect, it } from 'vitest'

it('calls onChange with the chosen value', () => {
  const onChange = vi.fn()          // a spy: it remembers every call

  onChange(4)                       // (your component would do this)

  expect(onChange).toHaveBeenCalledWith(4)
  expect(onChange).toHaveBeenCalledTimes(1)
})

it('stubs a return value', () => {
  const getRate = vi.fn().mockReturnValue(1.5)   // a stub
  expect(getRate()).toBe(1.5)
})`,
        caption: 'vi.fn() gives you a spy and a stub in one. mockResolvedValue / mockRejectedValue handle async.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not over-mock',
        text: 'Every double you add is a piece of the real system you are NOT testing. Mock the awkward edges (network, time, payments) and let the rest run for real. A test suite that is all mocks proves only that your mocks agree with each other.',
      },
      {
        kind: 'p',
        text: 'There is a better way to fake the network than stubbing `fetch` by hand - intercept it at the network layer with MSW. You will do exactly that in the async lesson.',
      },
    ],
  },

  // ============================================================ PART III
  {
    id: 'rtl-intro',
    part: 'Testing React',
    title: 'Testing components like a user',
    tagline: 'Find things by role and label, not by class or state.',
    minutes: 9,
    blocks: [
      {
        kind: 'p',
        text: 'For React we use **React Testing Library** (RTL). Its whole philosophy fits in one sentence you saw earlier: the more your tests resemble how the software is used, the more confidence they give you. So RTL pushes you to find elements the way a person (or a screen reader) would - by their role and visible text - and to assert on what is rendered, never on internal state.',
      },
      {
        kind: 'demo',
        demo: 'starRating',
        title: 'Live: the component we are about to test',
      },
      {
        kind: 'h',
        text: 'Query priority - it is an accessibility ranking',
      },
      {
        kind: 'p',
        text: 'RTL gives you several ways to find an element, in a deliberate order. Prefer the top of this list; the queries near the bottom mean the element is harder for real users to perceive.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          '`getByRole` - a button, heading, checkbox, radio. The best default. `getByRole(&#39;button&#39;, { name: /save/i })`.',
          '`getByLabelText` - form fields, found by their label, exactly as a user reads them.',
          '`getByPlaceholderText`, `getByText`, `getByDisplayValue` - still user-visible.',
          '`getByAltText`, `getByTitle` - semantic but weaker.',
          '`getByTestId` - the last resort, for when nothing user-facing fits.',
        ],
      },
      {
        kind: 'h',
        text: 'getBy vs queryBy vs findBy',
      },
      {
        kind: 'table',
        head: ['Variant', 'If not found', 'Use it to'],
        rows: [
          ['`getBy...`', 'throws immediately', 'assert something IS there now'],
          ['`queryBy...`', 'returns `null`', 'assert something is NOT there'],
          ['`findBy...`', 'waits, then rejects', 'wait for something to appear (async)'],
        ],
      },
      {
        kind: 'code',
        filename: 'src/components/examples/StarRating.test.tsx',
        code: starTestSrc,
        caption: 'We assert on aria-checked - what a user perceives - never on the internal rating state.',
      },
      {
        kind: 'callout',
        tone: 'key',
        title: 'Behaviour, not implementation',
        text: 'Notice the tests never read the component&rsquo;s `rating` variable. If we rewrote the internals tomorrow, these tests would still pass as long as clicking three stars still highlights three stars. That is the definition of testing behaviour, not implementation details - and it is what makes tests survive refactors.',
      },
    ],
  },

  {
    id: 'user-events',
    part: 'Testing React',
    title: 'Simulating real users',
    tagline: 'userEvent types, clicks, and tabs like a human.',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'To interact with a component, use **@testing-library/user-event**. It simulates the full sequence a real browser fires - focus, keydown, input, keyup - rather than a single synthetic event. It is closer to reality than the older `fireEvent`, so prefer it.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The number-one stale-tutorial trap',
        text: 'Since v14, user-event is asynchronous and needs a setup call. Old tutorials call `userEvent.click(...)` with no setup and no await - that pattern is dead. Always `setup()` first, then `await` every interaction.',
      },
      {
        kind: 'compare',
        left: {
          label: 'Outdated (pre-v14)',
          code: `import userEvent from '@testing-library/user-event'

userEvent.click(button)   // no setup, no await`,
        },
        right: {
          label: 'Current (v14+)',
          code: `import userEvent from '@testing-library/user-event'

const user = userEvent.setup()  // before render
await user.click(button)        // always awaited`,
        },
      },
      {
        kind: 'demo',
        demo: 'loginForm',
        title: 'Live: a form with validation, a loading state, and an error path',
      },
      {
        kind: 'p',
        text: 'Below is the test for that exact form. Read how it finds inputs by their label, types into them, clicks submit, and then asserts on what the user sees - a validation error, a call to the submit handler, or a failure message. This is an integration test: real validation logic, real form behaviour, only the network handler is a double.',
      },
      {
        kind: 'code',
        filename: 'src/components/examples/LoginForm.test.tsx',
        code: loginTestSrc,
        caption: 'getByLabelText to find fields, a vi.fn() spy for onSubmit, findByRole to await the async error.',
      },
    ],
  },

  {
    id: 'async-and-apis',
    part: 'Testing React',
    title: 'Async, waiting & APIs',
    tagline: 'Await outcomes. Mock the network at the network.',
    minutes: 9,
    blocks: [
      {
        kind: 'p',
        text: 'Async is where most flaky tests are born. The fix is never an arbitrary `sleep`; it is to wait for a specific outcome. RTL gives you two tools:',
      },
      {
        kind: 'list',
        items: [
          '`findBy...` - waits for an **element** to appear, then returns it. Best for "after this loads, the name shows up".',
          '`waitFor(() => expect(...))` - retries an **assertion** until it stops throwing. Best for non-element conditions, e.g. "the spy was eventually called".',
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The "act(...)" warning',
        text: 'If you see "an update was not wrapped in act(...)", it means a state update happened after your test thought it was done - an un-awaited async update. The fix is almost never a manual `act()`; it is to `await` the right thing (`findBy`, `waitFor`, or an awaited `user.click`). Those already wrap act() for you.',
      },
      {
        kind: 'h',
        text: 'Mock the network with MSW, not by stubbing fetch',
      },
      {
        kind: 'p',
        text: 'To test code that calls an API, do not hand-stub `fetch`. Use **Mock Service Worker (MSW)**: it intercepts requests at the network layer and answers with whatever you define. Your code runs unchanged - it really calls `fetch` - and you test how it parses responses and handles errors against realistic traffic. MSW v2 uses the Fetch-standard `http` and `HttpResponse` API.',
      },
      {
        kind: 'code',
        filename: 'src/mocks/handlers.ts',
        code: handlersSrc,
        caption: 'Default ("happy path") handlers. A test can override any of them to simulate failure.',
      },
      {
        kind: 'code',
        filename: 'src/lib/users.ts',
        code: usersSrc,
        caption: 'Ordinary fetch code. It has no idea it is being tested - which is the point.',
      },
      {
        kind: 'code',
        filename: 'src/lib/users.test.ts',
        code: usersTestSrc,
        caption: 'Success, a 404, and a 500 - the error paths get as much attention as the happy one.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        text: 'See `server.use(...)` in the 500 test? It overrides a handler for that one test only. The `afterEach(() => server.resetHandlers())` in our setup file undoes it automatically, so tests never leak state into each other - the cure for a whole category of flakiness.',
      },
    ],
  },

  {
    id: 'hooks',
    part: 'Testing React',
    title: 'Testing custom hooks',
    tagline: 'renderHook lets you test logic without a throwaway component.',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Custom hooks hold real logic, so they deserve real tests. But you still test them through their public result, never by reaching into React internals. `renderHook` runs a hook in a minimal host component and hands you back its return value.',
      },
      {
        kind: 'demo',
        demo: 'counter',
        title: 'Live: the bounded counter hook',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Import it from the right place',
        text: '`renderHook` now lives in `@testing-library/react`. The old `@testing-library/react-hooks` package is deprecated - importing from it is another common stale-tutorial bug.',
      },
      {
        kind: 'code',
        filename: 'src/lib/useCounter.test.ts',
        code: useCounterTestSrc,
        caption: 'State changes are wrapped in act() so React flushes them before we assert. Note the min/max boundaries.',
      },
      {
        kind: 'p',
        text: 'We test the value the hook exposes (`result.current.count`) and the boundaries it promises (it will not exceed max, will not drop below min). We do not test that it uses `useState` internally - that is an implementation detail the user never sees.',
      },
    ],
  },

  // ============================================================ PART IV
  {
    id: 'tdd',
    part: 'Wisdom',
    title: 'Test-driven development',
    tagline: 'Red, green, refactor - a design tool, not a religion.',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'TDD means writing the test before the code, in a tight loop:',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          '**Red** - write a small failing test that describes the next bit of behaviour you want.',
          '**Green** - write the simplest code that makes it pass. Even something embarrassingly basic.',
          '**Refactor** - now that you are safe, clean up the code (and the test) without changing behaviour.',
        ],
      },
      {
        kind: 'p',
        text: 'Done well, TDD gives you a clean, fast feedback loop and a suite that documents intent. The act of writing the test first also forces you to design a usable API before you commit to an implementation.',
      },
      {
        kind: 'callout',
        tone: 'note',
        title: 'When TDD shines, and when it does not',
        text: 'It shines for well-understood logic you can specify with concrete examples - parsers, calculations, validation. It fights you during exploratory work where you do not yet know what you are building, and when strict isolation pushes you to mock everything. Even Kent Beck says he mocks almost nothing, because over-mocking kills your ability to refactor.',
      },
      {
        kind: 'p',
        text: 'Treat TDD as one tool in the box. Reach for it when the cost of the loop is low and the payoff in design clarity is high. Do not treat "test first, always" as a measure of virtue - the people who invented it do not.',
      },
    ],
  },

  {
    id: 'coverage',
    part: 'Wisdom',
    title: 'The truth about coverage',
    tagline: 'A great map of what you missed. A terrible measure of quality.',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Code coverage measures how much of your code ran during the tests. Vitest reports four kinds:',
      },
      {
        kind: 'table',
        head: ['Type', 'Counts'],
        rows: [
          ['**Statement**', 'Each statement executed at least once.'],
          ['**Line**', 'Each executable line executed at least once.'],
          ['**Branch**', 'Each branch taken - both the true AND the false of every `if`. The strictest.'],
          ['**Function**', 'Each function called at least once.'],
        ],
      },
      {
        kind: 'p',
        text: 'Here is the trap. Coverage tells you a line *ran*. It tells you nothing about whether you *checked the result*. This test gives 100% coverage of a function and proves absolutely nothing:',
      },
      {
        kind: 'code',
        filename: 'useless.test.ts',
        code: `it('covers but verifies nothing', () => {
  applyDiscount(1000, 20)   // 100% coverage of the line...
  // ...and not a single expect(). A bug here passes silently.
})`,
        caption: 'High coverage, zero confidence. The number went up; the quality did not.',
      },
      {
        kind: 'quote',
        text: 'Test coverage is a useful tool for finding untested parts of a codebase. Test coverage is of little use as a numeric statement of how good your tests are.',
        author: 'Martin Fowler',
        source: 'TestCoverage (2012)',
        href: 'https://martinfowler.com/bliki/TestCoverage.html',
      },
      {
        kind: 'callout',
        tone: 'key',
        text: 'Use coverage as a flashlight, not a finish line. Scan the report for important code with no tests - that is gold. But a mandated "100% or the build fails" rule just manufactures low-value tests for the About page and breeds a false sense of safety. Google&rsquo;s own guidance treats 60% as acceptable and warns that chasing 100% creates technical debt.',
      },
      {
        kind: 'p',
        text: 'Run `npm run coverage` in this repo. We deliberately measure only the example library code, because that is the part where being wrong matters - not the lesson UI.',
      },
    ],
  },

  {
    id: 'antipatterns',
    part: 'Wisdom',
    title: 'Pitfalls & anti-patterns',
    tagline: 'The mistakes that make people hate their test suite.',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Most "tests are a waste of time" stories trace back to a handful of avoidable mistakes. Learn to smell these:',
      },
      {
        kind: 'list',
        items: [
          '**Testing implementation details** - asserting on internal state or private methods. The test breaks on every refactor yet misses real bugs.',
          '**Change-detector tests** - tests that just re-state the current output with no judgement, so they break whenever anything changes and catch nothing meaningful.',
          '**Over-mocking** - so many doubles that the test only proves your mocks agree with each other.',
          '**Only the happy path** - no errors, no empty states, no boundaries. The bugs live in exactly the cases you skipped.',
          '**Flaky tests** - pass sometimes, fail sometimes. Usually caused by timing races, shared mutable state, real network, or unseeded randomness. A flaky test is worse than no test, because it trains the team to ignore red.',
          '**Giant snapshot tests** - a 600-line snapshot nobody reads, blindly regenerated whenever it fails. Keep snapshots tiny and review them like code.',
          '**Chasing 100% coverage** as a goal in itself (see the previous lesson).',
          '**Asserting ten unrelated things** in one test - when it fails you cannot tell which claim broke. One concept per test.',
        ],
      },
      {
        kind: 'callout',
        tone: 'fail',
        title: 'The litmus test for a bad test',
        text: 'Ask two questions. If I refactor without changing behaviour, does this test break? (It should not.) If I introduce a real bug, does this test catch it? (It should.) A test that fails the first or the second is costing you more than it returns.',
      },
      {
        kind: 'quote',
        text: 'A test is non-deterministic when it passes sometimes and fails sometimes, without any noticeable change in the code, tests, or environment.',
        author: 'Martin Fowler',
        source: 'Eradicating Non-Determinism in Tests',
        href: 'https://martinfowler.com/articles/nonDeterminism.html',
      },
    ],
  },

  {
    id: 'toolkit',
    part: 'Wisdom',
    title: 'Your toolkit',
    tagline: 'The 2025-26 stack, and where to go next.',
    minutes: 5,
    blocks: [
      {
        kind: 'p',
        text: 'Everything in this dojo runs on a current, mainstream stack. These are the versions installed in this repo:',
      },
      {
        kind: 'table',
        head: ['Tool', 'Role'],
        rows: [
          ['**Vitest 4**', 'The test runner. Fast, Vite-native, Jest-compatible API.'],
          ['**@testing-library/react 16**', 'Render and query components the way users do.'],
          ['**@testing-library/jest-dom 6**', 'DOM matchers like `toBeInTheDocument()`.'],
          ['**@testing-library/user-event 14**', 'Realistic clicks, typing, tabbing (async - remember `setup()`).'],
          ['**MSW 2**', 'Mock the network at the network layer.'],
          ['**jsdom**', 'The simulated browser DOM your component tests run in.'],
          ['**Playwright**', 'For the few real end-to-end tests at the top of the trophy.'],
        ],
      },
      {
        kind: 'h',
        text: 'The whole dojo in seven lines',
      },
      {
        kind: 'list',
        items: [
          'A test buys confidence. Buy it where being wrong hurts; skip the theatre everywhere else.',
          'Write tests. Not too many. Mostly integration.',
          'Test behaviour, not implementation details - so tests survive refactors.',
          'Find elements by role and label, like a user. Assert on what is rendered.',
          'Await outcomes; never sleep. Mock the network at the network with MSW.',
          'Coverage is a flashlight, not a finish line.',
          'If a test cannot catch a real bug or enable a fearless refactor, delete it.',
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Go deeper',
        text: 'Read the [Testing Library docs](https://testing-library.com/), Kent C. Dodds&rsquo; [Testing JavaScript](https://kentcdodds.com/blog), the [Vitest guide](https://vitest.dev/), and [MSW docs](https://mswjs.io/). Then open the `src/` folder of this app and read every `.test.ts` file - they are all real, all green, and all yours to break and fix.',
      },
    ],
  },
]
