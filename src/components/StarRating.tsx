import { ratingToPercent } from '@/lib/rating'

export default function StarRating({ rating }: { rating: number }) {
  const percent = ratingToPercent(rating)

  return (
    <span
      className="relative inline-block text-lg leading-none tracking-tight"
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="text-stone-300">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-yellow-500"
        style={{ width: `${percent}%` }}
      >
        ★★★★★
      </span>
    </span>
  )
}
