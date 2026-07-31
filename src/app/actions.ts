'use server'

import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  addBook,
  updateBook,
  deleteBook,
  addBookImages as addBookImagesToBook,
  deleteBookImage as deleteBookImageFromBook,
  reorderBookImages as reorderBookImagesForBook,
  type BookInput,
  type BookStatus,
  type BookFormat,
} from '@/lib/data'
import { yearOf } from '@/lib/dates'

const MAX_UPLOAD_SIZE = 5_000_000

async function saveUpload(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error('Image is larger than 5 MB')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const name = `${Date.now()}-${safeName}`
  const dir = path.join(process.cwd(), 'data', 'uploads')

  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))

  return name
}

async function parseForm(formData: FormData): Promise<BookInput> {
  const genres = String(formData.get('genres') ?? '')
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean)
  const quotes = String(formData.get('quotes') ?? '')
    .split('\n')
    .map((q) => q.trim())
    .filter(Boolean)

  const startedAt = String(formData.get('startedAt') ?? '') || undefined
  const finishedAt = String(formData.get('finishedAt') ?? '') || undefined
  const totalPagesRaw = formData.get('totalPages')
  const totalPages = totalPagesRaw ? Number(totalPagesRaw) : undefined

  const cover = formData.get('cover')
  const coverImage =
    cover instanceof File && cover.size > 0 ? await saveUpload(cover) : undefined

  const yearRead = yearOf(finishedAt) ?? yearOf(startedAt)

  const statusRaw = String(formData.get('status') ?? '')
  const status: BookStatus =
    statusRaw === 'reading' || statusRaw === 'read' ? statusRaw : 'tbr'

  const formatRaw = String(formData.get('format') ?? '')
  const format: BookFormat =
    formatRaw === 'ebook' || formatRaw === 'audio' ? formatRaw : 'physical'

  const rating = Math.max(0, Math.min(5, Number(formData.get('rating') ?? 0)))

  return {
    title: String(formData.get('title') ?? '').trim(),
    author: String(formData.get('author') ?? '').trim(),
    genres,
    status,
    format,
    rating,
    thoughts: String(formData.get('thoughts') ?? ''),
    quotes,
    yearRead,
    startedAt,
    finishedAt,
    totalPages,
    coverImage,
  }
}

export async function createBook(formData: FormData) {
  const input = await parseForm(formData)
  const id = await addBook(input)
  revalidatePath('/')
  redirect(`/books/${id}`)
}

export async function editBook(id: number, formData: FormData) {
  const input = await parseForm(formData)
  await updateBook(id, input)
  revalidatePath('/')
  revalidatePath(`/books/${id}`)
  redirect(`/books/${id}`)
}

export async function removeBook(id: number) {
  await deleteBook(id)
  revalidatePath('/')
  redirect('/')
}

export async function uploadBookImages(id: number, formData: FormData): Promise<string[]> {
  const files = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0)
  const filenames = await Promise.all(files.map(saveUpload))
  if (filenames.length) await addBookImagesToBook(id, filenames)
  revalidatePath(`/books/${id}`)
  return filenames
}

export async function removeBookImage(id: number, filename: string) {
  await deleteBookImageFromBook(id, filename)
  revalidatePath(`/books/${id}`)
}

export async function reorderBookImages(id: number, order: string[]) {
  await reorderBookImagesForBook(id, order)
  revalidatePath(`/books/${id}`)
}
