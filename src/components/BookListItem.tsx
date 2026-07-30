import Link from 'next/link'
import { STATUS_LABELS, type Book } from '@/lib/data'
import StarRating from '@/components/StarRating'

export default function BookListItem({ book }: { book: Book }) {
  return (
    <li>
      <Link
        href={`/books/${book.id}`}
        className="flex items-center justify-between rounded border border-gray-200 bg-white p-3 hover:bg-gray-50"
      >
        <div className="flex flex-1 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {book.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/uploads/${book.coverImage}`}
                alt={`Cover of ${book.title || 'book'}`}
                className="h-12 w-auto rounded border border-gray-200"
              />
            )}
            <div>
              <p className="font-medium">{book.title || 'Untitled'}</p>
              <p className="text-sm text-gray-500">{book.author || 'Unknown author'}</p>
            </div>
          </div>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {STATUS_LABELS[book.status]}
          </span>
        </div>
        <div className="flex items-center gap-2 pl-4">
          {book.rating === 0 && <span className="text-sm text-gray-500">Not rated</span>}
          <StarRating rating={book.rating} />
        </div>
      </Link>
    </li>
  )
}
