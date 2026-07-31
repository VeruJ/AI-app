import Link from 'next/link'
import { listBooks, type Book } from '@/lib/data'
import { yearOf } from '@/lib/dates'
import HorizontalBars from '@/components/HorizontalBars'

export const dynamic = 'force-dynamic'

// Sequential: one hue for plain magnitude comparisons (genres).
// Matches the amber-800 theme accent used elsewhere in the app.
const SEQUENTIAL_HUE = '#92400e'

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

  const readBooks = books.filter((b) => b.status === 'read')
  const booksRead = readBooks.length
  const totalPagesRead = readBooks.reduce((sum, b) => sum + (b.totalPages ?? 0), 0)

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
      <Link href="/" className="text-sm text-amber-800 hover:underline">
        ← Back to your books
      </Link>
      <h1 className="font-heading mb-6 mt-4 text-2xl font-bold">Stats</h1>

      {books.length === 0 ? (
        <p className="text-stone-500">No books yet — add some to see stats.</p>
      ) : (
        <>
          <section className="mb-6 flex gap-6">
            <div>
              <p className="text-sm text-stone-500">Books tracked</p>
              <p className="text-3xl font-semibold">{books.length}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Books read</p>
              <p className="text-3xl font-semibold">{booksRead}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Total pages</p>
              <p className="text-3xl font-semibold">{totalPagesRead.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Average rating</p>
              <p className="text-3xl font-semibold">{avgRating.toFixed(1)} / 5</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="font-heading mb-2 text-lg font-semibold">Books per year</h2>
            {years.length === 0 ? (
              <p className="text-stone-500">No books with a year read yet.</p>
            ) : (
              <div className="space-y-4">
                {years.map((year) => {
                  const yearBooks = byYear.get(year)!
                  const totalPages = yearBooks.reduce((sum, b) => sum + (b.totalPages ?? 0), 0)
                  return (
                    <div key={year}>
                      <p className="mb-2 text-sm font-medium text-stone-600">
                        {year} · {yearBooks.length} book{yearBooks.length === 1 ? '' : 's'}
                        {totalPages > 0 ? ` · ${totalPages.toLocaleString()} pages` : ''}
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
                                className="h-24 w-16 rounded border border-stone-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-24 w-16 items-center justify-center rounded border border-stone-200 bg-stone-100 p-1 text-center text-[10px] text-stone-500">
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
            <h2 className="font-heading mb-2 text-lg font-semibold">Genres</h2>
            {genres.length === 0 ? (
              <p className="text-stone-500">No genre tags yet.</p>
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
