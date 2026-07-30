export function ratingToPercent(rating: number): number {
  return (Math.max(0, Math.min(5, rating)) / 5) * 100
}
