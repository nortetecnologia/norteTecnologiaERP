# Diário de Desenvolvimento — Norte Tecnologia ERP

> Registro contínuo das implementações, decisões, pendências e próximas etapas do projeto.
>
> **Regra:** consultar este documento antes de iniciar qualquer tarefa e atualizá-lo após cada etapa relevante.

---

## 1. Estado atual do projeto

- **Estágio:** Sistema em produção. Todos os módulos da Fase 1 implementados e funcionando.
- **URL de produção:** `https://norte-tecnologia-sistema.vercel.app`
- **Última atividade:** 2026-11-10 — Correção de nomes de colunas (produtos/PDV), configurações completas com formas de pagamento, validação CPF/CNPJ.
- **Situação geral:** Sistema operacional. Migrations aplicadas no Supabase. Cloudinary integrado. Upload de imagens nas OS funcionando. Autenticação por `app_metadata.erp_role`. Banco de dados compartilhado com o site — colunas corretas: `is_active`, `stock`, `primary_image_url`.
- **Próxima etapa:** Fase 2 — Roles diferenciados no dashboard (admin vs. operador), relatórios avançados, NF-e.

---

## 2. Última atualização

- **Data:** 2026-11-10
- **Atividade:** Correção de nomes de colunas no banco compartilhado com o site; configurações completas; validação CPF/CNPJ.
- **Commits:** `097c196` (docs), `322303e` (relatórios OS/Vendas), `ad639f3` (fix colunas + config + CPF)
- **Resultado:** Produtos aparecem corretamente em Produtos e PDV. Configurações salva whatsapp, e-mail, cidade, UF e formas de pagamento. Clientes validam CPF/CNPJ antes de enviar.
- **Situação:** Sistema estável em produção.

---

## 3. Implementações concluídas

### 2026-11-10 — Fix: nomes de colunas produtos/PDV + configurações + validação CPF/CNPJ

- **Objetivo:** Corrigir "Nenhum produto encontrado" em Produtos e PDV, campos faltantes em Configurações e adicionar validação de CPF/CNPJ em Clientes.
- **Causa raiz:** ERP usava nomes de colunas errados para a tabela `products` (compartilhada com o site): `active` (correto: `is_active`), `stock_quantity` (correto: `stock`), `image_url` (correto: `primary_image_url`). Configurações usava `phone` (correto: `whatsapp_number`) e não expunha `email`, `city`, `state_abbr`, `payment_methods`.
- **Implementação:**
  1. **Produtos/PDV (6 arquivos):** renomeadas todas as referências às colunas incorretas
  2. **Configurações:** `ConfigForm.tsx` reescrito com todos os campos reais de `store_settings`; editor de formas de pagamento (adicionar/remover); `actions.ts` atualizado
  3. **Clientes:** `CustomerForm.tsx` adiciona validação client-side de CPF (11 dígitos) e CNPJ (14 dígitos) com verificação dos dígitos verificadores
- **Arquivos alterados:** `src/app/produtos/page.tsx`, `ProdutoForm.tsx`, `actions.ts`, `src/app/pdv/page.tsx`, `PDVClient.tsx`, `actions.ts`, `src/app/configuracoes/ConfigForm.tsx`, `actions.ts`, `src/app/clientes/CustomerForm.tsx`
- **Commit:** `ad639f3`

---

### 2026-11-10 — Feat: relatórios OS e Vendas separados com filtros

- **Objetivo:** Implementar relatórios de OS por dia/mês/ano com filtros opcionais por cliente (inspirado no OSVendas 5.0).
- **Implementação:** `src/app/relatorios/page.tsx` reescrito com duas abas (Vendas PDV e OS). Aba OS: filtros de ano/mês/dia e cliente; agrupamento por dia; links para cada OS.
- **Commit:** `322303e`

---

### 2026-11-10 — Fix: middleware bloqueando arquivos estáticos

- **Objetivo:** Corrigir logo quebrada na tela de login (exibia texto alternativo "Norte Tecnologia").
- **Causa raiz:** O middleware (`src/middleware.ts`) redirecionava qualquer requisição não autenticada para `/login`, incluindo `/logo.png`. O navegador recebia HTML em vez de PNG.
- **Implementação:**
  - `isPublicAsset` agora inclui regex `/\.(png|jpg|jpeg|gif|ico|svg|webp|woff2?|ttf|otf)$/i`
  - Matcher do Next.js atualizado para excluir qualquer caminho com extensão de arquivo: `[^/]+\\.[a-zA-Z]+$`
