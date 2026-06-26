export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <img className="footer__logo" src="/logo-mulher.png" alt="Mulher" />
          <p>Obras artesanales y arte hecho a mano</p>
        </div>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
