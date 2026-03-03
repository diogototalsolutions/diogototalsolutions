# DTS Web App

Aplicação web da DTS (site público + portal privado da equipa).

## Estado atual

### ✅ Fase 1–5
- Site público + contacto + auth + área admin CRUD.

### ✅ Fase 6 (refinos production-ready)
- Hardening de headers HTTP (CSP mínimo, nosniff, frame deny, referrer policy).
- Rate limit adicional para `/api/admin/*` (60 req/min por IP, in-memory).
- Verificação de `Origin`/`Host` para mutations admin (POST/PATCH/DELETE).
- Respostas de erro padronizadas: `{ error: { code, message } }`.
- Logs estruturados server-side para ações admin relevantes.
- Paginação/filtros/ordenação nos endpoints admin principais e UI.
- Melhorias de UX: empty states, mensagens de erro mais amigáveis.

## Segurança

### Headers aplicados
Configuração em `next.config.ts` para todas as rotas:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` mínimo viável

> Nota CSP: política atual é conservadora e permite `unsafe-inline` para script/style por compatibilidade inicial. Em hardening adicional recomenda-se nonce/hash CSP.

### CSRF / origem
- Rotas `/api/admin/*` exigem sessão autenticada (STAFF/ADMIN) + permissões por role.
- Mutations admin validam `Origin` vs `Host` para bloquear origens estranhas.
- Cookies do Auth.js seguem defaults de segurança (same-site/secure conforme ambiente).

### Rate limit
- `/api/contact`: 5 pedidos / 10 minutos por IP.
- `/api/admin/*`: 60 pedidos / minuto por IP.
- Implementação atual é in-memory (adequada para ambiente simples); em produção distribuída usar Redis/Upstash.

## Permissões
- `STAFF`: GET/POST/PATCH nas APIs admin.
- `ADMIN`: tudo do STAFF + DELETE.

## Endpoints admin
- `/api/admin/clients` (GET list paginado + pesquisa, POST)
- `/api/admin/clients/[id]` (GET, PATCH, DELETE admin)
- `/api/admin/services` (GET paginado + filtros, POST)
- `/api/admin/services/[id]` (GET, PATCH, DELETE admin)
- `/api/admin/clients/[id]/services` (GET, POST)
- `/api/admin/client-services/[id]` (PATCH, DELETE admin)
- `/api/admin/quote-requests` (GET paginado + filtro status)
- `/api/admin/quote-requests/[id]` (GET, PATCH)

## Setup local

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Deploy (Vercel + Postgres)

### 1) Base de dados
- Criar Postgres gerido (Neon/Supabase/RDS).
- Configurar `DATABASE_URL` no Vercel.

### 2) Variáveis de ambiente necessárias
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (URL pública da app)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CONTACT_TO_EMAIL`
- `RESEND_API_KEY` **ou** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### 3) Prisma em produção
- Deploy migrations com:

```bash
npx prisma migrate deploy
```

- Seed apenas no primeiro setup (manual/CI controlado):

```bash
npm run prisma:seed
```

### 4) Verificações
- Confirmar login em `/login`.
- Confirmar acesso protegido em `/admin/*`.
- Testar `/contacto` e entrega de email.

## Nota técnica
- Prisma só é usado no servidor (Route Handlers + Server Components).
- `middleware` protege apenas `/admin/:path*` e **não** interfere com `/api/auth/*`.
