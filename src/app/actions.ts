'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { addBook, updateBook, deleteBook, type BookInput } from '@/lib/data'

function parseForm(formData: FormData): BookInput {
  const genres = String(formData.get('genres') ?? '')
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean)
  const quotes = String(formData.get('quotes') ?? '')
    .split('\n')
    .map((q) => q.trim())
    .filter(Boolean)

  return {
    title: String(formData.get('title') ?? ''),
    author: String(formData.get('author') ?? ''),
    genres,
    rating: Number(formData.get('rating') ?? 0),
    thoughts: String(formData.get('thoughts') ?? ''),
    quotes,
    yearRead: Number(formData.get('yearRead') ?? new Date().getFullYear()),
  }
}

export async function createBook(formData: FormData) {
  const input = parseForm(formData)
  const id = await addBook(input)
  revalidatePath('/')
  redirect(`/books/${id}`)
}

export async function editBook(id: number, formData: FormData) {
  const input = parseForm(formData)
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
