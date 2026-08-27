# Guia de Deploy — Vercel & Supabase

Este documento orienta a configuração do ambiente de produção do **CT ALPHA Hub** na Vercel conectado ao Supabase Cloud.

---

## 1. Pré-Requisitos

1. Repositório no GitHub: `https://github.com/Vitorlocorreia/CTALPHA.git`
2. Conta na [Vercel](https://vercel.com)
3. Projeto no [Supabase](https://supabase.com) com as migrations aplicadas

---

## 2. Configuração na Vercel

1. No painel da Vercel, clique em **Add New...** -> **Project**.
2. Importe o repositório `CTALPHA`.
3. Selecione o Preset de Framework: **Vite**.
4. Verifique as configurações de Build:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
   * **Install Command:** `npm install`

---

## 3. Variáveis de Ambiente (Environment Variables)

Adicione as seguintes variáveis na seção **Settings** -> **Environment Variables** do projeto na Vercel:

| Nome da Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://nswuxzfskvtlvshzaivc.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anônima do Supabase | `eyJhbGciOiJIUzI1NiIsIn...` |
| `VITE_APP_ENV` | Ambiente de execução | `production` |

---

## 4. Roteamento SPA & Cache

O arquivo `vercel.json` na raiz do projeto já inclui as regras de:
* **Rewrites:** Todas as rotas desconhecidas (`/(.*)`) são redirecionadas para `/index.html`, evitando erros 404 ao atualizar a página (F5/Refresh) em rotas internas como `/alunos`, `/treinos` ou `/financeiro`.
* **Segurança:** Headers HTTP de proteção (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
* **Cache:** Cache imutável de 1 ano para arquivos em `/assets/`.

---

## 5. Ambientes Separados

* **Preview Deployments:** Cada Pull Request aberto no GitHub gera automaticamente uma URL de pré-visualização isolada para testes pela equipe.
* **Production Deployment:** Toda atualização mergeada na branch `main` dispara o deploy oficial de produção.
