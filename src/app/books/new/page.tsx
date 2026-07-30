import BookForm from '@/components/BookForm'
import { createBook } from '@/app/actions'

export default function NewBookPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add a book</h1>
      <BookForm action={createBook} submitLabel="Add book" />
    </main>
  )
}
