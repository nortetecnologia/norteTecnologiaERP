# Banco de Dados — Norte Tecnologia ERP

O ERP compartilha o mesmo projeto Supabase do site de e-commerce.

---

## Tabelas compartilhadas com o site

| Tabela | Uso no ERP |
|--------|-----------|
| `products` | Cadastro, edição, controle de estoque |
| `categories` | Categorias de produtos |
| `subcategories` | Subcategorias de produtos |
| `store_settings` | Formas de pagamento usadas no PDV |
| `product_reviews` | Visualização no ERP (somente leitura) |

---

## Tabelas exclusivas do ERP (prefixo `erp_`)

### `erp_customers`
Cadastro de clientes.

```sql
id          UUID PRIMARY KEY
name        TEXT NOT NULL
phone       TEXT
email       TEXT
cpf_cnpj    TEXT
address     TEXT
city        TEXT
notes       TEXT
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

### `erp_service_orders`
Ordens de Serviço.

```sql
id              UUID PRIMARY KEY
number          SERIAL UNIQUE         -- NT-00001, NT-00002...
customer_id     UUID → erp_customers
title           TEXT NOT NULL         -- resumo do problema
description     TEXT                  -- descrição detalhada
status          TEXT                  -- awaiting|in_progress|done|delivered|cancelled
equipment       TEXT                  -- equipamento (ex: "Notebook Dell Inspiron 15")
serial_number   TEXT
labor_cost      NUMERIC(10,2)
discount        NUMERIC(10,2)
notes           TEXT                  -- observações internas
estimated_at    DATE                  -- previsão de entrega
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### `erp_service_order_items`
Itens de cada OS (peças usadas ou serviços cobrados).

```sql
id               UUID PRIMARY KEY
service_order_id UUID → erp_service_orders
product_id       UUID → products       -- NULL se item avulso
description      TEXT NOT NULL         -- nome do item ou serviço
quantity         NUMERIC(10,3)
unit_price       NUMERIC(10,2)
created_at       TIMESTAMPTZ
```

### `erp_pdv_sales`
Vendas realizadas no PDV.

```sql
id           UUID PRIMARY KEY
sale_number  SERIAL UNIQUE
customer_id  UUID → erp_customers    -- opcional
subtotal     NUMERIC(10,2)
discount     NUMERIC(10,2)
total        NUMERIC(10,2)
notes        TEXT
created_at   TIMESTAMPTZ
```

### `erp_pdv_sale_items`
Itens de cada venda PDV.

```sql
id          UUID PRIMARY KEY
sale_id     UUID → erp_pdv_sales
product_id  UUID → products
description TEXT NOT NULL
quantity    NUMERIC(10,3)
unit_price  NUMERIC(10,2)
subtotal    NUMERIC(10,2)
created_at  TIMESTAMPTZ
```

### `erp_pdv_sale_payments`
Formas de pagamento de cada venda (pode haver múltiplas por venda).

```sql
id         UUID PRIMARY KEY
sale_id    UUID → erp_pdv_sales
method     TEXT NOT NULL     -- Dinheiro, PIX, Cartão de Crédito...
amount     NUMERIC(10,2)
created_at TIMESTAMPTZ
```

### `erp_stock_movements`
Histórico de movimentações de estoque.

```sql
id          UUID PRIMARY KEY
product_id  UUID → products
type        TEXT           -- in|out|adjustment
quantity    INTEGER
reason      TEXT           -- Venda PDV, OS, Ajuste manual, Entrada...
reference   TEXT           -- ID da venda ou OS relacionada
created_at  TIMESTAMPTZ
```

---

## RLS (Row Level Security)

Todas as tabelas `erp_*` têm RLS habilitado:
- **SELECT, INSERT, UPDATE, DELETE:** somente `auth.role() = 'authenticated'`
- Nenhum acesso público (anon)

---

## Migrations

Aplicar no Supabase SQL Editor na ordem:
1. `supabase/migrations/erp_001_customers.sql`
2. `supabase/migrations/erp_002_service_orders.sql`
3. `supabase/migrations/erp_003_pdv.sql`
