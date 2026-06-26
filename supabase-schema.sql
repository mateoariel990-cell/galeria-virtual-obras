create extension if not exists "pgcrypto";

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price integer not null check (price >= 0),
  category text not null check (category in ('Pinturas', 'Carteras', 'Artesanías')),
  image_url text not null,
  artist_name text not null,
  whatsapp text not null,
  location text,
  created_at timestamptz not null default now()
);

alter table public.artworks enable row level security;

create policy "Public artworks are readable"
on public.artworks
for select
to anon
using (true);

create policy "Anon can manage artworks"
on public.artworks
for all
to anon
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('artworks', 'artworks', true)
on conflict (id) do update set public = excluded.public;

create policy "Public artwork images are readable"
on storage.objects
for select
to anon
using (bucket_id = 'artworks');

create policy "Anon can upload artwork images"
on storage.objects
for insert
to anon
with check (bucket_id = 'artworks');

create policy "Anon can update artwork images"
on storage.objects
for update
to anon
using (bucket_id = 'artworks')
with check (bucket_id = 'artworks');

create policy "Anon can delete artwork images"
on storage.objects
for delete
to anon
using (bucket_id = 'artworks');
