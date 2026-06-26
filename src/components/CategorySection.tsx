import type { Artwork, ArtworkCategory } from '../types/artwork'
import { ArtworkCard } from './ArtworkCard'

type CategorySectionProps = {
  category: ArtworkCategory
  artworks: Artwork[]
  onOpen: (artwork: Artwork) => void
}

export function CategorySection({ category, artworks, onOpen }: CategorySectionProps) {
  return (
    <section className="category-section" aria-labelledby={`category-${category}`}>
      <div className="category-section__heading">
        <h3 id={`category-${category}`}>{category}</h3>
        <span>{artworks.length.toString().padStart(2, '0')}</span>
      </div>
      <div className="gallery-grid">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
