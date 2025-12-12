# Blog Colaborativo - Frontend

Frontend do projeto Blog Colaborativo desenvolvido com Next.js e React.

## 🏗️ Arquitetura e Tecnologias

### Arquitetura
O projeto utiliza uma arquitetura baseada em componentes reutilizáveis e hooks customizados:

```
app/                    # Páginas e rotas (App Router)
components/             # Componentes React reutilizáveis
├── layouts/           # Layouts (AuthLayout, MainLayout)
├── posts/             # Componentes específicos de posts
├── shared/             # Componentes compartilhados
└── ui/                 # Componentes de UI (shadcn/ui)
hooks/                  # Custom hooks
├── api/               # Hooks para recursos de API
├── usePosts.ts        # Hook para gerenciar posts
└── useErrorHandler.ts # Hook para tratamento de erros
stores/                 # Gerenciamento de estado (Zustand)
types/                  # Tipos TypeScript
constants/              # Constantes do projeto
```

### Tecnologias
- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI baseados em Radix UI
- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP
- **Tiptap** - Editor de texto rico

## 📦 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Configure a URL da API no `.env.local`:

```env
NEXT_PUBLIC_API_URI=http://localhost:8000/api
```

## 🚀 Como Rodar

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Produção

```bash
npm run build
npm start
```

## 👤 Usuário de Teste

Para testar a aplicação, você pode:

1. **Criar um novo usuário** através da página de registro (`/auth/register`)

2. **Usar um usuário existente** do backend:
   - **Email**: `teste@example.com`
   - **Senha**: `senha123`

> **Nota**: Certifique-se de que o backend está rodando antes de testar o frontend.
