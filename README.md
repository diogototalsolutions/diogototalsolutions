# DTS Web App (Next.js + Supabase)

Aplicação completa para a DTS com:
- Site público: `/`, `/servicos`, `/quem-somos`, `/o-que-fazemos`, `/contacto`
- Pedido de orçamento (grava em `quote_requests` + envio de email para `minedigas@gmail.com`)
- Área privada admin: `/admin`, `/admin/clientes`, `/admin/servicos`, `/admin/pedidos`
- Autenticação Supabase Auth **apenas para o admin**
- RLS aplicado conforme requisitos

## Stack
- Next.js App Router (v14+ compatível; projeto está em Next 15)
- TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth)
- Zod validação
- Resend (preferido) com fallback SMTP Nodemailer

## Variáveis de ambiente
Cria `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
# opcionais para fallback SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
# opcional para redirect de logout em produção
NEXT_PUBLIC_SITE_URL=https://teu-dominio.com
```

## Setup Supabase
1. Criar projeto no Supabase.
2. Em **SQL Editor**, executar `supabase.sql`.
3. Em **Authentication > Users**, criar 1 utilizador (admin).
4. Em **Authentication > URL Configuration**, configurar URL local e produção.

## Correr local no Windows
1. Instalar Node.js LTS.
2. No PowerShell/CMD:
   ```bash
   npm install
   npm run dev
   ```
3. Abrir `http://localhost:3000`.
4. Login admin em `/login` com o user criado no Supabase.

## Deploy na Vercel
1. Importar repositório na Vercel.
2. Definir as variáveis de ambiente acima em **Project Settings > Environment Variables**.
3. Deploy.
4. Garantir que Supabase Auth URL config inclui domínio Vercel.

## Notas de segurança / RLS
- `quote_requests`: insert para `anon`; leitura/edição apenas `authenticated`.
- `clients` e `services`: acesso total apenas `authenticated`.
- Como requisito pede apenas 1 admin, a recomendação é manter apenas 1 utilizador na tabela `auth.users`.
