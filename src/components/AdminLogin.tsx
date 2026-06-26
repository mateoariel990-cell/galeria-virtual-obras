import { useState, type FormEvent } from 'react'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

type AdminLoginProps = {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ADMIN_PASSWORD) {
      setError('Configurá VITE_ADMIN_PASSWORD en Netlify antes de usar el panel.')
      return
    }
    if (password === ADMIN_PASSWORD) {
      setError('')
      onLogin()
      return
    }
    setError('Contraseña incorrecta.')
  }

  return (
    <main className="admin-login-page">
      <a className="admin-back-link" href="/">← Volver a la galería</a>
      <section className="admin-login" aria-labelledby="login-title">
        <img className="admin-login__logo" src="/logo-mulher.png" alt="Mulher" />
        <p className="eyebrow">Acceso privado</p>
        <h1 id="login-title">Administrar la galería</h1>
        <p className="admin-login__intro">
          Ingresá la contraseña privada para publicar, editar o retirar obras.
        </p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="form-message form-message--error" role="alert">{error}</p>}
          <button className="button button--primary button--full" type="submit">
            Ingresar al panel
          </button>
        </form>
      </section>
    </main>
  )
}
