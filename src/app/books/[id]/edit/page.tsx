import { notFound } from 'next/navigation'
import { getBook } from '@/lib/data'
import { editBook } from '@/app/actions'
import BookForm from '@/components/BookForm'

export const dynamic = 'force-dynamic'

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = await getBook(Number(id))
  if (!book) notFound()

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit book</h1>
      <BookForm
        action={editBook.bind(null, book.id)}
        submitLabel="Save changes"
        initial={{
          title: book.title,
          author: book.author,
          status: book.status,
          format: book.format,
          genres: book.genres.join(', '),
          rating: book.rating,
          thoughts: book.thoughts,
          quotes: book.quotes.join('\n'),
          startedAt: book.startedAt ?? '',
          finishedAt: book.finishedAt ?? '',
          totalPages: book.totalPages,
          coverImage: book.coverImage ?? '',
        }}
      />
    </main>
  )
}
