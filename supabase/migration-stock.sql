-- Controle opcional de estoque diário por produto. null = sem controle,
-- produto sempre disponível (comportamento atual). Quando definido,
-- representa a quantidade disponível hoje; é decrementado atomicamente a
-- cada pedido. Ao chegar em 0 o produto fica "Esgotado" até o admin
-- atualizar manualmente (sem reset automático).
alter table products add column if not exists stock_quantity integer;

alter table products add constraint products_stock_quantity_nonneg
  check (stock_quantity is null or stock_quantity >= 0);

-- Decremento atômico em lote: recebe um jsonb [{productId, quantity}, ...]
-- e desconta tudo numa única transação (a função inteira roda em uma
-- transação implícita). Produtos sem controle de estoque (stock_quantity
-- null) são ignorados (case no-op). Se algum item com controle não tiver
-- estoque suficiente, a função lança exceção e TUDO é revertido
-- automaticamente — nenhum produto do carrinho fica parcialmente
-- descontado.
create or replace function decrement_products_stock(p_items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item record;
  updated_stock integer;
begin
  for item in select (elem->>'productId')::uuid as product_id,
                     (elem->>'quantity')::integer as quantity
              from jsonb_array_elements(p_items) as elem
  loop
    update products
      set stock_quantity = case
        when stock_quantity is null then stock_quantity
        else stock_quantity - item.quantity
      end
      where id = item.product_id
        and (stock_quantity is null or stock_quantity >= item.quantity)
      returning stock_quantity into updated_stock;

    if not found then
      raise exception 'out_of_stock:%', item.product_id;
    end if;
  end loop;
end;
$$;
