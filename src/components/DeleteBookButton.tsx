'use client'

export default function DeleteBookButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Delete this book? This cannot be undone.')) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="rounded border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  )
}
