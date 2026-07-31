import Link from 'next/link'
import { listBooks, FORMAT_LABELS, type BookFormat } from '@/lib/data'
import { yearOf } from '@/lib/dates'
import BookListItem from '@/components/BookListItem'

export const dynamic = 'force-dynamic'

const UNSCHEDULED = 'unscheduled' as const

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function tabHref(params: { q: string; genres: string[]; format: string }, tab: string) {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  for (const g of params.genres) query.append('genres', g)
  if (params.format) query.set('format', params.format)
  query.set('tab', tab)
  return `/?${query.toString()}`
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genres?: string | string[]; format?: string; tab?: string }>
}) {
  const { q = '', genres: genresParam, format = '', tab = 'library' } = await searchParams
  const selectedGenres = toArray(genresParam)
  const isTbrTab = tab === 'tbr'
  const params = { q, genres: selectedGenres, format }
  const books = await listBooks()

  const allGenres = [...new Set(books.flatMap((b) => b.genres))].sort()

  const query = q.trim().toLowerCase()
  const filtered = books.filter((book) => {
    const matchesQuery =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    const matchesGenres = selectedGenres.every((g) => book.genres.includes(g))
    const matchesFormat = !format || book.format === format
    return matchesQuery && matchesGenres && matchesFormat
  })

  const toBeRead = filtered.filter((b) => b.status === 'tbr' && !b.finishedAt)
  const libraryBooks = filtered.filter((b) => !(b.status === 'tbr' && !b.finishedAt))
  const currentReads = libraryBooks.filter((b) => b.status === 'reading' && !b.finishedAt)
  const rest = libraryBooks.filter((b) => !(b.status === 'reading' && !b.finishedAt))

  const byYear = new Map<number | typeof UNSCHEDULED, typeof rest>()
  for (const book of rest) {
    const key = book.yearRead ?? yearOf(book.finishedAt) ?? yearOf(book.startedAt) ?? UNSCHEDULED
    const list = byYear.get(key) ?? []
    list.push(book)
    byYear.set(key, list)
  }
  const years = [...byYear.keys()].sort((a, b) => {
    if (a === UNSCHEDULED) return -1
    if (b === UNSCHEDULED) return 1
    return b - a
  })

  const isFiltering = Boolean(q || selectedGenres.length || format)
  const tabIsEmpty = isTbrTab ? toBeRead.length === 0 : currentReads.length === 0 && years.length === 0

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Between the Lines</h1>
        <div className="flex gap-2">
          <Link
            href="/stats"
            className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Stats
          </Link>
          <Link
            href="/books/new"
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            + Add book
          </Link>
        </div>
      </div>

      {books.length === 0 && (
        <p className="text-gray-500">No books yet — add the first one you&apos;ve read.</p>
      )}

      {books.length > 0 && (
        <div className="mb-4 flex gap-4 border-b border-gray-200">
          <Link
            href={tabHref(params, 'library')}
            className={`-mb-px border-b-2 px-1 py-2 text-sm font-medium ${
              isTbrTab
                ? 'border-transparent text-gray-500 hover:text-gray-700'
                : 'border-indigo-600 text-indigo-600'
            }`}
          >
            Library
          </Link>
          <Link
            href={tabHref(params, 'tbr')}
            className={`-mb-px border-b-2 px-1 py-2 text-sm font-medium ${
              isTbrTab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            To Be Read
          </Link>
        </div>
      )}

      {books.length > 0 && (
        <form method="GET" className="mb-6 flex flex-col gap-3">
          <input type="hidden" name="tab" value={tab} />
          <div className="flex flex-wrap gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search title or author"
              className="min-w-[10rem] flex-1 rounded border border-gray-300 p-2"
            />
            <select
              name="format"
              defaultValue={format}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">All types</option>
              {(Object.keys(FORMAT_LABELS) as BookFormat[]).map((f) => (
                <option key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </option>
              ))}
            </select>
            {allGenres.length > 0 && (
              <details className="relative rounded border border-gray-300">
                <summary className="cursor-pointer list-none px-4 py-2 text-sm text-gray-700">
                  Genres{selectedGenres.length > 0 ? ` (${selectedGenres.length})` : ''}
                </summary>
                <div className="absolute z-10 mt-1 flex flex-col gap-1 rounded border border-gray-300 bg-white p-3 shadow-lg">
                  {allGenres.map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        name="genres"
                        value={g}
                        defaultChecked={selectedGenres.includes(g)}
                        className="rounded border-gray-300"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </details>
            )}
            <button
              type="submit"
              className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Filter
            </button>
            {isFiltering && (
              <Link
                href={tabHref({ q: '', genres: [], format: '' }, tab)}
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      )}

      {books.length > 0 && tabIsEmpty && (
        <p className="text-gray-500">
          {isFiltering
            ? 'No books match those filters.'
            : isTbrTab
              ? 'Nothing on your to-be-read pile yet.'
              : 'No books in your library yet.'}
        </p>
      )}

      {isTbrTab && toBeRead.length > 0 && (
        <ul className="space-y-2">
          {toBeRead.map((book) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </ul>
      )}

      {!isTbrTab && currentReads.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-700">Current Reads</h2>
          <ul className="space-y-2">
            {currentReads.map((book) => (
              <BookListItem key={book.id} book={book} />
            ))}
          </ul>
        </section>
      )}

      {!isTbrTab &&
        years.map((year) => (
          <section key={year} className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-700">
              {year === UNSCHEDULED ? 'Unscheduled' : year}
            </h2>
            <ul className="space-y-2">
              {byYear.get(year)!.map((book) => (
                <BookListItem key={book.id} book={book} />
              ))}
            </ul>
          </section>
        ))}
    </main>
  )
}
