import { describe, it, expect } from 'vitest'
import { ratingToPercent } from '@/lib/rating'

describe('ratingToPercent', () => {
  it('converts a mid-range rating to the matching fill percentage', () => {
    expect(ratingToPercent(3)).toBe(60)
  })

  it('clamps a negative rating to 0%', () => {
    expect(ratingToPercent(-1)).toBe(0)
  })

  it('clamps a rating above 5 to 100%', () => {
    expect(ratingToPercent(10)).toBe(100)
  })
})
