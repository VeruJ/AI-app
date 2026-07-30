import { readFile } from 'node:fs/promises'
import path from 'node:path'

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params
  const safeName = path.basename(name)

  try {
    const file = await readFile(
      path.join(process.cwd(), 'data', 'uploads', safeName),
    )
    const contentType = CONTENT_TYPES[path.extname(safeName).toLowerCase()]
    return new Response(file, {
      headers: contentType ? { 'Content-Type': contentType } : undefined,
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
