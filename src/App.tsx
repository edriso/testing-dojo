import { useEffect, useMemo, useState } from 'react'
import { lessons } from './content/lessons'
import { BlockView } from './components/Blocks'
import './App.css'

// Group lessons by their "part" while preserving order, for the sidebar.
function useParts() {
  return useMemo(() => {
    const parts: { name: string; lessons: typeof lessons }[] = []
    for (const lesson of lessons) {
      let group = parts.find((p) => p.name === lesson.part)
      if (!group) {
        group = { name: lesson.part, lessons: [] }
        parts.push(group)
      }
      group.lessons.push(lesson)
    }
    return parts
  }, [])
}

function readHash() {
  return window.location.hash.replace(/^#\/?/, '')
}

export default function App() {
  const parts = useParts()
  const [current, setCurrent] = useState<string>(readHash())
  const [navOpen, setNavOpen] = useState(false)

  // Keep the view in sync with the URL hash so links and the back button work.
  useEffect(() => {
    const onHash = () => {
      setCurrent(readHash())
      setNavOpen(false)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const lesson = lessons.find((l) => l.id === current)
  const index = lessons.findIndex((l) => l.id === current)
  const prev = index > 0 ? lessons[index - 1] : null
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null

  return (
    <div className="layout">
      <header className="topbar">
        <button
          className="nav-toggle"
          onClick={() => setNavOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <a className="brand" href="#/">
          <span className="brand-mark">和</span>
          <span className="brand-text">
            The Testing Dojo
            <small>master JS / TS testing</small>
          </span>
        </a>
        <a className="topbar-repo" href="https://vitest.dev" target="_blank" rel="noreferrer">
          38 tests, all green
        </a>
      </header>

      <div className="body">
        <aside className={`sidebar ${navOpen ? 'open' : ''}`}>
          <nav>
            <a href="#/" className={`nav-home ${!lesson ? 'active' : ''}`}>
              Welcome
            </a>
            {parts.map((part, pi) => (
              <div className="nav-group" key={part.name}>
                <div className="nav-group-title">
                  <span className="nav-group-num">{String(pi + 1).padStart(2, '0')}</span>
                  {part.name}
                </div>
                {part.lessons.map((l) => (
                  <a
                    key={l.id}
                    href={`#/${l.id}`}
                    className={`nav-link ${l.id === current ? 'active' : ''}`}
                  >
                    {l.title}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="content">
          {lesson ? (
            <article className="lesson">
              <div className="lesson-eyebrow">
                <span className="lesson-part">{lesson.part}</span>
                <span className="lesson-minutes">{lesson.minutes} min read</span>
              </div>
              <h1 className="lesson-title">{lesson.title}</h1>
              <p className="lesson-tagline">{lesson.tagline}</p>
              <hr className="lesson-rule" />
              {lesson.blocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}

              <nav className="lesson-nav">
                {prev ? (
                  <a href={`#/${prev.id}`} className="lesson-nav-btn">
                    <span>Previous</span>
                    {prev.title}
                  </a>
                ) : (
                  <span />
                )}
                {next ? (
                  <a href={`#/${next.id}`} className="lesson-nav-btn align-right">
                    <span>Next</span>
                    {next.title}
                  </a>
                ) : (
                  <span />
                )}
              </nav>
            </article>
          ) : (
            <Welcome onStart={() => (window.location.hash = `#/${lessons[0].id}`)} />
          )}
        </main>
      </div>
    </div>
  )
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="welcome">
      <span className="welcome-kicker">
        A hands-on dojo for testing JavaScript &amp; TypeScript
      </span>
      <h1 className="welcome-title">Learn to test code the way it is actually used.</h1>
      <p className="welcome-lede">
        Not 100% coverage for its own sake. Not a test for every getter. Just the
        skill that matters: writing the tests that catch real bugs and let you change
        code without fear - and knowing which tests to skip.
      </p>
      <p className="welcome-lede">
        Every example in this dojo is real, runnable code that lives in this
        repository, verified by a suite of <strong>38 passing tests</strong>. The
        snippets you read are imported straight from the files Vitest runs, so nothing
        you see here can quietly rot.
      </p>
      <button className="welcome-cta" onClick={onStart}>
        Enter the dojo &rarr;
      </button>

      <div className="welcome-grid">
        <div className="welcome-card">
          <h3>Why &amp; when</h3>
          <p>
            The mindset first: what is worth testing, what is theatre, and the famous
            debates settled.
          </p>
        </div>
        <div className="welcome-card">
          <h3>How, with real cases</h3>
          <p>
            Money math, forms, async APIs, custom hooks - tested with Vitest, Testing
            Library, and MSW.
          </p>
        </div>
        <div className="welcome-card">
          <h3>Run it locally</h3>
          <p>
            Clone, <code>npm install</code>, <code>npm test</code>. Break a test on
            purpose and watch it go red.
          </p>
        </div>
      </div>
    </div>
  )
}
