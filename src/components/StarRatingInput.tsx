'use client'

import { useState } from 'react'

const HALF_STEPS = Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5)

export default function StarRatingInput({
  name,
  defaultValue = 0,
}: {
  name: string
  defaultValue?: number
}) {
  const [rating, setRating] = useState(defaultValue)
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? rating
  const percent = (Math.max(0, Math.min(5, display)) / 5) * 100

  return (
    <div className="inline-flex flex-col gap-1">
      <input type="hidden" name={name} value={rating} />
      <div
        className="relative inline-block text-2xl leading-none"
        onMouseLeave={() => setHover(null)}
      >
        <span className="text-gray-300">★★★★★</span>
        <span
          className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-yellow-500"
          style={{ width: `${percent}%` }}
        >
          ★★★★★
        </span>
        <div className="absolute inset-0 flex">
          {HALF_STEPS.map((value) => (
            <button
              key={value}
              type="button"
              className="h-full w-[10%] cursor-pointer"
              aria-label={`Rate ${value} out of 5`}
              onMouseEnter={() => setHover(value)}
              onClick={() => setRating(value)}
            />
          ))}
        </div>
      </div>
      <span className="text-sm text-gray-500">
        {display > 0 ? `${display} / 5` : 'Not rated'}
      </span>
    </div>
  )
}
