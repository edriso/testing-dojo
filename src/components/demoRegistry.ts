import { CounterDemo, StarRatingDemo, LoginFormDemo } from './Demos'

// Maps a demo name (used in lesson content) to the component that renders it.
// Kept in its own module so Demos.tsx can export only components, which keeps
// React Fast Refresh happy.
export const DEMOS = {
  counter: CounterDemo,
  starRating: StarRatingDemo,
  loginForm: LoginFormDemo,
} as const

export type DemoKind = keyof typeof DEMOS
