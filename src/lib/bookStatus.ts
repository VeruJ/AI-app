export type BookStatus = 'tbr' | 'reading' | 'read'

export const STATUS_LABELS: Record<BookStatus, string> = {
  tbr: 'To be read',
  reading: 'Reading',
  read: 'Read',
}
