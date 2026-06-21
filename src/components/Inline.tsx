import { Fragment, type ReactNode } from 'react'

// A minimal inline formatter for lesson prose. It understands:
//   `code`   -> <code>
//   **bold** -> <strong>
//   [text](url) -> <a>
// Anything else is plain text. Kept deliberately small and readable.
const PATTERN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g

export function Inline({ text }: { text: string }): ReactNode {
  const parts = text.split(PATTERN)
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i}>{part.slice(1, -1)}</code>
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          return (
            <a key={i} href={link[2]} target="_blank" rel="noreferrer">
              {link[1]}
            </a>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
