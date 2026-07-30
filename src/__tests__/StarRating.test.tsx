import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StarRating from '@/components/StarRating'

describe('StarRating', () => {
  it('exposes the rating to screen readers via aria-label', () => {
    render(<StarRating rating={4.5} />)
    expect(screen.getByLabelText('4.5 out of 5 stars')).toBeInTheDocument()
  })
})
