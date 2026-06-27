import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { ARTWORK_CATEGORIES, type Artwork, type ArtworkCategory, type ArtworkInput } from '../types/artwork'
import { formatPriceInput, parsePriceInput } from '../utils/price'

type ArtworkFormProps = {
  artwork: Artwork | null
  isSaving: boolean
  onSave: (input: ArtworkInput) => Promise<void>
  onCancel: () => void
}

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Pinturas' as ArtworkCategory,
  image: '',
  artistName: '',
  whatsapp: '',
  location: '',
  imageFile: null as File | null,
}

export function ArtworkForm({ artwork, isSaving, onSave, onCancel }: ArtworkFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [fileKey, setFileKey] = useState(0)
  const previewUrl = useMemo(() => {
    if (!form.imageFile) return form.image
    return URL.createObjectURL(form.imageFile)
  }, [form.image, form.imageFile])

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (artwork) {
      setForm({
        name: artwork.name,
        description: artwork.description,
        price: formatPriceInput(artwork.price),
        category: artwork.category,
        image: artwork.image,
        artistName: artwork.artistName,
        whatsapp: artwork.whatsapp,
        location: artwork.location ?? '',
        imageFile: null,
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
    setFileKey((key) => key + 1)
  }, [artwork])

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Elegí un archivo de imagen válido.')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 4 MB.')
      return
    }

    setForm((current) => ({ ...current, imageFile: file }))
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const price = parsePriceInput(form.price)
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      (!form.image && !form.imageFile) ||
      !form.artistName.trim() ||
      !form.whatsapp.trim() ||
      price <= 0
    ) {
      setError('Completá todos los campos antes de guardar la obra.')
      return
    }

    if (!/^[1-9]\d{7,14}$/.test(form.whatsapp)) {
      setError('Ingresá un WhatsApp válido, solo con números y código de país.')
      return
    }

    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        image: form.image,
        imageFile: form.imageFile,
        artistName: form.artistName.trim(),
        whatsapp: form.whatsapp,
        location: form.location.trim(),
      })
      setForm(emptyForm)
      setFileKey((key) => key + 1)
      setError('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo guardar la obra.')
    }
  }

  return (
    <form className="artwork-form" onSubmit={handleSubmit}>
      <label className="image-upload">
        <input key={fileKey} type="file" accept="image/*" onChange={handleImage} disabled={isSaving} />
        {previewUrl ? (
          <img src={previewUrl} alt="Vista previa de la obra" />
        ) : (
          <span><strong>Subir fotografía</strong><small>JPG, PNG o WEBP · máximo 4 MB</small></span>
        )}
      </label>

      <label className="field">
        <span>Nombre de la obra</span>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Ej. Paisaje del sur"
          disabled={isSaving}
          required
        />
      </label>

      <label className="field">
        <span>Descripción</span>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Contá brevemente la historia y técnica de la pieza"
          rows={4}
          disabled={isSaving}
          required
        />
      </label>

      <div className="form-section-label">
        <span>Contacto de esta obra</span>
        <small>Cada pieza puede dirigir a una persona diferente.</small>
      </div>

      <label className="field">
        <span>Nombre del artista o dueño</span>
        <input
          type="text"
          value={form.artistName}
          onChange={(event) => setForm({ ...form, artistName: event.target.value })}
          placeholder="Ej. María González"
          disabled={isSaving}
          required
        />
      </label>

      <label className="field">
        <span>Número de WhatsApp</span>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[1-9][0-9]{7,14}"
          value={form.whatsapp}
          onChange={(event) => setForm({ ...form, whatsapp: event.target.value })}
          placeholder="595981123456"
          disabled={isSaving}
          required
          aria-describedby="whatsapp-help"
        />
        <small className="field__help" id="whatsapp-help">
          Ingresá el número con código de país, sin + ni espacios. Ejemplo: 595981123456
        </small>
      </label>

      <label className="field">
        <span>Ciudad o zona <em>Opcional</em></span>
        <input
          type="text"
          value={form.location}
          onChange={(event) => setForm({ ...form, location: event.target.value })}
          placeholder="Ej. Villarrica"
          disabled={isSaving}
        />
      </label>

      <div className="form-row">
        <label className="field">
          <span>Precio en guaraníes</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: formatPriceInput(event.target.value) })}
            placeholder="Ej: 250.000"
            disabled={isSaving}
            required
          />
        </label>
        <label className="field">
          <span>Categoría</span>
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value as ArtworkCategory })}
            disabled={isSaving}
          >
            {ARTWORK_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
      </div>

      {error && <p className="form-message form-message--error" role="alert">{error}</p>}

      <div className="form-actions">
        <button className="button button--primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Guardando...' : artwork ? 'Guardar cambios' : 'Publicar obra'}
        </button>
        {artwork && (
          <button className="button button--secondary" type="button" onClick={onCancel} disabled={isSaving}>Cancelar</button>
        )}
      </div>
    </form>
  )
}
