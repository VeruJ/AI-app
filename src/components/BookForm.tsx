'use client'

import StarRatingInput from './StarRatingInput'
import { STATUS_LABELS, type BookStatus } from '@/lib/bookStatus'
import { FORMAT_LABELS, type BookFormat } from '@/lib/bookFormat'

type BookFormValues = {
  title: string
  author: string
  genres: string
  status: BookStatus
  format: BookFormat
  rating: number
  thoughts: string
  quotes: string
  startedAt: string
  finishedAt: string
  totalPages: number
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
    <form action={action} className="space-y-4">
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
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Author</label>
        <input
          name="author"
          defaultValue={initial?.author}
          className="mt-1 w-full rounded border border-gray-300 p-2"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={initial?.status ?? 'tbr'}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Type</label>
          <select
            name="format"
            defaultValue={initial?.format ?? 'physical'}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          >
            {Object.entries(FORMAT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
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

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Started reading</label>
          <input
            name="startedAt"
            type="date"
            defaultValue={initial?.startedAt}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Finished reading</label>
          <input
            name="finishedAt"
            type="date"
            defaultValue={initial?.finishedAt}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Total pages</label>
        <input
          name="totalPages"
          type="number"
          min={0}
          defaultValue={initial?.totalPages}
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
