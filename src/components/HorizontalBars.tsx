export type BarItem = {
  label: string
  value: number
  color: string
}

export default function HorizontalBars({ items }: { items: BarItem[] }) {
  const max = Math.max(1, ...items.map((item) => item.value))

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-stone-700" title={item.label}>
            {item.label}
          </span>
          <div className="h-5 flex-1 rounded bg-stone-100">
            <div
              className="h-5 rounded-r-md"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-sm text-stone-500 tabular-nums">
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  )
}
