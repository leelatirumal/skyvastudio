interface ApiRequest {
  headers: {
    origin?: string
    host?: string
  }
  method?: string
  body: unknown
}

interface ApiResponse {
  setHeader(name: string, value: string): this
  status(code: number): this
  json(body: unknown): this
  end(): this
}

declare const process: {
  env: Record<string, string | undefined>
}

interface FormSubmission {
  type: 'enquiry' | 'appointment'
  name: string
  phone: string
  email?: string
  visitDate?: string
}

const allowedOrigins = new Set([
  'https://leelatirumal.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

function isFormSubmission(value: unknown): value is FormSubmission {
  if (!value || typeof value !== 'object') return false
  const body = value as Record<string, unknown>
  if (
    (body.type !== 'enquiry' && body.type !== 'appointment')
    || typeof body.name !== 'string'
    || body.name.trim().length === 0
    || body.name.length > 100
    || typeof body.phone !== 'string'
    || !/^[0-9+().\s-]{7,20}$/.test(body.phone)
    || body.phone.replace(/\D/g, '').length < 7
  ) {
    return false
  }

  if (body.type === 'appointment') {
    return typeof body.email === 'string'
      && body.email.length <= 254
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
      && typeof body.visitDate === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(body.visitDate)
  }
  return true
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const origin = req.headers.origin
  res.setHeader('Vary', 'Origin')

  let isSameOrigin = false
  if (origin && req.headers.host) {
    try {
      isSameOrigin = new URL(origin).host === req.headers.host
    } catch {
      isSameOrigin = false
    }
  }

  if (!isSameOrigin && (!origin || !allowedOrigins.has(origin))) {
    res.status(403).json({ error: 'Origin is not allowed.' })
    return
  }

  if (!isSameOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }
  if (!isFormSubmission(req.body)) {
    res.status(400).json({ error: 'Please provide valid form details.' })
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.EMAIL_TO
  if (!apiKey || !recipient) {
    console.error('Email delivery is not configured: RESEND_API_KEY or EMAIL_TO is missing.')
    res.status(503).json({ error: 'Email delivery is not configured yet.' })
    return
  }

  const submission = req.body
  const isAppointment = submission.type === 'appointment'
  const text = [
    isAppointment ? 'New appointment request' : 'New enquiry',
    '',
    `Name: ${submission.name.trim()}`,
    `Phone: ${submission.phone.trim()}`,
    ...(isAppointment ? [
      `Email: ${submission.email}`,
      `Visit date: ${submission.visitDate}`,
    ] : []),
    `Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
  ].join('\n')

  let emailResponse: Response
  try {
    emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'Skyva Studio <onboarding@resend.dev>',
        to: [recipient],
        subject: isAppointment ? 'New appointment request — Skyva Studio' : 'New enquiry — Skyva Studio',
        text,
        ...(isAppointment ? { reply_to: submission.email } : {}),
      }),
    })
  } catch (error) {
    console.error('Email provider request failed.', error)
    res.status(502).json({ error: 'We could not send your request. Please try again.' })
    return
  }

  if (!emailResponse.ok) {
    console.error('Email provider rejected the request.', emailResponse.status, await emailResponse.text())
    res.status(502).json({ error: 'We could not send your request. Please try again.' })
    return
  }

  res.status(200).json({ ok: true })
}
