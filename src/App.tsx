import { useEffect, useState } from 'react'
import { ContactSection } from './components/ContactSection'
import { EnquiryModal, type FormType } from './components/EnquiryModal'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { RoomDetailsPage } from './components/RoomDetailsPage'
import { RoomsSection } from './components/RoomsSection'
import { ServicesSection } from './components/ServicesSection'
import { rooms } from './data/rooms'
import './App.css'

function App() {
  const [activeForm, setActiveForm] = useState<FormType | null>(null)
  const roomSlug = window.location.pathname.match(/^\/rooms\/([^/]+)\/?$/)?.[1]
  const room = rooms.find((item) => item.slug === roomSlug)

  useEffect(() => {
    const timer = window.setTimeout(() => setActiveForm('enquiry'), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="site-shell">
      <Header onBookAppointment={() => setActiveForm('appointment')} />
      {room ? (
        <RoomDetailsPage room={room} />
      ) : (
        <main>
          <Hero />
          <section className="about-section section-wrap" id="about">
            <div className="about-mark" aria-hidden="true">
              <span>SS</span>
              <span className="about-mark-caption">A better way to stay</span>
            </div>
            <div className="about-copy">
              <span className="eyebrow">Welcome to Skyva Studio</span>
              <h2>A little more comfort.<br />A lot more like home.</h2>
              <p>
                Thoughtful rooms, warm hospitality, and all the everyday essentials
                — brought together in a welcoming place to call your own.
              </p>
              <a className="inline-link" href="#rooms">
                Find your room <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>
          <RoomsSection />
          <ServicesSection />
          <ContactSection />
        </main>
      )}
      <Footer />
      {activeForm && (
        <EnquiryModal
          type={activeForm}
          onClose={() => setActiveForm(null)}
          onSwitchForm={setActiveForm}
        />
      )}
    </div>
  )
}

export default App
