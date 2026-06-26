import { supabase } from '../lib/supabase'
import type { Artwork, ArtworkCategory, ArtworkInput } from '../types/artwork'

const TABLE_NAME = 'artworks'
const BUCKET_NAME = 'artworks'

type ArtworkRow = {
  id: string
  name: string
  description: string
  price: number
  category: ArtworkCategory
  image_url: string
  artist_name: string
  whatsapp: string
  location: string | null
  created_at: string
}

const toArtwork = (row: ArtworkRow): Artwork => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  category: row.category,
  image: row.image_url,
  alt: row.name,
  artistName: row.artist_name,
  whatsapp: row.whatsapp,
  location: row.location ?? '',
})

const toRow = (input: ArtworkInput, imageUrl: string) => ({
  name: input.name,
  description: input.description,
  price: input.price,
  category: input.category,
  image_url: imageUrl,
  artist_name: input.artistName,
  whatsapp: input.whatsapp,
  location: input.location || null,
})

const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Configurá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Netlify.')
  }
  return supabase
}

export async function fetchArtworks() {
  const client = requireSupabase()
  const { data, error } = await client
    .from(TABLE_NAME)
    .select('id,name,description,price,category,image_url,artist_name,whatsapp,location,created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading artworks:', error)
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => toArtwork(row as ArtworkRow))
}

export async function uploadArtworkImage(file: File) {
  const client = requireSupabase()
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${crypto.randomUUID()}.${extension}`

  const { error } = await client.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
    })

  if (error) throw error

  const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(path)
  return data.publicUrl
}

export async function createArtwork(input: ArtworkInput) {
  const client = requireSupabase()
  const imageUrl = input.imageFile ? await uploadArtworkImage(input.imageFile) : input.image
  const { data, error } = await client
    .from(TABLE_NAME)
    .insert(toRow(input, imageUrl))
    .select('id,name,description,price,category,image_url,artist_name,whatsapp,location,created_at')
    .single()

  if (error) throw error
  return toArtwork(data as ArtworkRow)
}

export async function saveArtwork(id: string, input: ArtworkInput) {
  const client = requireSupabase()
  const imageUrl = input.imageFile ? await uploadArtworkImage(input.imageFile) : input.image
  const { data, error } = await client
    .from(TABLE_NAME)
    .update(toRow(input, imageUrl))
    .eq('id', id)
    .select('id,name,description,price,category,image_url,artist_name,whatsapp,location,created_at')
    .single()

  if (error) throw error
  return toArtwork(data as ArtworkRow)
}

export async function removeArtwork(id: string) {
  const client = requireSupabase()
  const { error } = await client.from(TABLE_NAME).delete().eq('id', id)
  if (error) throw error
}
