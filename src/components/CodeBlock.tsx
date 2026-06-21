import { useState } from 'react'
import { tokenize, type TokenType } from './highlight'

const CLASS_FOR: Record<TokenType, string> = {
  comment: 'tok-comment',
  string: 'tok-string',
  number: 'tok-number',
  keyword: 'tok-keyword',
  fn: 'tok-fn',
  punct: 'tok-punct',
  plain: 'tok-plain',
}

type CodeBlockProps = {
  code: string
  filename?: string
  /** A small caption shown under the block, e.g. what to notice. */
  caption?: string
}

export function CodeBlock({ code, filename, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const trimmed = code.replace(/\n+$/, '')
  const tokens = tokenize(trimmed)

  async function copy() {
    await navigator.clipboard.writeText(trimmed)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <figure className="codeblock">
      <div className="codeblock-bar">
        <span className="codeblock-name">{filename ?? 'snippet.ts'}</span>
        <button className="codeblock-copy" onClick={copy} type="button">
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre>
        <code>
          {tokens.map((t, i) => (
            <span key={i} className={CLASS_FOR[t.type]}>
              {t.value}
            </span>
          ))}
        </code>
      </pre>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
