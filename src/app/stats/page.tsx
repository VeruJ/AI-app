import Link from 'next/link'
import { listBooks, STATUS_LABELS, type BookStatus } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const books = await listBooks()

  const byYear = new Map<number, number>()
  for (const book of books) {
    if (book.yearRead === undefined) continue
    byYear.set(book.yearRead, (byYear.get(book.yearRead) ?? 0) + 1)
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)

  const byStatus = new Map<BookStatus, number>()
  for (const book of books) {
    byStatus.set(book.status, (byStatus.get(book.status) ?? 0) + 1)
  }

  const avgRating = books.length
    ? books.reduce((sum, b) => sum + b.rating, 0) / books.length
    : 0

  const genreCounts = new Map<string, number>()
  for (const book of books) {
    for (const genre of book.genres) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1)
    }
  }
  const genres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1])

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Back to your books
      </Link>
      <h1 className="mb-6 mt-4 text-2xl font-bold">Stats</h1>

      {books.length === 0 ? (
        <p className="text-gray-500">No books yet — add some to see stats.</p>
      ) : (
        <>
          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Overview</h2>
            <p className="text-gray-700">
              {books.length} book{books.length === 1 ? '' : 's'} tracked · average
              rating {avgRating.toFixed(1)} / 5
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">By status</h2>
            <ul className="space-y-1">
              {(Object.keys(STATUS_LABELS) as BookStatus[]).map((status) => (
                <li key={status} className="flex items-center justify-between">
                  <span>{STATUS_LABELS[status]}</span>
                  <span className="text-gray-500">{byStatus.get(status) ?? 0}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Books per year</h2>
            <ul className="space-y-1">
              {years.map((year) => (
                <li key={year} className="flex items-center justify-between">
                  <span>{year}</span>
                  <span className="text-gray-500">
                    {byYear.get(year)} book{byYear.get(year) === 1 ? '' : 's'}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">Genres</h2>
            {genres.length === 0 ? (
              <p className="text-gray-500">No genre tags yet.</p>
            ) : (
              <ul className="space-y-1">
                {genres.map(([genre, count]) => (
                  <li key={genre} className="flex items-center justify-between">
                    <span>{genre}</span>
                    <span className="text-gray-500">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  )
}
