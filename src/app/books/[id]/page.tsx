import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBook, STATUS_LABELS, FORMAT_LABELS } from '@/lib/data'
import { formatDateCz } from '@/lib/dates'
import { removeBook, uploadBookImages, removeBookImage, reorderBookImages } from '@/app/actions'
import StarRating from '@/components/StarRating'
import DeleteBookButton from '@/components/DeleteBookButton'
import VisionBoard from '@/components/VisionBoard'

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
      <Link href="/" className="text-sm text-amber-800 hover:underline">
        ← Back to your books
      </Link>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="flex items-end gap-4">
          {book.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/uploads/${book.coverImage}`}
              alt={`Cover of ${book.title || 'book'}`}
              className="h-24 w-auto rounded border border-stone-200"
            />
          )}
          <div>
            <h1 className="font-heading text-2xl font-bold">{book.title || 'Untitled'}</h1>
            <p className="text-stone-500">
              {book.author || 'Unknown author'}
              {book.yearRead ? ` · ${book.yearRead}` : ''}
            </p>
            <div className="mt-2">
              <StarRating rating={book.rating} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600">
            {STATUS_LABELS[book.status]}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600">
            {FORMAT_LABELS[book.format]}
          </span>
        </div>
      </div>

      {book.genres.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {book.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700"
            >
              {genre}
            </span>
          ))}
        </div>
      )}

      {(book.startedAt || book.finishedAt) && (
        <section className="mt-6">
          <h2 className="font-heading mb-2 text-lg font-semibold">Reading progress</h2>
          <p className="text-stone-700">
            {book.startedAt ? `Started ${formatDateCz(book.startedAt)}` : 'Start date not set'}
            {book.finishedAt ? ` · Finished ${formatDateCz(book.finishedAt)}` : ''}
          </p>
        </section>
      )}

      {book.thoughts && (
        <section className="mt-6">
          <h2 className="font-heading mb-2 text-lg font-semibold">My thoughts</h2>
          <p className="whitespace-pre-wrap text-stone-700">{book.thoughts}</p>
        </section>
      )}

      {book.quotes.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading mb-2 text-lg font-semibold">Quotes</h2>
          <ul className="space-y-2">
            {book.quotes.map((quote, i) => (
              <li
                key={i}
                className="border-l-4 border-amber-200 pl-3 italic text-stone-600"
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
          className="rounded border border-stone-300 px-4 py-2 hover:bg-stone-50"
        >
          Edit
        </Link>
        <DeleteBookButton action={removeBook.bind(null, book.id)} />
      </div>

      <section className="mt-8">
        <h2 className="font-heading mb-3 text-lg font-semibold">Vision board</h2>
        <VisionBoard
          initialImages={book.images ?? []}
          uploadAction={uploadBookImages.bind(null, book.id)}
          removeAction={removeBookImage.bind(null, book.id)}
          reorderAction={reorderBookImages.bind(null, book.id)}
        />
      </section>
    </main>
  )
}
