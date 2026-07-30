import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

// data.ts builds its file path from process.cwd() — point that at a throwaway
// temp folder for every test so we never touch the real data/app.json.
let dir: string

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'app-test-'))
  vi.spyOn(process, 'cwd').mockReturnValue(dir)
  vi.resetModules()
})

afterEach(async () => {
  vi.restoreAllMocks()
  await rm(dir, { recursive: true, force: true })
})

const baseInput = {
  title: 'Test Book',
  author: 'Test Author',
  genres: [],
  rating: 0,
  thoughts: '',
  quotes: [],
  yearRead: 2024,
}

describe('data layer (books)', () => {
  it('addBook saves a new book and assigns it id 1', async () => {
    const { addBook, listBooks } = await import('@/lib/data')
    const id = await addBook(baseInput)
    expect(id).toBe(1)

    const books = await listBooks()
    expect(books).toHaveLength(1)
    expect(books[0].title).toBe('Test Book')
  })

  it('addBook assigns the next id as highest existing id + 1, not a count', async () => {
    const { addBook, deleteBook } = await import('@/lib/data')
    const firstId = await addBook(baseInput)
    const secondId = await addBook(baseInput)
    await deleteBook(firstId)

    const thirdId = await addBook(baseInput)
    expect(thirdId).toBe(secondId + 1)
  })

  it('updateBook keeps the existing cover when no new cover is uploaded', async () => {
    const { addBook, updateBook, getBook } = await import('@/lib/data')
    const id = await addBook({ ...baseInput, coverImage: 'original.png' })

    await updateBook(id, { ...baseInput, title: 'Updated Title' })

    const book = await getBook(id)
    expect(book?.title).toBe('Updated Title')
    expect(book?.coverImage).toBe('original.png')
  })
})
