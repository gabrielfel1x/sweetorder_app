-- Permite que uma loja não ofereça entrega, só retirada no local. Aplicado
-- inicialmente só na Memory Fragrances, a pedido da Patricia.
alter table stores add column if not exists accepts_delivery boolean not null default true;

-- Pedidos de retirada não têm endereço.
alter table orders alter column address drop not null;

update stores set accepts_delivery = false where slug = 'memory-fragrances';
