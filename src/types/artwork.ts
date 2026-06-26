export const ARTWORK_CATEGORIES = [
  'Pinturas',
  'Carteras',
  'Artesanías',
] as const

export type ArtworkCategory = (typeof ARTWORK_CATEGORIES)[number]

export type Artwork = {
  id: string
  name: string
  description: string
  price: number
  category: ArtworkCategory
  image: string
  alt: string
  artistName: string
  whatsapp: string
  location?: string
}

export type ArtworkInput = Omit<Artwork, 'id' | 'alt'> & {
  imageFile?: File | null
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    maximumFractionDigits: 0,
  }).format(price)

export const getWhatsappUrl = (artwork: Artwork) => {
  const message = `Hola, estoy interesado/a en la obra: ${artwork.name}`
  return `https://wa.me/${artwork.whatsapp}?text=${encodeURIComponent(message)}`
}
