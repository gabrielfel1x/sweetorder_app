-- SweetOrder — migração para multi-tenant (múltiplas lojas por slug)
-- Rode este script inteiro no SQL Editor do seu projeto Supabase, DEPOIS do schema.sql original.
-- Ele cria a tabela `stores` (substituindo o singleton `store_settings`), a tabela de vínculo
-- `store_admins` (cada admin autenticado só enxerga/gerencia a própria loja) e adiciona `store_id`
-- em `products` e `business_hour_shifts`. Ao final, migra os dados existentes automaticamente.
--
-- Este script é seguro de rodar de novo do zero (idempotente): se uma tentativa anterior
-- falhou no meio do caminho, as duas linhas abaixo desfazem o que já tinha sido criado.

drop table if exists store_admins cascade;
drop table if exists stores cascade;

-- ─────────────────────────────────────────────────────────────
-- stores (substitui store_settings)
-- ─────────────────────────────────────────────────────────────
create table stores (
  id                          uuid primary key default gen_random_uuid(),
  store_name                  text not null,
  store_description           text not null,
  slug                        text not null unique,
  email                       text not null default '',
  whatsapp_number             text not null default '',
  whatsapp_message_template   text not null default '',
  free_delivery_threshold     numeric(10, 2) not null default 50,
  delivery_fee                numeric(10, 2) not null default 8.9,
  instagram_url               text not null default '',
  accepts_pix                 boolean not null default true,
  pix_key                     text not null default '',
  accepts_cash                boolean not null default true,
  accepts_card                boolean not null default true,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index stores_slug_idx on stores (slug);

create trigger stores_set_updated_at
  before update on stores
  for each row execute function set_updated_at();

alter table stores enable row level security;

-- ─────────────────────────────────────────────────────────────
-- store_admins (vínculo 1 admin → 1 loja) — precisa existir antes das
-- policies de `stores` que a referenciam
-- ─────────────────────────────────────────────────────────────
create table store_admins (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references stores(id) on delete cascade,
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index store_admins_store_id_idx on store_admins (store_id);

alter table store_admins enable row level security;

create policy "store_admins_self_select"
  on store_admins for select
  to authenticated
  using (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- policies de stores (agora que store_admins já existe)
-- ─────────────────────────────────────────────────────────────

-- Home (grid de lojas) e catálogo público precisam ler todas as lojas
create policy "stores_public_select"
  on stores for select
  to anon, authenticated
  using (true);

-- Um admin só pode alterar a(s) loja(s) às quais está vinculado em store_admins
create policy "stores_admin_update"
  on stores for update
  to authenticated
  using (exists (select 1 from store_admins sa where sa.store_id = stores.id and sa.user_id = auth.uid()))
  with check (exists (select 1 from store_admins sa where sa.store_id = stores.id and sa.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- products — adiciona store_id
-- ─────────────────────────────────────────────────────────────
alter table products add column if not exists store_id uuid references stores(id) on delete cascade;

drop policy if exists "products_admin_all" on products;
create policy "products_admin_all"
  on products for all
  to authenticated
  using (exists (select 1 from store_admins sa where sa.store_id = products.store_id and sa.user_id = auth.uid()))
  with check (exists (select 1 from store_admins sa where sa.store_id = products.store_id and sa.user_id = auth.uid()));
-- "products_public_select_active" (select ativo, sem distinção de loja) permanece igual —
-- o app já filtra por store_id na query, então não há vazamento entre lojas.

-- ─────────────────────────────────────────────────────────────
-- business_hour_shifts — adiciona store_id
-- ─────────────────────────────────────────────────────────────
alter table business_hour_shifts add column if not exists store_id uuid references stores(id) on delete cascade;

drop policy if exists "business_hour_shifts_admin_all" on business_hour_shifts;
create policy "business_hour_shifts_admin_all"
  on business_hour_shifts for all
  to authenticated
  using (exists (select 1 from store_admins sa where sa.store_id = business_hour_shifts.store_id and sa.user_id = auth.uid()))
  with check (exists (select 1 from store_admins sa where sa.store_id = business_hour_shifts.store_id and sa.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Migração de dados: cria a primeira loja a partir do store_settings singleton,
-- vincula produtos/horários existentes a ela e dá acesso a todos os usuários
-- autenticados hoje existentes (ajuste a critério, se tiver mais de um admin).
-- ─────────────────────────────────────────────────────────────
do $$
declare
  new_store_id uuid;
begin
  insert into stores (
    store_name, store_description, slug, email, whatsapp_number,
    whatsapp_message_template, free_delivery_threshold, delivery_fee,
    instagram_url, accepts_pix, pix_key, accepts_cash, accepts_card
  )
  select
    store_name, store_description, slug, email, whatsapp_number,
    whatsapp_message_template, free_delivery_threshold, delivery_fee,
    instagram_url, accepts_pix, pix_key, accepts_cash, accepts_card
  from store_settings
  where id = 1
  returning id into new_store_id;

  update products set store_id = new_store_id where store_id is null;
  update business_hour_shifts set store_id = new_store_id where store_id is null;

  insert into store_admins (store_id, user_id)
  select new_store_id, u.id
  from auth.users u
  on conflict (user_id) do nothing;
end $$;

-- Agora que os dados existentes já têm store_id, torna a coluna obrigatória
alter table products alter column store_id set not null;
alter table business_hour_shifts alter column store_id set not null;

create index if not exists products_store_id_idx on products (store_id);
create index if not exists business_hour_shifts_store_id_idx on business_hour_shifts (store_id);

-- ─────────────────────────────────────────────────────────────
-- Por último, remova a tabela antiga (só depois de confirmar que tudo migrou bem).
-- Descomente e rode separadamente quando tiver validado o app:
-- drop table store_settings;
-- ─────────────────────────────────────────────────────────────
