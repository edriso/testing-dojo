// A tiny, dependency-free syntax highlighter for JS/TS snippets.
// It tokenizes source into typed pieces; CodeBlock renders each piece as a
// <span>. Returning tokens (not HTML strings) keeps everything XSS-safe -
// React escapes the text for us, so we never touch dangerouslySetInnerHTML.

export type TokenType =
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'fn'
  | 'punct'
  | 'plain'

export type Token = { type: TokenType; value: string }

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'await', 'async', 'import', 'export', 'from', 'default', 'new', 'type',
  'interface', 'extends', 'implements', 'class', 'try', 'catch', 'finally',
  'throw', 'typeof', 'instanceof', 'in', 'of', 'this', 'true', 'false', 'null',
  'undefined', 'void', 'as', 'declare', 'readonly', 'public', 'private',
])

// Tokens we know about, tried in order. Anything unmatched advances one char
// as 'plain' so the tokenizer can never get stuck.
const RULES: Array<{ type: TokenType; re: RegExp }> = [
  { type: 'comment', re: /^\/\/[^\n]*/ },
  { type: 'comment', re: /^\/\*[\s\S]*?\*\// },
  { type: 'string', re: /^`(?:\\.|[^`\\])*`/ },
  { type: 'string', re: /^"(?:\\.|[^"\\])*"/ },
  { type: 'string', re: /^'(?:\\.|[^'\\])*'/ },
  { type: 'number', re: /^\b\d[\d_.]*\b/ },
  // An identifier immediately followed by "(" is highlighted as a function call.
  { type: 'fn', re: /^[A-Za-z_$][\w$]*(?=\s*\()/ },
  { type: 'plain', re: /^[A-Za-z_$][\w$]*/ }, // resolved to keyword below
  { type: 'punct', re: /^[{}()[\].,;:=+\-*/%<>!&|?]+/ },
]

export function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let rest = code

  while (rest.length > 0) {
    // Preserve whitespace runs verbatim.
    const ws = rest.match(/^\s+/)
    if (ws) {
      tokens.push({ type: 'plain', value: ws[0] })
      rest = rest.slice(ws[0].length)
      continue
    }

    let matched = false
    for (const rule of RULES) {
      const m = rest.match(rule.re)
      if (!m) continue
      const value = m[0]
      const type =
        rule.type === 'plain' && KEYWORDS.has(value) ? 'keyword' : rule.type
      tokens.push({ type, value })
      rest = rest.slice(value.length)
      matched = true
      break
    }

    if (!matched) {
      tokens.push({ type: 'plain', value: rest[0] })
      rest = rest.slice(1)
    }
  }

  return tokens
}
