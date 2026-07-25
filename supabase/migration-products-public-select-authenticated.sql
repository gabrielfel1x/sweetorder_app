-- Bug: catálogo público de uma loja aparecia vazio no celular quando havia
-- uma sessão logada (ex: admin de outra loja, ou sessão antiga não expirada)
-- sem vínculo administrativo com aquela loja específica.
--
-- A policy "products_public_select_active" só liberava leitura para o role
-- "anon". Sessões "authenticated" sem vínculo em store_admins/super_admins
-- caíam fora de todas as policies de select e o RLS zerava os produtos,
-- sem erro nenhum — só voltava a funcionar depois de logar como admin
-- daquela loja. Libera a mesma leitura pública também para "authenticated".
drop policy if exists "products_public_select_active" on products;
create policy "products_public_select_active"
  on products for select
  to anon, authenticated
  using (active = true);
