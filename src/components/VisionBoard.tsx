'use client'

import { useEffect, useState } from 'react'

type Props = {
  initialImages: string[]
  uploadAction: (formData: FormData) => Promise<string[]>
  removeAction: (filename: string) => Promise<void>
  reorderAction: (order: string[]) => Promise<void>
}

export default function VisionBoard({
  initialImages,
  uploadAction,
  removeAction,
  reorderAction,
}: Props) {
  const [images, setImages] = useState(initialImages)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (openIndex === null) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : Math.min(i + 1, images.length - 1)))
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : Math.max(i - 1, 0)))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openIndex, images.length])

  async function handleUpload(formData: FormData) {
    setUploading(true)
    try {
      const added = await uploadAction(formData)
      if (added.length) setImages((prev) => [...prev, ...added])
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove(filename: string) {
    setImages((prev) => prev.filter((f) => f !== filename))
    await removeAction(filename)
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return
    const next = [...images]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(targetIndex, 0, moved)
    setImages(next)
    setDragIndex(null)
    reorderAction(next)
  }

  return (
    <div>
      <form action={handleUpload} className="mb-4 flex flex-wrap items-center gap-3">
        <input type="file" name="images" accept="image/*" multiple className="text-sm" />
        <button
          type="submit"
          disabled={uploading}
          className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Add images'}
        </button>
      </form>

      {images.length === 0 ? (
        <p className="text-gray-500">No images yet — add a few to build your board.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((file, index) => (
            <div
              key={file}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData('text/plain', String(index))
                setDragIndex(index)
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="group relative aspect-square cursor-grab overflow-hidden rounded border border-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/uploads/${file}`}
                alt="Vision board"
                className="h-full w-full object-cover"
                onClick={() => setOpenIndex(index)}
              />
              <button
                type="button"
                onClick={() => handleRemove(file)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute right-6 top-6 text-3xl text-white"
          >
            ×
          </button>
          {openIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex((i) => (i === null ? i : i - 1))
              }}
              aria-label="Previous image"
              className="absolute left-6 text-4xl text-white"
            >
              ‹
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/uploads/${images[openIndex]}`}
            alt="Vision board, enlarged"
            className="max-h-full max-w-full rounded object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {openIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex((i) => (i === null ? i : i + 1))
              }}
              aria-label="Next image"
              className="absolute right-6 text-4xl text-white"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  )
}
