export function yearOf(date: string | undefined): number | undefined {
  const year = Number(date?.split('-')[0])
  return date && Number.isFinite(year) && year > 0 ? year : undefined
}

// Formats a 'YYYY-MM-DD' date string as Czech dd.mm.rrrr.
export function formatDateCz(date: string): string {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}
