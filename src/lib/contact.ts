import { z } from 'zod'

// Error messages are translation keys under `contact.validation`.
// Keep the limits in sync with the Pydantic model in api/.
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'nameRequired').max(100, 'tooLong'),
  email: z.email('emailInvalid').max(200, 'tooLong'),
  subject: z.string().trim().max(150, 'tooLong'),
  message: z.string().trim().min(10, 'messageShort').max(5000, 'tooLong'),
  /** Honeypot: hidden from people, so only bots fill it in. */
  website: z.string(),
})

export type ContactInput = z.infer<typeof contactSchema>

export class ContactError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`Contact request failed with ${status}`)
    this.status = status
  }
}

export async function sendContactMessage(data: ContactInput): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new ContactError(res.status)
}
