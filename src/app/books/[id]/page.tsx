import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBook } from '@/lib/data'
import { removeBook } from '@/app/actions'
import StarRating from '@/components/StarRating'
import DeleteBookButton from '@/components/DeleteBookButton'

export const dynamic = 'force-dynamic'

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = await getBook(Number(id))
  if (!book) notFound()

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Back to your books
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {book.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/uploads/${book.coverImage}`}
              alt={`Cover of ${book.title}`}
              className="h-24 w-auto rounded border border-gray-200"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-gray-500">
              {book.author} · {book.yearRead}
            </p>
          </div>
        </div>
        <StarRating rating={book.rating} />
      </div>

      {book.genres.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {book.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {genre}
            </span>
          ))}
        </div>
      )}

      {(book.startedAt || book.finishedAt || book.pagesRead || book.totalPages) && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Reading progress</h2>
          {(book.startedAt || book.finishedAt) && (
            <p className="text-gray-700">
              {book.startedAt ? `Started ${book.startedAt}` : 'Start date not set'}
              {book.finishedAt ? ` · Finished ${book.finishedAt}` : ''}
            </p>
          )}
          {(book.pagesRead || book.totalPages) && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {book.pagesRead ?? 0} / {book.totalPages ?? '?'} pages
              </p>
              {book.totalPages ? (
                <div className="mt-1 h-2 w-full rounded bg-gray-100">
                  <div
                    className="h-2 rounded bg-indigo-600"
                    style={{
                      width: `${Math.min(100, ((book.pagesRead ?? 0) / book.totalPages) * 100)}%`,
                    }}
                  />
                </div>
              ) : null}
            </div>
          )}
        </section>
      )}

      {book.thoughts && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">My thoughts</h2>
          <p className="whitespace-pre-wrap text-gray-700">{book.thoughts}</p>
        </section>
      )}

      {book.quotes.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Quotes</h2>
          <ul className="space-y-2">
            {book.quotes.map((quote, i) => (
              <li
                key={i}
                className="border-l-4 border-indigo-200 pl-3 italic text-gray-600"
              >
                &ldquo;{quote}&rdquo;
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          href={`/books/${book.id}/edit`}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Edit
        </Link>
        <DeleteBookButton action={removeBook.bind(null, book.id)} />
      </div>
    </main>
  )
}
