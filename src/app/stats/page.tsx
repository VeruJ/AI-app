import Link from 'next/link'
import { listBooks, STATUS_LABELS, type BookStatus } from '@/lib/data'
import HorizontalBars from '@/components/HorizontalBars'

export const dynamic = 'force-dynamic'

// Fixed categorical order (tbr, reading, read) — never reassigned by count or filter.
const STATUS_COLORS: Record<BookStatus, string> = {
  tbr: '#2a78d6',
  reading: '#eb6834',
  read: '#1baf7a',
}

// Sequential: one hue for plain magnitude comparisons (years, genres).
const SEQUENTIAL_HUE = '#2a78d6'

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
          <section className="mb-6 flex gap-6">
            <div>
              <p className="text-sm text-gray-500">Books tracked</p>
              <p className="text-3xl font-semibold">{books.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average rating</p>
              <p className="text-3xl font-semibold">{avgRating.toFixed(1)} / 5</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">By status</h2>
            <HorizontalBars
              items={(Object.keys(STATUS_LABELS) as BookStatus[]).map((status) => ({
                label: STATUS_LABELS[status],
                value: byStatus.get(status) ?? 0,
                color: STATUS_COLORS[status],
              }))}
            />
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Books per year</h2>
            {years.length === 0 ? (
              <p className="text-gray-500">No books with a year read yet.</p>
            ) : (
              <HorizontalBars
                items={years.map((year) => ({
                  label: String(year),
                  value: byYear.get(year) ?? 0,
                  color: SEQUENTIAL_HUE,
                }))}
              />
            )}
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">Genres</h2>
            {genres.length === 0 ? (
              <p className="text-gray-500">No genre tags yet.</p>
            ) : (
              <HorizontalBars
                items={genres.map(([genre, count]) => ({
                  label: genre,
                  value: count,
                  color: SEQUENTIAL_HUE,
                }))}
              />
            )}
          </section>
        </>
      )}
    </main>
  )
}
