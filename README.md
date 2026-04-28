# AmazoTrack — Frontend

Interface web do sistema de gestão de resíduos sólidos industriais do Polo Industrial de Manaus (PIM).

## Stack

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework | React 18 + Vite |
| Estilização | Tailwind CSS |
| Roteamento | React Router DOM |
| HTTP Client | Fetch API (wrapper customizado) |
| Gráficos | Recharts |
| PDF | jsPDF |
| Deploy | Vercel |

## Como rodar localmente

### Pré-requisitos
- Node.js >= 18

### 1. Clonar e instalar
```bash
git clone https://github.com/AmazoTrack/amazotrack-frontend.git
cd AmazoTrack
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
VITE_API_URL=https://amazotrack-backend-production.up.railway.app

### 3. Iniciar o projeto
```bash
npm run dev
```
Acesse http://localhost:5173

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Visualiza o build localmente |

## Estrutura do projeto
src/
├── components/        # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Layout.tsx
│   ├── Loading.tsx
│   └── ErrorPage.tsx
├── pages/             # Telas da aplicação
├── hooks/             # Custom hooks
├── services/          # Chamadas de API
│   └── api.ts
├── schemas/           # Validações Zod
├── types/             # Tipagens TypeScript
└── utils/             # Funções auxiliares

## Padrão de commits

### Formato
<tipo>(<escopo>): <descrição>

### Tipos

| Tipo | Uso | Exemplo |
|---|---|---|
| `feat` | Nova funcionalidade | `feat(auth): adiciona tela de login` |
| `fix` | Correção de bug | `fix(modal): resolve problema de z-index` |
| `chore` | Setup e configuração | `chore: configura eslint` |
| `style` | Ajuste visual | `style(button): melhora hover` |
| `refactor` | Melhoria no código | `refactor: remove código duplicado` |
| `docs` | Documentação | `docs: atualiza README` |
| `perf` | Performance | `perf: otimiza carregamento de imagens` |
| `test` | Testes | `test: adiciona testes para Button` |

## Padrão de branches
feat/nome-da-tarefa
fix/nome-do-bug
chore/nome-da-config

## Equipe Frontend

| Nome | Papel |
|---|---|
| Raffaela | Líder Frontend |
| Renan | Desenvolvedor — Integração e contratos de API |
| Jakeline | Desenvolvedora Frontend |
| Gabrielly | Desenvolvedora Frontend |