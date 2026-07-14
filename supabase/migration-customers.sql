-- SweetOrder — clientes e endereços salvos ("login discreto" por telefone no checkout)
-- Rode DEPOIS de migration-multitenant.sql.
--
-- Nome/telefone/endereço são mais sensíveis que os dados já públicos (produtos, nome da
-- loja), então aqui NÃO abrimos policies de RLS para `anon`/`authenticated` — isso
-- exporia a tabela inteira via REST API a qualquer um. Todo acesso passa exclusivamente
-- pelas Server Actions do checkout usando a service role key (lib/supabase/admin.ts).

create table customers (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references stores(id) on delete cascade,
  name        text not null,
  phone       text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (store_id, phone)
);

create index customers_store_id_idx on customers (store_id);

create trigger customers_set_updated_at
  before update on customers
  for each row execute function set_updated_at();

alter table customers enable row level security;
-- Sem policies: só o service role acessa.

create table customer_addresses (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references customers(id) on delete cascade,
  cep           text not null,
  street        text not null,
  number        text not null,
  complement    text not null default '',
  neighborhood  text not null,
  city          text not null,
  state         text not null,
  created_at    timestamptz not null default now()
);

create index customer_addresses_customer_id_idx on customer_addresses (customer_id);

alter table customer_addresses enable row level security;
-- Sem policies: só o service role acessa.
