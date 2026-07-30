export function yearOf(date: string | undefined): number | undefined {
  const year = Number(date?.split('-')[0])
  return date && Number.isFinite(year) && year > 0 ? year : undefined
}
