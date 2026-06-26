import { formatPrice, getWhatsappUrl, type Artwork } from '../types/artwork'

type ArtworkCardProps = {
  artwork: Artwork
  onOpen: (artwork: Artwork) => void
}

export function ArtworkCard({ artwork, onOpen }: ArtworkCardProps) {
  return (
    <article className="artwork-card">
      <button
        className="artwork-card__button artwork-card__button--image"
        type="button"
        onClick={() => onOpen(artwork)}
        aria-label={`Ampliar ${artwork.name}`}
      >
        <span className="artwork-card__image-wrap">
          <img className="artwork-card__image" src={artwork.image} alt={artwork.alt} loading="lazy" />
          <span className="artwork-card__hint" aria-hidden="true">Ver obra</span>
        </span>
      </button>

      <div className="artwork-card__info">
        <span className="artwork-card__category">{artwork.category}</span>
        <button className="artwork-card__title-button" type="button" onClick={() => onOpen(artwork)}>
          {artwork.name}
        </button>
        <p className="artwork-card__description">{artwork.description}</p>
        <p className="artwork-card__artist">Por {artwork.artistName || 'Artista por confirmar'}</p>
        <p className="artwork-card__price">{formatPrice(artwork.price)}</p>
        {artwork.whatsapp && (
          <a className="whatsapp-button" href={getWhatsappUrl(artwork)} target="_blank" rel="noopener noreferrer">
            Consultar por WhatsApp
          </a>
        )}
      </div>
    </article>
  )
}
