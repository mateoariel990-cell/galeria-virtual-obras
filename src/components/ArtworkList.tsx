import type { Artwork } from '../types/artwork'
import { formatPrice } from '../utils/price'

type ArtworkListProps = {
  artworks: Artwork[]
  onEdit: (artwork: Artwork) => void
  onDelete: (artwork: Artwork) => void
}

export function ArtworkList({ artworks, onEdit, onDelete }: ArtworkListProps) {
  if (artworks.length === 0) return <p className="empty-state">No hay obras cargadas.</p>

  return (
    <div className="artwork-list">
      {artworks.map((artwork) => (
        <article className="artwork-list__item" key={artwork.id}>
          <img src={artwork.image} alt="" />
          <div className="artwork-list__content">
            <span>{artwork.category}</span>
            <h3>{artwork.name}</h3>
            <p>{formatPrice(artwork.price)}</p>
            <p className="artwork-list__contact">
              {artwork.artistName || 'Sin artista'} · {artwork.whatsapp || 'Sin WhatsApp'}
            </p>
          </div>
          <div className="artwork-list__actions">
            <button type="button" onClick={() => onEdit(artwork)}>Editar</button>
            <button className="danger-link" type="button" onClick={() => onDelete(artwork)}>Eliminar</button>
          </div>
        </article>
      ))}
    </div>
  )
}
