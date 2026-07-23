-- Permite que uma loja habilite "preço no cartão" parcelado nos produtos,
-- separado do preço normal (que passa a representar o preço no Pix quando
-- o parcelamento está ativo). Aplicado inicialmente só na Memory Fragrances.
alter table stores add column if not exists accepts_installments boolean not null default false;
alter table products add column if not exists card_price numeric(10, 2);
alter table products add column if not exists installments integer;

update stores set accepts_installments = true where slug = 'memory-fragrances';
