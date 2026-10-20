import { useEffect, useRef, useState, type FormEvent } from 'react'

export type FormType = 'enquiry' | 'appointment'

interface EnquiryModalProps {
  type: FormType
  onClose: () => void
  onSwitchForm: (type: FormType) => void
}

const minimumVisitDate = new Date().toISOString().slice(0, 10)

export function EnquiryModal({ type, onClose, onSwitchForm }: EnquiryModalProps) {
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nameInput = useRef<HTMLInputElement>(null)
  const isAppointment = type === 'appointment'

  useEffect(() => {
    nameInput.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()

    if (!/^[0-9+().\s-]{7,20}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
      setError('Enter a valid phone number with at least 7 digits.')
      return
    }

    const apiUrl = import.meta.env.VITE_SUBMISSION_API_URL || '/api/submit'

    const body = {
      type,
      name,
      phone,
      ...(isAppointment
        ? {
            email: String(formData.get('email') ?? '').trim(),
            visitDate: String(formData.get('visitDate') ?? ''),
          }
        : {}),
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        console.error('Email submission endpoint returned status:', response.status)
        setError(response.status === 503
          ? 'Email delivery is not configured yet. Please try again later.'
          : 'We could not send your request. Please try again.')
        return
      }

      setSubmitted(true)
    } catch (submissionError) {
      console.error('Unable to reach the email submission endpoint.', submissionError)
      setError('We could not send your request. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
        <button className="modal-close" type="button" aria-label="Close form" onClick={onClose}>×</button>
        {submitted ? (
          <div className="modal-success">
            <span className="eyebrow">{isAppointment ? 'Visit request received' : 'Thank you'}</span>
            <h2 id="enquiry-title">{isAppointment ? 'We’ll confirm your visit.' : 'We’ll call you back soon.'}</h2>
            <p>
              {isAppointment
                ? 'Your appointment request has been sent to our team. We’ll confirm the date and time with you.'
                : 'Your enquiry has been sent to our team. We’ll call you back using the phone number you provided.'}
            </p>
            <button className="modal-cancel" type="button" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">{isAppointment ? 'Plan your visit' : 'We’re here to help'}</span>
            <h2 id="enquiry-title">{isAppointment ? 'Book an appointment' : 'Make an enquiry'}</h2>
            <p className="modal-description">
              {isAppointment
                ? 'Share your details and the date you’d like to visit.'
                : 'Leave your details and our team will get back to you.'}
            </p>
            <form className="enquiry-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input ref={nameInput} name="name" autoComplete="name" required maxLength={100} />
              </label>
              <label>
                Phone number
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={20}
                  required
                />
              </label>
              {isAppointment && (
                <>
                  <label>
                    Email
                    <input name="email" type="email" autoComplete="email" required maxLength={254} />
                  </label>
                  <label>
                    Date to visit
                    <input name="visitDate" type="date" min={minimumVisitDate} required />
                  </label>
                </>
              )}
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="modal-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : isAppointment ? 'Request appointment' : 'Send enquiry'}
                <span aria-hidden="true">→</span>
              </button>
            </form>
            <div className="modal-footer">
              <button className="modal-cancel" type="button" onClick={onClose}>Cancel</button>
              <button
                className="modal-switch"
                type="button"
                onClick={() => onSwitchForm(isAppointment ? 'enquiry' : 'appointment')}
              >
                {isAppointment ? 'Send an enquiry instead' : 'Book an appointment'}
              </button>
            </div>
            <p className="storage-note">Your details will be sent to the booking team by email.</p>
          </>
        )}
      </section>
    </div>
  )
}
