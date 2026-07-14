-- SweetOrder — painel SaaS (super admin)
-- Rode DEPOIS de migration-multitenant.sql e migration-signup-policies.sql.
-- Cria a tabela `super_admins` (donos do SaaS, com acesso a todas as lojas) e estende as
-- policies de RLS existentes para que quem estiver nessa tabela enxergue/gerencie tudo.

create table super_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table super_admins enable row level security;

-- Um super admin só consegue ler a própria linha (evita expor a lista de super admins
-- via API; a checagem de "sou super admin?" usa exists(), não select direto da tabela toda).
create policy "super_admins_self_select"
  on super_admins for select
  to authenticated
  using (user_id = auth.uid());

-- Sem policy de insert/update/delete: a única forma de adicionar um super admin é rodar
-- o insert manualmente pelo SQL Editor do Supabase (bootstrap deliberadamente fora da API).

-- ─────────────────────────────────────────────────────────────
-- stores — super admin pode ver e gerenciar todas as lojas
-- ─────────────────────────────────────────────────────────────
create policy "stores_super_admin_all"
  on stores for all
  to authenticated
  using (exists (select 1 from super_admins sa where sa.user_id = auth.uid()))
  with check (exists (select 1 from super_admins sa where sa.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- store_admins — super admin pode ver todos os vínculos loja↔admin
-- ─────────────────────────────────────────────────────────────
create policy "store_admins_super_admin_all"
  on store_admins for all
  to authenticated
  using (exists (select 1 from super_admins sa where sa.user_id = auth.uid()))
  with check (exists (select 1 from super_admins sa where sa.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- products — super admin pode ver/gerenciar produtos de qualquer loja
-- ─────────────────────────────────────────────────────────────
create policy "products_super_admin_all"
  on products for all
  to authenticated
  using (exists (select 1 from super_admins sa where sa.user_id = auth.uid()))
  with check (exists (select 1 from super_admins sa where sa.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- business_hour_shifts — idem
-- ─────────────────────────────────────────────────────────────
create policy "business_hour_shifts_super_admin_all"
  on business_hour_shifts for all
  to authenticated
  using (exists (select 1 from super_admins sa where sa.user_id = auth.uid()))
  with check (exists (select 1 from super_admins sa where sa.user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Bootstrap: torne você mesmo o primeiro super admin rodando o comando abaixo
-- (troque o e-mail pelo seu e-mail de login no painel).
-- ─────────────────────────────────────────────────────────────
insert into super_admins (user_id)
select id
from auth.users
where email = 'gabriel@lolocokies.com';
