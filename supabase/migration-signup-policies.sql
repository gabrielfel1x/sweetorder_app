-- SweetOrder — policies necessárias para o cadastro público de lojas (/cadastro)
-- Rode DEPOIS de confirmar que supabase/migration-multitenant.sql já rodou com sucesso.

-- Qualquer usuário autenticado (recém-cadastrado) pode criar uma loja.
create policy "stores_insert_authenticated"
  on stores for insert
  to authenticated
  with check (true);

-- Um usuário só pode se auto-vincular como admin de uma loja que AINDA não tem
-- nenhum admin (evita que alguém se anexe à loja de outra pessoa).
create policy "store_admins_self_insert"
  on store_admins for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and not exists (select 1 from store_admins sa2 where sa2.store_id = store_admins.store_id)
  );
