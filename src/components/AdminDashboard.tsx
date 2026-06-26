import { useState } from 'react'
import { useArtworks } from '../hooks/useArtworks'
import type { Artwork, ArtworkInput } from '../types/artwork'
import { ArtworkForm } from './ArtworkForm'
import { ArtworkList } from './ArtworkList'

type AdminDashboardProps = {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { artworks, isLoading, error, addArtwork, updateArtwork, deleteArtwork } = useArtworks()
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null)
  const [notice, setNotice] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3500)
  }

  const handleSave = async (input: ArtworkInput) => {
    setIsSaving(true)
    try {
      if (editingArtwork) {
        await updateArtwork(editingArtwork.id, input)
        setEditingArtwork(null)
        showNotice('La obra fue actualizada correctamente.')
      } else {
        await addArtwork(input)
        showNotice('La obra ya está publicada en la galería.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (artwork: Artwork) => {
    if (!window.confirm(`¿Eliminar "${artwork.name}" de la galería?`)) return
    setIsSaving(true)
    try {
      await deleteArtwork(artwork.id)
      if (editingArtwork?.id === artwork.id) setEditingArtwork(null)
      showNotice('La obra fue eliminada.')
    } catch (caught) {
      showNotice(caught instanceof Error ? caught.message : 'No se pudo eliminar la obra.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container admin-header__inner">
          <div>
            <img className="admin-header__logo" src="/logo-mulher.png" alt="Mulher" />
            <strong>Panel de administrador</strong>
          </div>
          <nav className="admin-header__actions" aria-label="Acciones del administrador">
            <a href="/">Volver a la galería</a>
            <button type="button" onClick={onLogout}>Cerrar sesión</button>
          </nav>
        </div>
      </header>

      <main className="admin-main container">
        <section className="admin-intro">
          <p className="eyebrow">Gestión de colección</p>
          <h1>Obras publicadas</h1>
          <p>Administrá las piezas que aparecen en la galería pública.</p>
        </section>

        {notice && <p className="form-message form-message--success" role="status">{notice}</p>}
        {error && <p className="form-message form-message--error" role="alert">{error}</p>}

        <div className="admin-layout">
          <section className="admin-panel admin-panel--form" id="cargar-obra">
            <div className="admin-panel__heading">
              <span>{editingArtwork ? 'Editar pieza' : 'Nueva pieza'}</span>
              <h2>{editingArtwork ? 'Editar obra' : 'Cargar nueva obra'}</h2>
              <p>
                {editingArtwork
                  ? 'Actualizá los datos o reemplazá la imagen de la pieza.'
                  : 'Completá los datos y subí una imagen para agregarla a la colección.'}
              </p>
            </div>
            <ArtworkForm
              artwork={editingArtwork}
              isSaving={isSaving}
              onSave={handleSave}
              onCancel={() => setEditingArtwork(null)}
            />
          </section>

          <section className="admin-panel admin-panel--list">
            <div className="admin-panel__heading admin-panel__heading--row">
              <div>
                <span>Colección actual</span>
                <h2>Listado de obras</h2>
              </div>
              <strong>{artworks.length}</strong>
            </div>
            {isLoading ? (
              <p className="empty-state">Cargando obras...</p>
            ) : (
              <ArtworkList artworks={artworks} onEdit={setEditingArtwork} onDelete={handleDelete} />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
