import { formatRupees, rooms } from '../data/rooms'

export function RoomsSection() {
  return (
    <section className="rooms-section section-wrap" id="rooms">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Find your fit</span>
          <h2>Room to feel<br /><em>right at home.</em></h2>
        </div>
        <p>Choose the sharing that suits you. Every room is air-conditioned and thoughtfully set up for a better everyday.</p>
      </div>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <article className={`room-card room-card-${room.shortName}`} key={room.slug}>
            <a className="room-photo" href={`/rooms/${room.slug}`} aria-label={`Explore ${room.name}`}>
              <img src={room.image} alt={`${room.name} room at Skyva Studio`} loading="lazy" />
              <span className="room-number">{room.shortName}</span>
              <span className="room-photo-arrow" aria-hidden="true">↗</span>
            </a>
            <div className="room-card-content">
              <div className="room-card-title">
                <div>
                  <span className="room-occupancy">{room.occupancy}</span>
                  <h3>{room.name}</h3>
                </div>
                <div className="room-price">
                  <strong>{formatRupees(room.monthlyPrice)}</strong>
                  <span>/ month</span>
                </div>
              </div>
              <p>{room.description}</p>
              <a className="room-more" href={`/rooms/${room.slug}`}>
                Show more <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="rooms-footnote"><span /> Room rates and advance shown are demo prices.</div>
    </section>
  )
}
