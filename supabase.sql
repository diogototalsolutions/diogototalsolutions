-- DTS schema + RLS
create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  description text not null,
  status text not null default 'active' check (status in ('active','paused','done')),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  consent boolean not null default false,
  status text not null default 'novo' check (status in ('novo','em_analise','contactado','fechado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;
alter table public.services enable row level security;
alter table public.quote_requests enable row level security;

-- Apenas admin autenticado (como há 1 único user auth) lê/escreve entidades privadas
create policy "clients admin only" on public.clients
for all to authenticated using (true) with check (true);

create policy "services admin only" on public.services
for all to authenticated using (true) with check (true);

-- quote_requests: insert anónimo permitido, leitura/escrita apenas admin autenticado
create policy "quote public insert" on public.quote_requests
for insert to anon with check (true);

create policy "quote admin read" on public.quote_requests
for select to authenticated using (true);

create policy "quote admin update" on public.quote_requests
for update to authenticated using (true) with check (true);

create policy "quote admin delete" on public.quote_requests
for delete to authenticated using (true);
