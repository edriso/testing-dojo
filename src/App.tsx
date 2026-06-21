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

const DESKTOP_QUERY = '(min-width: 880px)'
const NAV_PREF_KEY = 'dojo:nav'

// Track whether we're at the desktop/tablet breakpoint where the sidebar can
// live inline, vs. the phone breakpoint where it becomes an overlay drawer.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}

export default function App() {
  const parts = useParts()
  const isDesktop = useIsDesktop()
  const [current, setCurrent] = useState<string>(readHash())

  // Desktop: a persisted collapse preference (open by default).
  // Mobile: a transient overlay drawer that always starts closed.
  const [desktopOpen, setDesktopOpen] = useState(() => {
    const saved = localStorage.getItem(NAV_PREF_KEY)
    return saved == null ? true : saved === 'open'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const navOpen = isDesktop ? desktopOpen : mobileOpen

  const toggleNav = () => {
    if (isDesktop) {
      setDesktopOpen((o) => {
        const next = !o
        localStorage.setItem(NAV_PREF_KEY, next ? 'open' : 'closed')
        return next
      })
    } else {
      setMobileOpen((o) => !o)
    }
  }

  const closeMobileNav = () => setMobileOpen(false)

  // Keep the view in sync with the URL hash so links and the back button work.
  useEffect(() => {
    const onHash = () => {
      setCurrent(readHash())
      setMobileOpen(false)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Let Escape dismiss the mobile drawer, and lock body scroll behind it.
  useEffect(() => {
    if (isDesktop || !mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isDesktop, mobileOpen])

  const lesson = lessons.find((l) => l.id === current)
  const index = lessons.findIndex((l) => l.id === current)
  const prev = index > 0 ? lessons[index - 1] : null
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null

  return (
    <div className={`layout ${navOpen ? 'nav-open' : 'nav-closed'}`}>
      <header className="topbar">
        <button
          className="nav-toggle"
          onClick={toggleNav}
          aria-label={navOpen ? 'Collapse navigation' : 'Open navigation'}
          aria-expanded={navOpen}
          aria-controls="dojo-sidebar"
        >
          <span aria-hidden="true">{navOpen ? '✕' : '☰'}</span>
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
        {!isDesktop && mobileOpen && (
          <div className="nav-backdrop" onClick={closeMobileNav} aria-hidden="true" />
        )}
        <aside
          id="dojo-sidebar"
          className={`sidebar ${navOpen ? 'open' : ''}`}
          inert={!navOpen ? true : undefined}
        >
          <nav className="sidebar-inner">
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
