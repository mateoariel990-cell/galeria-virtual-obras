import { useState } from 'react'
import { ArtworkModal } from '../components/ArtworkModal'
import { CategorySection } from '../components/CategorySection'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { useArtworks } from '../hooks/useArtworks'
import { ARTWORK_CATEGORIES, type Artwork } from '../types/artwork'

export function HomePage() {
  const { artworks, isLoading, error } = useArtworks()
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const populatedCategories = ARTWORK_CATEGORIES.filter((category) =>
    artworks.some((artwork) => artwork.category === category),
  )

  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <section className="gallery-section" id="coleccion" aria-labelledby="gallery-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Colección seleccionada</p>
                <h2 id="gallery-title">Obras que guardan un oficio</h2>
              </div>
              <p>Cada pieza fue creada con tiempo, intención y manos expertas.</p>
            </div>

            {isLoading ? (
              <p className="empty-state">Cargando obras...</p>
            ) : error ? (
              <p className="empty-state">{error}</p>
            ) : populatedCategories.length > 0 ? (
              <div className="category-list">
                {populatedCategories.map((category) => (
                  <CategorySection
                    key={category}
                    category={category}
                    artworks={artworks.filter((artwork) => artwork.category === category)}
                    onOpen={setSelectedArtwork}
                  />
                ))}
              </div>
            ) : (
              <p className="empty-state">Todavía no hay obras cargadas.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </div>
  )
}
