-- PedeNaHora — schema Supabase
-- Rode este script inteiro no SQL Editor do seu projeto Supabase.

-- ─────────────────────────────────────────────────────────────
-- Função utilitária para manter updated_at em dia
-- ─────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────────────────────────
-- products
-- ─────────────────────────────────────────────────────────────
create table products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text not null,
  price        numeric(10, 2) not null,
  category     text not null,
  visual_bg    text not null,
  visual_emoji text not null,
  active       boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index products_category_idx on products (category);
create index products_active_sort_idx on products (active, sort_order);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

-- Catálogo público só vê produtos ativos (anon e authenticated, para não
-- esconder produtos de quem estiver logado mas sem vínculo com a loja)
create policy "products_public_select_active"
  on products for select
  to anon, authenticated
  using (active = true);

-- Admin autenticado (Supabase Auth) vê e gerencia tudo
create policy "products_admin_all"
  on products for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────────────────────
-- store_settings (linha única, id fixo = 1)
-- ─────────────────────────────────────────────────────────────
create table store_settings (
  id                          integer primary key default 1,
  store_name                  text not null default 'Lolo Cookies',
  store_description           text not null default 'Cookies artesanais feitos com amor, entregues fresquinhos.',
  slug                        text not null unique default 'loja',
  email                       text not null default '',
  whatsapp_number             text not null default '5585992737489',
  whatsapp_message_template   text not null default '🍪 *Novo Pedido — {{loja}}*

*Itens do pedido:*
{{itens}}

*Subtotal:* {{subtotal}}
*Taxa de entrega:* {{entrega}}
*💰 Total: {{total}}*

*Pagamento:* {{pagamento}}

*📍 Endereço de entrega:*
{{endereco}}',
  free_delivery_threshold     numeric(10, 2) not null default 50,
  delivery_fee                numeric(10, 2) not null default 8.9,
  instagram_url               text not null default '',
  accepts_pix                 boolean not null default true,
  pix_key                     text not null default '',
  accepts_cash                boolean not null default true,
  accepts_card                boolean not null default true,
  updated_at                  timestamptz not null default now(),

  constraint store_settings_single_row check (id = 1)
);

insert into store_settings (id) values (1);

create trigger store_settings_set_updated_at
  before update on store_settings
  for each row execute function set_updated_at();

alter table store_settings enable row level security;

create policy "store_settings_public_select"
  on store_settings for select
  to anon
  using (true);

create policy "store_settings_admin_all"
  on store_settings for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────────────────────
-- business_hour_shifts
-- ─────────────────────────────────────────────────────────────
create table business_hour_shifts (
  id           uuid primary key default gen_random_uuid(),
  day_of_week  integer not null check (day_of_week between 0 and 6),
  open_time    text not null,
  close_time   text not null,
  sort_order   integer not null default 0
);

create index business_hour_shifts_day_sort_idx on business_hour_shifts (day_of_week, sort_order);

alter table business_hour_shifts enable row level security;

create policy "business_hour_shifts_public_select"
  on business_hour_shifts for select
  to anon
  using (true);

create policy "business_hour_shifts_admin_all"
  on business_hour_shifts for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────────────────────
-- Também dê select para o papel "authenticated" nas 3 tabelas
-- (o admin logado precisa ler tudo, incluindo produtos inativos)
-- As policies "_all" acima já cobrem isso (select+insert+update+delete).
-- ─────────────────────────────────────────────────────────────
