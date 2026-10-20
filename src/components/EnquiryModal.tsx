import { useEffect, useRef, useState, type FormEvent } from 'react'

export type FormType = 'enquiry' | 'appointment'

interface EnquiryRecord {
  name: string
  phone: string
  submittedAt: string
}

interface AppointmentRecord extends EnquiryRecord {
  email: string
  visitDate: string
}

interface EnquiryModalProps {
  type: FormType
  onClose: () => void
  onSwitchForm: (type: FormType) => void
}

const enquiriesKey = 'skyva-enquiries'
const appointmentsKey = 'skyva-appointments'
const minimumVisitDate = new Date().toISOString().slice(0, 10)

function readRecords<T>(key: string): T[] {
  const saved = window.localStorage.getItem(key)
  if (!saved) return []

  const records: unknown = JSON.parse(saved)
  if (!Array.isArray(records)) {
    throw new Error('Saved form data is not in the expected format.')
  }
  return records as T[]
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function worksheet(name: string, headers: string[], rows: string[][]): string {
  const cells = (values: string[]) =>
    `<Row>${values.map((value) => `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`).join('')}</Row>`

  return `<Worksheet ss:Name="${name}"><Table>${cells(headers)}${rows.map(cells).join('')}</Table></Worksheet>`
}

function downloadWorkbook() {
  const enquiries = readRecords<EnquiryRecord>(enquiriesKey)
  const appointments = readRecords<AppointmentRecord>(appointmentsKey)
  const content = [
    '<?xml version="1.0"?>',
    '<?mso-application progid="Excel.Sheet"?>',
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">',
    worksheet('Enquiries', ['Name', 'Phone number', 'Submitted at'], enquiries.map(({ name, phone, submittedAt }) => [name, phone, submittedAt])),
    worksheet('Appointments', ['Name', 'Phone number', 'Email', 'Visit date', 'Submitted at'], appointments.map(({ name, phone, email, visitDate, submittedAt }) => [name, phone, email, visitDate, submittedAt])),
    '</Workbook>',
  ].join('')
  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `skyva-submissions-${new Date().toISOString().slice(0, 10)}.xml`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function EnquiryModal({ type, onClose, onSwitchForm }: EnquiryModalProps) {
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
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

  function handleDownload() {
    try {
      downloadWorkbook()
      setError('')
    } catch (exportError) {
      console.error('Unable to export saved form submissions.', exportError)
      setError('Your details are saved in this browser, but the spreadsheet could not be downloaded.')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const common = {
      name: String(formData.get('name') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      submittedAt: new Date().toLocaleString(),
    }

    if (!/^[0-9+().\s-]{7,20}$/.test(common.phone) || common.phone.replace(/\D/g, '').length < 7) {
      setError('Enter a valid phone number with at least 7 digits.')
      return
    }

    try {
      if (isAppointment) {
        const record: AppointmentRecord = {
          ...common,
          email: String(formData.get('email') ?? '').trim(),
          visitDate: String(formData.get('visitDate') ?? ''),
        }
        window.localStorage.setItem(appointmentsKey, JSON.stringify([
          ...readRecords<AppointmentRecord>(appointmentsKey),
          record,
        ]))
      } else {
        const record: EnquiryRecord = common
        window.localStorage.setItem(enquiriesKey, JSON.stringify([
          ...readRecords<EnquiryRecord>(enquiriesKey),
          record,
        ]))
      }
    } catch (saveError) {
      console.error('Unable to save the form submission.', saveError)
      setError('We could not save your details in this browser. Please check your browser storage settings and try again.')
      return
    }

    setSubmitted(true)
    try {
      downloadWorkbook()
    } catch (exportError) {
      console.error('Unable to export saved form submissions.', exportError)
      setError('Your details are saved in this browser, but the spreadsheet could not be downloaded.')
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
            <span className="eyebrow">Thank you</span>
            <h2 id="enquiry-title">Your details are saved.</h2>
            <p>
              {error
                ? 'Your submission is stored in this browser.'
                : 'Your submission is stored in this browser, and an Excel-compatible workbook has been downloaded.'}
            </p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="modal-submit" type="button" onClick={handleDownload}>Download spreadsheet again</button>
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
              <button className="modal-submit" type="submit">
                {isAppointment ? 'Request appointment' : 'Send enquiry'}
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
            <p className="storage-note">Submissions are saved in this browser and exported to an Excel-compatible workbook.</p>
          </>
        )}
      </section>
    </div>
  )
}
