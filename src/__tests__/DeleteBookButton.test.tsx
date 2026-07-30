import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteBookButton from '@/components/DeleteBookButton'

describe('DeleteBookButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the delete action when the user confirms the dialog', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const action = vi.fn()
    render(<DeleteBookButton action={action} />)

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(action).toHaveBeenCalledTimes(1)
  })

  it('does not call the delete action when the user cancels the dialog', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const action = vi.fn()
    render(<DeleteBookButton action={action} />)

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(action).not.toHaveBeenCalled()
  })
})
