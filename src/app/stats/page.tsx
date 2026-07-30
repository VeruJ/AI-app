import Link from 'next/link'
import { listBooks, type Book } from '@/lib/data'
import { yearOf } from '@/lib/dates'
import HorizontalBars from '@/components/HorizontalBars'

export const dynamic = 'force-dynamic'

// Sequential: one hue for plain magnitude comparisons (genres).
const SEQUENTIAL_HUE = '#2a78d6'

const TOP_GENRES_LIMIT = 5

export default async function StatsPage() {
  const books = await listBooks()

  const byYear = new Map<number, Book[]>()
  for (const book of books) {
    const year = book.yearRead ?? yearOf(book.finishedAt) ?? yearOf(book.startedAt)
    if (year === undefined) continue
    const list = byYear.get(year) ?? []
    list.push(book)
    byYear.set(year, list)
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)

  const booksRead = books.filter((b) => b.status === 'read').length

  const avgRating = books.length
    ? books.reduce((sum, b) => sum + b.rating, 0) / books.length
    : 0

  const genreCounts = new Map<string, number>()
  for (const book of books) {
    for (const genre of book.genres) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1)
    }
  }
  const genres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, TOP_GENRES_LIMIT)

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
              <p className="text-sm text-gray-500">Books read</p>
              <p className="text-3xl font-semibold">{booksRead}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average rating</p>
              <p className="text-3xl font-semibold">{avgRating.toFixed(1)} / 5</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Books per year</h2>
            {years.length === 0 ? (
              <p className="text-gray-500">No books with a year read yet.</p>
            ) : (
              <div className="space-y-4">
                {years.map((year) => {
                  const yearBooks = byYear.get(year)!
                  return (
                    <div key={year}>
                      <p className="mb-2 text-sm font-medium text-gray-600">
                        {year} · {yearBooks.length} book{yearBooks.length === 1 ? '' : 's'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {yearBooks.map((book) => (
                          <Link
                            key={book.id}
                            href={`/books/${book.id}`}
                            title={`${book.title || 'Untitled'} — ${book.author || 'Unknown author'}`}
                          >
                            {book.coverImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={`/api/uploads/${book.coverImage}`}
                                alt={`Cover of ${book.title || 'book'}`}
                                className="h-24 w-16 rounded border border-gray-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-24 w-16 items-center justify-center rounded border border-gray-200 bg-gray-100 p-1 text-center text-[10px] text-gray-500">
                                {book.title || 'Untitled'}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
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
