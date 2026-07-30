export type BookFormat = 'physical' | 'ebook' | 'audio'

export const FORMAT_LABELS: Record<BookFormat, string> = {
  physical: 'Physical book',
  ebook: 'E-book',
  audio: 'Audio book',
}
