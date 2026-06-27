import { useEffect, useRef } from 'react'
import { getWhatsappUrl, type Artwork } from '../types/artwork'
import { formatPrice } from '../utils/price'

type ArtworkModalProps = {
  artwork: Artwork | null
  onClose: () => void
}

export function ArtworkModal({ artwork, onClose }: ArtworkModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!artwork) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [artwork, onClose])

  if (!artwork) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button ref={closeButtonRef} className="modal__close" type="button" onClick={onClose} aria-label="Cerrar detalle">
          <span aria-hidden="true">x</span>
        </button>
        <div className="modal__image-wrap">
          <img className="modal__image" src={artwork.image} alt={artwork.alt} />
        </div>
        <div className="modal__content">
          <p className="modal__category">{artwork.category}</p>
          <h3 id="modal-title">{artwork.name}</h3>
          <p className="modal__description">{artwork.description}</p>
          <div className="modal__contact">
            <span>Artista o dueño</span>
            <strong>{artwork.artistName || 'Por confirmar'}</strong>
            {artwork.location && <small>{artwork.location}</small>}
          </div>
          <p className="modal__price">{formatPrice(artwork.price)}</p>
          {artwork.whatsapp && (
            <a className="whatsapp-button" href={getWhatsappUrl(artwork)} target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp
            </a>
          )}
          <button className="modal__text-button" type="button" onClick={onClose}>Volver a la colección</button>
        </div>
      </div>
    </div>
  )
}