- **Arquivos alterados:** `src/middleware.ts`
- **Commit:** `41e6c0d`

---

### 2026-11-10 — Fix: logo, fonte Inter e caminhos de ícones

- **Objetivo:** Corrigir diferença de fonte entre o ERP e o site, logo quebrada e caminhos errados de ícones PWA.
- **Implementação:**
  1. **Fonte Inter:** `inter.variable` movido de `<body>` para `<html>` em `layout.tsx`, com `display: "swap"`
  2. **Logo:** trocado `<Image>` (Next.js) por `<img>` nativo na tela de login para evitar falhas do otimizador
  3. **Ícones PWA:** corrigidos de `/icons/icon-192.png` para `/icon-192.png` em `layout.tsx` e `manifest.json`
- **Arquivos alterados:** `src/app/layout.tsx`, `src/app/login/page.tsx`, `public/manifest.json`
- **Commit:** `193cec8`

---

### 2026-11-10 — Feat: upload de imagens nas Ordens de Serviço + design do dashboard

- **Objetivo:** Permitir anexar fotos do equipamento nas OS; corrigir botões de ação rápida do dashboard.
- **Implementação:**
  1. **Upload de imagens OS:**
     - `src/app/os/uploadAction.ts` — Server Action com validação de magic bytes (JPEG/PNG/WebP/GIF), assinatura SHA-1, upload para Cloudinary na pasta `norte-tecnologia/erp-os`
     - `src/app/os/nova/OSForm.tsx` — input de arquivo, preview grid, upload imediato ao selecionar, URLs ocultas no form
     - `src/app/os/actions.ts` — `createServiceOrder` extrai e salva `images[]` no banco
     - `src/app/os/[id]/page.tsx` — galeria de imagens no detalhe da OS
     - `src/types/index.ts` — `images?: string[]` adicionado à interface `ServiceOrder`
  2. **Migration manual no Supabase:** `ALTER TABLE erp_service_orders ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';`
  3. **Dashboard:** botões de ação rápida alterados de azul (`bg-brand-blue/20`) para cinza escuro (`bg-brand-gray-dark`), ícones emoji substituídos por SVG, hover amarelo
- **Arquivos alterados:** `src/app/os/uploadAction.ts` (novo), `src/app/os/nova/OSForm.tsx`, `src/app/os/actions.ts`, `src/app/os/[id]/page.tsx`, `src/types/index.ts`, `src/app/dashboard/page.tsx`
- **Commit:** `dfe054c`

---

### 2026-11-10 — Design: redesign do ERP idêntico ao admin do site

- **Objetivo:** Alinhar visual do ERP ao painel admin do site.
- **Implementação:** Padronização de cores, tipografia e componentes para manter consistência visual.
- **Commit:** `cae363c`

---

### 2026-11-10 — Feat: ERP completo — correções TypeScript, estoque, relatórios, logos

- **Objetivo:** Corrigir erros TypeScript, completar módulo de estoque, adicionar página de relatórios, adicionar logos.
- **Commit:** `c775bb0`

---

### 2026-11-10 — Feat: logos e ícones oficiais

- **Objetivo:** Adicionar `logo.png` (NT, 320×400) e ícones PWA (`icon-192.png`, `icon-512.png`) ao projeto.
- **Arquivos adicionados:** `public/logo.png`, `public/icon-192.png`, `public/icon-512.png`
- **Commit:** `1f248e2`

---

### 2026-11-10 — Refactor: acesso ERP via app_metadata do Supabase

- **Objetivo:** Simplificar controle de acesso — usar `app_metadata.erp_role` em vez de tabela `erp_user_roles`.
- **Implementação:**
  - `src/lib/auth.ts` — `extractRole()` lê `app_metadata.erp_role`; `setUserERPRole()` atualiza via Admin API
  - Middleware lê role diretamente do JWT, sem query adicional ao banco
  - Tabela `erp_user_roles` mantida como referência mas não usada ativamente
- **Roles disponíveis:** `admin` | `operador` (todo autenticado sem role explícita é tratado como `operador`)
- **Arquivos alterados:** `src/lib/auth.ts`, `src/middleware.ts`
- **Commit:** `8bae789`

---

