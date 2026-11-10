# Diário de Desenvolvimento — Norte Tecnologia ERP

> Registro contínuo das implementações, decisões, pendências e próximas etapas do projeto.
>
> **Regra:** consultar este documento antes de iniciar qualquer tarefa e atualizá-lo após cada etapa relevante.

---

## 1. Estado atual do projeto

- **Estágio:** Estrutura inicial criada. Next.js scaffolding completo. Módulos de Clientes, Produtos, Estoque, OS e PDV implementados com CRUD básico. PWA configurado.
- **Última atividade:** 2026-11-10 — Criação inicial do projeto ERP.
- **Situação geral:** Projeto criado. Dependências instaladas. **Migrations ERP ainda não aplicadas no Supabase.**
- **Próxima etapa:** 1) Aplicar migrations `erp_001` a `erp_003` no Supabase SQL Editor. 2) Configurar variáveis de ambiente. 3) Testar build local. 4) Deploy na Vercel.

---

## 2. Última atualização

- **Data:** 2026-11-10
- **Atividade:** Criação inicial completa do projeto ERP — estrutura, docs, config, todos os módulos.
- **Resultado:** Projeto pronto para instalar dependências e aplicar migrations.
- **Situação:** Aguardando aplicação de migrations no Supabase e configuração de env vars.

---

## 3. Implementações concluídas

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
  11. **PWA:** manifest.json, sw.js, ícones NT
  12. **Migrations:** erp_001_customers.sql, erp_002_service_orders.sql, erp_003_pdv.sql
- **Arquivos criados:** todos os arquivos do projeto
- **Limitações conhecidas:**
  - Rate limiting em memória (por instância Vercel Hobby — funciona para uso interno)
  - Impressão usa `window.print()` — requer CSS de impressão adequado
  - PDV sem suporte a leitor de código de barras físico na Fase 1 (busca manual)

---

## 4. Pendências e problemas conhecidos

| Item | Prioridade | Detalhe |
|------|-----------|--------|
| Aplicar migrations no Supabase | CRÍTICO | `erp_001`, `erp_002`, `erp_003` |
| Configurar variáveis de ambiente | CRÍTICO | `.env.local` com credenciais Supabase + Cloudinary |
| Deploy na Vercel | ALTA | Criar projeto na Vercel, configurar domínio `erp.nortetecnologia.com` |
| Testar build local | ALTA | `npm run build` para verificar erros TypeScript |
| Upload de imagens no ERP | MÉDIA | Usar mesmo Cloudinary do site |
| Relatórios avançados | BAIXA | Fase 2 |
| Emissão de NF | BAIXA | Fase 2 — Focus NFe ou NFe.io |

---

## 5. Próximas etapas

1. **Aplicar migrations ERP no Supabase** (`erp_001` → `erp_002` → `erp_003`, nesta ordem)
2. **Configurar `.env.local`** com as mesmas credenciais do site mais `NEXT_PUBLIC_SITE_URL`
3. **`npm install` e `npm run dev`** para testar localmente
4. **`npm run build`** para verificar erros
5. **Deploy na Vercel** — criar novo projeto apontando para o repo do ERP
6. **Configurar domínio** `erp.nortetecnologia.com` na Vercel

---

## 6. Decisões técnicas

| Decisão | Motivo |
|---------|--------|
| Tabelas com prefixo `erp_` | Coexistência no mesmo Supabase sem conflito com o site |
| Mesmo Supabase Auth | Reusar usuários admin já existentes; evitar nova instância |
| OS sem NF na Fase 1 | Complexidade fiscal adiada; OS serve como documento interno |
| PWA com mesmo padrão do site | Usuário quer instalar no mobile/desktop da equipe |
| Sidebar em vez de header | ERP é ferramenta interna; sidebar é padrão de backoffice |
