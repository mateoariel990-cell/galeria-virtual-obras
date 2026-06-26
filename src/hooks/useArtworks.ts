import { useCallback, useEffect, useState } from 'react'
import {
  createArtwork,
  fetchArtworks,
  removeArtwork,
  saveArtwork,
} from '../services/artworks'
import type { Artwork, ArtworkInput } from '../types/artwork'

export function useArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reloadArtworks = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      setArtworks(await fetchArtworks())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudieron cargar las obras.')
      setArtworks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void reloadArtworks()
  }, [reloadArtworks])

  const addArtwork = useCallback(async (input: ArtworkInput) => {
    const artwork = await createArtwork(input)
    setArtworks((current) => [artwork, ...current])
  }, [])

  const updateArtwork = useCallback(async (id: string, input: ArtworkInput) => {
    const artwork = await saveArtwork(id, input)
    setArtworks((current) => current.map((item) => (item.id === id ? artwork : item)))
  }, [])

  const deleteArtwork = useCallback(async (id: string) => {
    await removeArtwork(id)
    setArtworks((current) => current.filter((artwork) => artwork.id !== id))
  }, [])

  return {
    artworks,
    isLoading,
    error,
    reloadArtworks,
    addArtwork,
    updateArtwork,
    deleteArtwork,
  }
}
