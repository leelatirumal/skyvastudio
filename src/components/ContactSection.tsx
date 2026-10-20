const phoneNumber = '+12025550148'
const displayPhone = '+1 (202) 555-0148'
const emailAddress = 'hello@skyvastudio.example'
const address = 'Skyva Studio,Kokapet, Hyderabad, India'

export function ContactSection() {
  return (
    <section className="contact-section section-wrap" id="contact">
      <div className="contact-intro">
        <span className="eyebrow">Your next chapter starts here</span>
        <h2>Come find<br /><em>your place.</em></h2>
        <p>Questions about a room or want to come by? We’d love to hear from you.</p>
      </div>
      <div className="contact-panel">
        <a className="contact-row" href={`tel:${phoneNumber}`}>
          <span className="contact-icon" aria-hidden="true">↗</span>
          <span><small>Give us a call</small><strong>{displayPhone}</strong></span>
          <span className="contact-arrow" aria-hidden="true">↗</span>
        </a>
        <a className="contact-row" href={`https://wa.me/${phoneNumber.replace('+', '')}`} target="_blank" rel="noreferrer">
          <span className="contact-icon" aria-hidden="true">↗</span>
          <span><small>Chat on WhatsApp</small><strong>{displayPhone}</strong></span>
          <span className="contact-arrow" aria-hidden="true">↗</span>
        </a>
        <a className="contact-row" href={`mailto:${emailAddress}`}>
          <span className="contact-icon" aria-hidden="true">↗</span>
          <span><small>Send us an email</small><strong>{emailAddress}</strong></span>
          <span className="contact-arrow" aria-hidden="true">↗</span>
        </a>
        <a className="contact-row" href="https://maps.google.com/?q=Skyva+Studio+Sample+Road+Chennai" target="_blank" rel="noreferrer">
          <span className="contact-icon" aria-hidden="true">↗</span>
          <span><small>Come say hello</small><strong>{address}</strong></span>
          <span className="contact-arrow" aria-hidden="true">↗</span>
        </a>
        <p className="demo-note">Demo contact details — replace with your real details before publishing.</p>
      </div>
    </section>
  )
}
