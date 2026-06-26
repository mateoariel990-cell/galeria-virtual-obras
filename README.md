# Galería Virtual de Obras

Proyecto independiente creado con React, Vite y TypeScript, preparado para publicar en Netlify sin dominio propio.

## Rutas

- `/`: galería pública.
- `/admin`: panel privado simple para crear, editar y eliminar obras.

## Netlify

Configuración recomendada al importar el proyecto:

- Build command: `npm run build`
- Publish directory: `dist`

El proyecto incluye:

- `netlify.toml`
- `public/_redirects`

El redirect `/* /index.html 200` permite entrar directo a rutas como `/admin`.

## Variables de entorno

Crear estas variables en Netlify:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_PASSWORD=
```

También están documentadas en `.env.example`.

## Supabase

La app usa Supabase para:

- Guardar los datos de las obras en la tabla `artworks`.
- Guardar imágenes en el bucket público `artworks`.

Ejecutá `supabase-schema.sql` en el SQL Editor de Supabase para crear la tabla, el bucket y las políticas necesarias.

Campos principales de cada obra:

- Nombre
- Descripción
- Precio
- Categoría: `Pinturas`, `Carteras`, `Artesanías`
- Imagen
- Nombre del artista o dueño
- WhatsApp individual

El botón de WhatsApp abre:

```text
https://wa.me/NUMERO?text=Hola, estoy interesado/a en la obra: NOMBRE_DE_LA_OBRA
```

## Admin

El panel usa una sola contraseña:

- Se compara contra `VITE_ADMIN_PASSWORD`.
- La sesión se guarda en `sessionStorage`.
- Incluye botón para cerrar sesión.

Este modelo es simple y práctico para una galería chica. Para datos sensibles o varios administradores conviene migrar luego a Supabase Auth.

## Desarrollo local

```bash
npm install
npm run dev
```

Para probar producción:

```bash
npm run build
npm run preview
```
