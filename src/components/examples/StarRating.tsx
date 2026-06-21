import { useState } from 'react'

type StarRatingProps = {
  max?: number
  defaultValue?: number
  onChange?: (value: number) => void
}

// A controlled-ish star rating. We test it the way a user meets it: through
// roles and labels and the rendered result - never by reading `rating` state.
export function StarRating({ max = 5, defaultValue = 0, onChange }: StarRatingProps) {
  const [rating, setRating] = useState(defaultValue)

  return (
    <div role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1
        const selected = value <= rating
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
            onClick={() => {
              setRating(value)
              onChange?.(value)
            }}
          >
            {selected ? '★' : '☆'}
          </button>
        )
      })}
    </div>
  )
}
