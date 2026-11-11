-- Migration: erp_006_schema_fixes
-- Corrige inconsistências entre as migrations e o código da aplicação.
-- SAFE: todas as operações usam IF EXISTS / IF NOT EXISTS.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. erp_service_orders: adicionar coluna images (foi adicionada manualmente antes)
--    Se já existir, o IF NOT EXISTS garante que não falha.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE erp_service_orders
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. erp_pdv_sales: adicionar coluna notes (declarada no tipo TypeScript mas
--    ausente na migration erp_003)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE erp_pdv_sales
  ADD COLUMN IF NOT EXISTS notes text;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. products: remover colunas erradas criadas pela migration erp_003
--    erp_003 adicionou 'stock_quantity' e 'active' por engano.
--    O código correto usa 'stock' e 'is_active' (nomes do site e-commerce).
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;
ALTER TABLE products DROP COLUMN IF EXISTS active;
