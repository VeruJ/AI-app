'use client'

import { useState } from 'react'

type BookFormValues = {
  title: string
  author: string
  genres: string
  rating: number
  thoughts: string
  quotes: string
  yearRead: number
  startedAt: string
  finishedAt: string
  pagesRead: number
  totalPages: number
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
  const [rating, setRating] = useState(initial?.rating ?? 0)

  return (
    <form action={action} className="space-y-4">
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
        <label className="block text-sm font-medium">Year read</label>
        <input
          name="yearRead"
          type="number"
          defaultValue={initial?.yearRead ?? new Date().getFullYear()}
          required
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

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Pages read</label>
          <input
            name="pagesRead"
            type="number"
            min={0}
            defaultValue={initial?.pagesRead}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Total pages</label>
          <input
            name="totalPages"
            type="number"
            min={0}
            defaultValue={initial?.totalPages}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Rating ({rating} / 5)</label>
        <input
          name="rating"
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 w-full"
        />
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
