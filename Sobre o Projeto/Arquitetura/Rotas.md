# Mapa de Rotas — Norte Tecnologia ERP

Todas as rotas (exceto `/login`) exigem autenticação via Supabase Auth.
O middleware redireciona para `/login` qualquer acesso não autenticado.

---

## Rotas públicas

| Rota | Descrição |
|------|-----------|
| `/login` | Tela de autenticação |

---

## Rotas protegidas

| Rota | Descrição |
|------|-----------|
| `/` | Redireciona para `/dashboard` |
| `/dashboard` | Visão geral: vendas do dia, OS abertas, estoque crítico |
| `/clientes` | Listagem e busca de clientes |
| `/clientes/novo` | Cadastro de novo cliente |
| `/clientes/[id]` | Detalhes do cliente (histórico de OS e vendas) |
| `/clientes/[id]/editar` | Edição de cliente |
| `/produtos` | Listagem de produtos e serviços com estoque |
| `/produtos/novo` | Cadastro de produto/serviço |
| `/produtos/[id]/editar` | Edição de produto/serviço |
| `/estoque` | Visão geral de estoque: alertas, sem SKU, sem imagem |
| `/os` | Listagem de Ordens de Serviço |
| `/os/nova` | Criação de nova OS |
| `/os/[id]` | Detalhes da OS |
| `/os/[id]/editar` | Edição da OS |
| `/os/[id]/imprimir` | Impressão da OS (com ou sem valores) |
| `/pdv` | Ponto de Venda |
| `/pdv/[id]/recibo` | Impressão de recibo de venda |
| `/configuracoes` | Configurações do ERP (somente leitura por enquanto) |

---

## Server Actions

| Action | Rota | Descrição |
|--------|------|-----------|
| `loginAction` | `/login/actions.ts` | Autenticação com rate limiting |
| `logoutAction` | `/login/actions.ts` | Encerramento de sessão |
| `createCustomer` | `/clientes/actions.ts` | Criar cliente |
| `updateCustomer` | `/clientes/actions.ts` | Editar cliente |
| `deleteCustomer` | `/clientes/actions.ts` | Excluir cliente |
| `createProduct` | `/produtos/actions.ts` | Criar produto (reutiliza lógica do site) |
| `updateProduct` | `/produtos/actions.ts` | Editar produto |
| `adjustStock` | `/estoque/actions.ts` | Ajuste manual de estoque |
| `createServiceOrder` | `/os/actions.ts` | Criar OS |
| `updateServiceOrder` | `/os/actions.ts` | Editar OS |
| `updateOSStatus` | `/os/actions.ts` | Mudar status da OS |
| `createSale` | `/pdv/actions.ts` | Finalizar venda PDV com baixa de estoque |

---

## Middleware

O middleware (`src/middleware.ts`) protege todas as rotas exceto `/login`:

```
matcher: ["/((?!login|_next/static|_next/image|favicon|manifest|sw|icons).*)"]
```
