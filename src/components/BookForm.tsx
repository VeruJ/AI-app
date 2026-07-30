'use client'

import StarRatingInput from './StarRatingInput'

type BookFormValues = {
  title: string
  author: string
  genres: string
  rating: number
  thoughts: string
  quotes: string
  yearRead: number
  coverImage: string
}

export default function BookForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void
  initial?: Partial<BookFormValues>
  submitLabel: string
}) {
  return (
    <form action={action} encType="multipart/form-data" className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Cover image</label>
        {initial?.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/uploads/${initial.coverImage}`}
            alt="Current cover"
            className="mt-1 h-32 w-auto rounded border border-gray-200"
          />
        )}
        <input
          name="cover"
          type="file"
          accept="image/*"
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          name="title"
          defaultValue={initial?.title}
          required
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Author</label>
        <input
          name="author"
          defaultValue={initial?.author}
          required
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Genre tags (comma-separated)</label>
        <input
          name="genres"
          defaultValue={initial?.genres}
          placeholder="fantasy, classic"
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Date read</label>
        <input
          name="dateRead"
          type="date"
          defaultValue={`${initial?.yearRead ?? new Date().getFullYear()}-01-01`}
          required
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Rating</label>
        <StarRatingInput name="rating" defaultValue={initial?.rating ?? 0} />
      </div>

      <div>
        <label className="block text-sm font-medium">Your thoughts</label>
        <textarea
          name="thoughts"
          defaultValue={initial?.thoughts}
          rows={4}
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Quotes (one per line)</label>
        <textarea
          name="quotes"
          defaultValue={initial?.quotes}
          rows={4}
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <button
        type="submit"
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        {submitLabel}
      </button>
    </form>
  )
}