### 2026-11-10 — Feat: autenticação e controle de acesso por papel

- **Objetivo:** Implementar sistema de roles (admin/operador) no ERP.
- **Implementação:** Migration `erp_004_user_roles.sql`, funções `requireAuth()` e `requireAdmin()` em `lib/auth.ts`
- **Commit:** `321f31f`

---

### 2026-11-10 — Feat: upload Cloudinary, imagens nos produtos/PDV, detalhe do cliente

- **Objetivo:** Integrar Cloudinary para imagens de produtos; melhorar PDV e detalhe do cliente.
- **Commit:** `06bf2f5`

---

### 2026-11-10 — Criação inicial do projeto ERP

- **Objetivo:** Criar toda a estrutura do ERP Norte Tecnologia do zero.
- **Implementação:**
  1. **Documentação:** README.md, Sobre o Projeto (contexto, stack, banco, rotas, segurança, diário, CLAUDE.md)
  2. **Config Next.js:** package.json, next.config.ts (CSP, security headers), tailwind.config.ts (mesmos tokens do site), tsconfig.json, postcss.config.mjs
  3. **Core:** globals.css (mesmos design tokens), middleware.ts (proteção de todas as rotas), layout.tsx com AppLayout (sidebar + header), tipos TypeScript ERP
  4. **Lib:** supabase/client.ts, supabase/server.ts, supabase/admin.ts, rateLimit.ts, utils.ts, cloudinary.ts
  5. **Auth:** /login (page + actions com rate limiting), page.tsx root (redirect para /dashboard)
  6. **Dashboard:** métricas do dia (vendas, OS abertas, estoque crítico, últimas vendas)
  7. **Clientes:** listagem, busca, cadastro, edição, histórico de OS
  8. **Produtos:** listagem com estoque, cadastro/edição (mesma tabela do site), controle de estoque
  9. **OS (Ordem de Serviço):** criação, edição de status, listagem, impressão com/sem valores
  10. **PDV:** busca de produto, carrinho, múltiplos pagamentos, finalização com baixa de estoque
  11. **Relatórios:** página de relatórios básica
  12. **Configurações:** página de configurações (formas de pagamento)
  13. **PWA:** manifest.json, sw.js, ícones NT
  14. **Migrations:** erp_001_customers.sql, erp_002_service_orders.sql, erp_003_pdv.sql
- **Commit:** `5578648`

---

## 4. Pendências e problemas conhecidos

| Item | Prioridade | Detalhe |
|------|-----------|--------|
| Configurar domínio `erp.nortetecnologia.com` | ALTA | Configurar na Vercel e apontar DNS |
| Upload de imagem na edição de OS | MÉDIA | Atualmente só é possível na criação |
| Relatórios avançados | BAIXA | Fase 2 — faturamento, lucratividade |
| Emissão de NF | BAIXA | Fase 2 — Focus NFe ou NFe.io |
| Roles no dashboard | BAIXA | Fase 2 — mostrar/ocultar funções admin |

---

## 5. Próximas etapas (Fase 2)

1. **Configurar domínio** `erp.nortetecnologia.com` na Vercel
2. **Upload de imagem na edição de OS** — reutilizar `uploadAction.ts` no form de edição
3. **Relatórios avançados** — faturamento por período, OS por status, ticket médio
4. **Roles no dashboard** — ações admin somente visíveis para `role === 'admin'`
5. **Emissão de NF-e/NFS-e** — integração com Focus NFe ou NFe.io

---

## 6. Decisões técnicas

| Decisão | Motivo |
|---------|--------|
| Tabelas com prefixo `erp_` | Coexistência no mesmo Supabase sem conflito com o site |
| Mesmo Supabase Auth | Reusar usuários admin já existentes; evitar nova instância |
| `app_metadata.erp_role` para roles | Role lida do JWT sem query adicional ao banco; mais eficiente no middleware |
| OS sem NF na Fase 1 | Complexidade fiscal adiada; OS serve como documento interno |
| PWA com mesmo padrão do site | Usuário quer instalar no mobile/desktop da equipe |
| Sidebar em vez de header | ERP é ferramenta interna; sidebar é padrão de backoffice |
| `<img>` nativo na tela de login | Next.js Image optimizer falha silenciosamente para imagens portrait em containers landscape |
| Middleware exclui extensões de arquivo | Arquivos estáticos em `/public` devem ser acessíveis sem autenticação |
