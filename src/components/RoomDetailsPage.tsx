import type { Room } from '../data/rooms'
import { formatRupees } from '../data/rooms'

type RoomDetailsPageProps = {
  room: Room
}

export function RoomDetailsPage({ room }: RoomDetailsPageProps) {
  return (
    <main className="room-detail section-wrap">
      <a className="back-link" href="/#rooms"><span aria-hidden="true">←</span> All rooms</a>
      <div className="detail-heading">
        <div>
          <span className="eyebrow">{room.occupancy}</span>
          <h1>{room.name}<br /><em>at Skyva Studio.</em></h1>
          <p>{room.description} All shared rooms are air-conditioned and designed to make everyday living feel a little more special.</p>
        </div>
        <div className="detail-rate">
          <span>Monthly rent · per person</span>
          <strong>{formatRupees(room.monthlyPrice)}<small> / month</small></strong>
          <a className="hero-button" href="/#contact">Ask about this room <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="detail-gallery">
        {room.images.map((image, index) => (
          <img
            className={`detail-image detail-image-${index + 1}`}
            key={image}
            src={image}
            alt={`${room.name} room photo ${index + 1}`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <section className="detail-bottom">
        <div>
          <span className="eyebrow">The monthly details</span>
          <h2>Clear, comfortable<br /><em>from day one.</em></h2>
        </div>
        <div className="price-list">
          <div><span>Monthly rent</span><strong>{formatRupees(room.monthlyPrice)} <small>/ person</small></strong></div>
          <div><span>Advance payment</span><strong>{formatRupees(room.advance)} <small>/ one-time</small></strong></div>
          <p>Demo rates for preview only. Contact us to confirm current availability and pricing.</p>
        </div>
      </section>
    </main>
  )
}
