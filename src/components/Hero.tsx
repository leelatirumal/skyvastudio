export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-content">
        <span className="hero-kicker"><span /> A place to feel at home</span>
        <h1>Skyva Studio.<br /><em>Stay beautifully.</em></h1>
        <p>Find your own kind of comfort in a home designed for sharing, living, and feeling good.</p>
        <a className="hero-button" href="#rooms">
          Discover your room <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="hero-note"><span>01 / 03</span> Thoughtful spaces. Everyday ease.</div>
      <a className="hero-scroll" href="#about" aria-label="Scroll to learn about Skyva Studio">↓</a>
    </section>
  )
}
