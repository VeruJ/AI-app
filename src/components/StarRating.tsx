export default function StarRating({ rating }: { rating: number }) {
  const percent = (Math.max(0, Math.min(5, rating)) / 5) * 100

  return (
    <span
      className="relative inline-block text-lg leading-none tracking-tight"
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="text-gray-300">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-yellow-500"
        style={{ width: `${percent}%` }}
      >
        ★★★★★
      </span>
    </span>
  )
}
