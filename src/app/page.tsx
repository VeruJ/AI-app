import Link from 'next/link'
import { listBooks } from '@/lib/data'
import StarRating from '@/components/StarRating'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string; minRating?: string }>
}) {
  const { q = '', genre = '', minRating = '' } = await searchParams
  const books = await listBooks()

  const allGenres = [...new Set(books.flatMap((b) => b.genres))].sort()

  const query = q.trim().toLowerCase()
  const filtered = books.filter((book) => {
    const matchesQuery =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    const matchesGenre = !genre || book.genres.includes(genre)
    const matchesRating = !minRating || book.rating >= Number(minRating)
    return matchesQuery && matchesGenre && matchesRating
  })

  const byYear = new Map<number, typeof filtered>()
  for (const book of filtered) {
    const list = byYear.get(book.yearRead) ?? []
    list.push(book)
    byYear.set(book.yearRead, list)
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)

  const isFiltering = Boolean(q || genre || minRating)

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Between the Lines</h1>
        <Link
          href="/books/new"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          + Add book
        </Link>
      </div>

      {books.length === 0 && (
        <p className="text-gray-500">No books yet — add the first one you&apos;ve read.</p>
      )}

      {books.length > 0 && (
        <form method="GET" className="mb-6 flex flex-wrap gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title or author"
            className="min-w-[10rem] flex-1 rounded border border-gray-300 p-2"
          />
          <select
            name="genre"
            defaultValue={genre}
            className="rounded border border-gray-300 p-2"
          >
            <option value="">All genres</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            name="minRating"
            defaultValue={minRating}
            className="rounded border border-gray-300 p-2"
          >
            <option value="">Any rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}+ stars
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Filter
          </button>
          {isFiltering && (
            <Link
              href="/"
              className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Clear
            </Link>
          )}
        </form>
      )}

      {books.length > 0 && filtered.length === 0 && (
        <p className="text-gray-500">No books match those filters.</p>
      )}

      {years.map((year) => (
        <section key={year} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-700">{year}</h2>
          <ul className="space-y-2">
            {byYear.get(year)!.map((book) => (
              <li key={book.id}>
                <Link
                  href={`/books/${book.id}`}
                  className="flex items-center justify-between rounded border border-gray-200 bg-white p-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {book.rating > 0 ? `${book.rating} / 5` : 'Not rated'}
                    </span>
                    <StarRating rating={book.rating} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
