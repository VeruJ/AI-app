import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

export type { BookStatus } from './bookStatus'
export { STATUS_LABELS } from './bookStatus'
import type { BookStatus } from './bookStatus'
export type { BookFormat } from './bookFormat'
export { FORMAT_LABELS } from './bookFormat'
import type { BookFormat } from './bookFormat'

export type Book = {
  id: number
  title: string
  author: string
  genres: string[]
  status: BookStatus
  format: BookFormat
  rating: number
  thoughts: string
  quotes: string[]
  yearRead?: number
  createdAt: string
  startedAt?: string
  finishedAt?: string
  pagesRead?: number
  totalPages?: number
  coverImage?: string
  images?: string[]
}

export type BookInput = {
  title: string
  author: string
  genres: string[]
  status?: BookStatus
  format?: BookFormat
  rating: number
  thoughts: string
  quotes: string[]
  yearRead?: number
  startedAt?: string
  finishedAt?: string
  pagesRead?: number
  totalPages?: number
  coverImage?: string
}

type Data = { books: Book[] }

const FILE = path.join(process.cwd(), 'data', 'app.json')
const EMPTY: Data = { books: [] }

async function readAll(): Promise<Data> {
  try {
    const data = JSON.parse(await readFile(FILE, 'utf8')) as Data
    // Older records predate the status field. They already carry a rating and
    // year read, so treat them as finished books rather than leaving them undefined.
    // Records predating the format field default to physical, the assumption that held before e-books/audio were tracked.
    data.books = data.books.map((b) => ({
      ...b,
      status: b.status ?? 'read',
      format: b.format ?? 'physical',
    }))
    return data
  } catch {
    return structuredClone(EMPTY)
  }
}

async function writeAll(data: Data) {
  await mkdir(path.dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

// Every mutation goes through here, and they run strictly one after another.
// Without this queue, two requests arriving together BOTH read the old file and
// the second one overwrites the first.
let queue: Promise<unknown> = Promise.resolve()
function update<T>(fn: (data: Data) => T): Promise<T> {
  const run = queue.then(async () => {
    const data = await readAll()
    const result = fn(data)
    await writeAll(data)
    return result
  })
  queue = run.catch(() => {})
  return run
}

export async function listBooks(): Promise<Book[]> {
  return (await readAll()).books
}

export async function getBook(id: number): Promise<Book | undefined> {
  return (await readAll()).books.find((b) => b.id === id)
}

export function addBook(input: BookInput): Promise<number> {
  return update((data) => {
    const id = Math.max(0, ...data.books.map((b) => b.id)) + 1
    data.books.push({
      status: 'tbr',
      format: 'physical',
      ...input,
      id,
      createdAt: new Date().toISOString(),
    })
    return id
  })
}

export function updateBook(id: number, input: BookInput): Promise<boolean> {
  return update((data) => {
    const book = data.books.find((b) => b.id === id)
    if (!book) return false
    // Keep the existing cover unless a new one was uploaded.
    Object.assign(book, input, { coverImage: input.coverImage ?? book.coverImage })
    return true
  })
}

export function deleteBook(id: number): Promise<boolean> {
  return update((data) => {
    const index = data.books.findIndex((b) => b.id === id)
    if (index === -1) return false
    data.books.splice(index, 1)
    return true
  })
}

export function addBookImages(id: number, filenames: string[]): Promise<boolean> {
  return update((data) => {
    const book = data.books.find((b) => b.id === id)
    if (!book) return false
    book.images = [...(book.images ?? []), ...filenames]
    return true
  })
}

export function deleteBookImage(id: number, filename: string): Promise<boolean> {
  return update((data) => {
    const book = data.books.find((b) => b.id === id)
    if (!book) return false
    book.images = (book.images ?? []).filter((f) => f !== filename)
    return true
  })
}

export function reorderBookImages(id: number, order: string[]): Promise<boolean> {
  return update((data) => {
    const book = data.books.find((b) => b.id === id)
    if (!book) return false
    const current = book.images ?? []
    const isValidPermutation =
      order.length === current.length && order.every((f) => current.includes(f))
    if (isValidPermutation) book.images = order
    return isValidPermutation
  })
}
