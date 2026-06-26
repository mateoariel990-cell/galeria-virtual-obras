export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <img className="brand__logo" src="/logo-mulher.png" alt="Mulher" />
          <span className="brand__tagline">Obras artesanales y arte hecho a mano</span>
        </a>
        <nav className="header__nav" aria-label="Navegación principal">
          <a className="header__link" href="#coleccion">Ver colección</a>
          <a className="header__admin-link" href="/admin">Admin</a>
        </nav>
      </div>
    </header>
  )
}
