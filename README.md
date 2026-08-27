# CT ALPHA HUB — Sistema Integrado de Gestão & Prescrição de Treinamento

O **CT ALPHA HUB** é uma plataforma empresarial de alta performance desenvolvida para a gestão completa de centros de treinamento, academias e estúdios fitness, com foco em operação multi-unidade, prontuário e anamnese integrada, prescrição profissional de treinamento e acompanhamento mobile-first.

---

## 🛠️ Stack Tecnológica

* **Frontend:** React 18 (TypeScript), Vite 6, Tailwind CSS v3
* **Icons & UI:** Lucide React, Tailwind Merge, Clsx
* **Backend & Banco de Dados:** Supabase (PostgreSQL 15 Cloud com Row Level Security & Foreign Keys)
* **Arquitetura:** Code-Splitting dinâmico com `React.lazy()` e `<Suspense>`
* **Deploy & Hosting:** Vercel (Edge Network com SPA Rewrites & Headers de Segurança)
* **CI/CD:** GitHub Actions

---

## 🚀 Como Executar Localmente

### 1. Clonar o repositório e instalar dependências

```bash
git clone https://github.com/Vitorlocorreia/CTALPHA.git
cd CTALPHA
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e preencha suas credenciais públicas do Supabase:

```bash
cp .env.example .env
```

Conteúdo esperado no `.env`:

```env
VITE_SUPABASE_URL=https://nswuxzfskvtlvshzaivc.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-anonima-aqui
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`.

---

## 📦 Scripts Disponíveis

* `npm run dev`: Inicia o servidor de desenvolvimento local com Hot Module Replacement (HMR).
* `npm run build`: Executa a checagem de tipos com TypeScript e compila o bundle de produção otimizado com Vite.
* `npm run typecheck`: Validação estática de tipos sem emissão de arquivos (`tsc --noEmit`).
* `npm run preview`: Executa localmente o servidor de pré-visualização do bundle gerado em `dist/`.

---

## 🔒 Segurança & Governança de Dados

* **Row Level Security (RLS):** Todas as tabelas sensíveis (`students`, `student_assessments`, `workout_routines`, `financial_transactions`, `checkin_logs`) possuem políticas granulares no Postgres.
* **Isolamento de Credenciais:** Chaves privadas (`service_role`, `secret`) **nunca** são expostas no código client-side. Apenas a chave anônima pública (`anon`) com RLS ativo é utilizada no frontend.

---

## 🌐 Deploy na Vercel

O projeto está 100% configurado para deploy automático na Vercel via arquivo `vercel.json` com roteamento SPA e compressão de assets estáticos.

Para instruções completas de implantação, consulte o guia em [`docs/deployment.md`](./docs/deployment.md).
