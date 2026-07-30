import Link from 'next/link'
import { listBooks } from '@/lib/data'
import StarRating from '@/components/StarRating'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const books = await listBooks()

  const byYear = new Map<number, typeof books>()
  for (const book of books) {
    const list = byYear.get(book.yearRead) ?? []
    list.push(book)
    byYear.set(book.yearRead, list)
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)

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
                  <div className="flex items-center gap-3">
                    {book.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/uploads/${book.coverImage}`}
                        alt={`Cover of ${book.title}`}
                        className="h-12 w-auto rounded border border-gray-200"
                      />
                    )}
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                  </div>
                  <StarRating rating={book.rating} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
