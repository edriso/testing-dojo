import type { Block, CalloutTone } from '../content/types'
import { CodeBlock } from './CodeBlock'
import { Inline } from './Inline'
import { DEMOS } from './demoRegistry'

const CALLOUT_LABEL: Record<CalloutTone, string> = {
  tip: 'Tip',
  warn: 'Watch out',
  key: 'Key idea',
  note: 'Note',
  fail: 'Anti-pattern',
}

function Callout({ tone, title, text }: { tone: CalloutTone; title?: string; text: string }) {
  return (
    <aside className={`callout callout-${tone}`}>
      <div className="callout-label">{title ?? CALLOUT_LABEL[tone]}</div>
      <p>
        <Inline text={text} />
      </p>
    </aside>
  )
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className="prose-p">
          <Inline text={block.text} />
        </p>
      )

    case 'h':
      return <h2 className="prose-h">{block.text}</h2>

    case 'code':
      return (
        <CodeBlock code={block.code} filename={block.filename} caption={block.caption} />
      )

    case 'callout':
      return <Callout tone={block.tone} title={block.title} text={block.text} />

    case 'quote':
      return (
        <blockquote className="quote">
          <p>&ldquo;{block.text}&rdquo;</p>
          <footer>
            <span className="quote-author">{block.author}</span>
            {block.source &&
              (block.href ? (
                <a href={block.href} target="_blank" rel="noreferrer">
                  {block.source}
                </a>
              ) : (
                <span className="quote-source">{block.source}</span>
              ))}
          </footer>
        </blockquote>
      )

    case 'list': {
      const items = block.items.map((it, i) => (
        <li key={i}>
          <Inline text={it} />
        </li>
      ))
      return block.ordered ? (
        <ol className="prose-list">{items}</ol>
      ) : (
        <ul className="prose-list">{items}</ul>
      )
    }

    case 'demo': {
      const Demo = DEMOS[block.demo]
      return (
        <div className="demo-wrap">
          {block.title && <div className="demo-title">{block.title}</div>}
          <Demo />
        </div>
      )
    }

    case 'compare':
      return (
        <div className="compare">
          <div className="compare-col compare-bad">
            <div className="compare-label">{block.left.label}</div>
            <CodeBlock code={block.left.code} filename="" />
          </div>
          <div className="compare-col compare-good">
            <div className="compare-label">{block.right.label}</div>
            <CodeBlock code={block.right.code} filename="" />
          </div>
        </div>
      )

    case 'table':
      return (
        <div className="table-wrap">
          <table className="prose-table">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}
