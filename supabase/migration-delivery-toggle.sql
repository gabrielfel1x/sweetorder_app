-- Permite que uma loja não ofereça entrega, só retirada no local (sem
-- endereço). NÃO é para "entrega grátis" — isso é feito zerando delivery_fee,
-- mantendo accepts_delivery = true e o endereço no checkout.
alter table stores add column if not exists accepts_delivery boolean not null default true;

-- Pedidos de retirada não têm endereço.
alter table orders alter column address drop not null;

-- A Memory Fragrances entrega normalmente, só sem cobrar taxa (delivery_fee = 0),
-- então accepts_delivery permanece true (default). Não rodar um update aqui
-- para false a menos que a loja realmente pare de fazer entregas.
