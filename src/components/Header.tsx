interface HeaderProps {
  onBookAppointment: () => void
}

export function Header({ onBookAppointment }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Skyva Studio home">
        <span className="brand-symbol" aria-hidden="true">S</span>
        <span className="brand-copy">
          <span className="brand-name">skyva<span>studio</span></span>
          <span className="brand-caption">A stay that feels like yours</span>
        </span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </nav>
      <button className="header-cta" type="button" onClick={onBookAppointment}>
        Book appointment <span aria-hidden="true">↗</span>
      </button>
    </header>
  )
}
