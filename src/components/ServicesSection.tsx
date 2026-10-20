const services = [
  {
    name: 'Comfort, all day',
    detail: 'Air conditioning in every sharing room.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Room for downtime',
    detail: 'A TV to make your evenings feel easy.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Fresh, every day',
    detail: 'Daily room cleaning, with a refrigerator on every floor.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Meals made simple',
    detail: 'Breakfast and dinner, ready to enjoy.',
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1000&q=85',
  },
]

export function ServicesSection() {
  return (
    <section className="services-section section-wrap" id="services">
      <div className="section-heading">
        <div>
          <span className="eyebrow">The little things, taken care of</span>
          <h2>More comfort.<br /><em>Less to think about.</em></h2>
        </div>
        <p>Settle into the day with the essentials already taken care of — all part of the Skyva Studio experience.</p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <article className="service-card" key={service.name}>
            <img src={service.image} alt="" loading="lazy" />
            <div className="service-overlay">
              <span>0{index + 1}</span>
              <h3>{service.name}</h3>
              <p>{service.detail}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="amenity-chips">
        <span>Fast Wi-Fi</span><span>Air-conditioned rooms</span><span>TV</span>
        <span>Refrigerator on every floor</span><span>Daily cleaning</span>
        <span>Breakfast &amp; dinner</span>
      </div>
    </section>
  )
}
