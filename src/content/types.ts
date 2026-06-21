import type { DemoKind } from '../components/demoRegistry'

export type CalloutTone = 'tip' | 'warn' | 'key' | 'note' | 'fail'

// A lesson is just an ordered list of content blocks. Authoring lessons stays
// readable because each block is a small, named shape.
export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'code'; code: string; filename?: string; caption?: string }
  | { kind: 'callout'; tone: CalloutTone; title?: string; text: string }
  | { kind: 'quote'; text: string; author: string; source?: string; href?: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'demo'; demo: DemoKind; title?: string }
  | {
      kind: 'compare'
      left: { label: string; code: string }
      right: { label: string; code: string }
    }
  | { kind: 'table'; head: string[]; rows: string[][] }

export type Lesson = {
  id: string
  part: string
  title: string
  tagline: string
  minutes: number
  blocks: Block[]
}
