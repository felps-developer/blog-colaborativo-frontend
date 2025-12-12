# Blog Colaborativo - Frontend

Frontend do projeto Blog Colaborativo desenvolvido com Next.js, React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend Laravel rodando (veja o README do backend)

## 🔧 Instalação

1. Clone o repositório (se ainda não tiver):
```bash
git clone <url-do-repositorio>
cd blog-colaborativo-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` e configure a URL da API:
```
NEXT_PUBLIC_API_URI=http://localhost:8000/api
```

## 🏃 Como rodar

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build de produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
blog-colaborativo-frontend/
├── app/                    # Páginas e rotas (App Router)
│   ├── auth/              # Páginas de autenticação
│   │   ├── login/         # Login
│   │   └── register/       # Registro
│   └── posts/             # Páginas de posts
│       ├── [id]/          # Detalhes do post
│       │   └── edit/      # Editar post
│       └── new/           # Criar novo post
├── components/            # Componentes React
│   ├── layouts/           # Layouts (AuthLayout, MainLayout)
│   └── ui/                # Componentes de UI (shadcn/ui)
├── hooks/                 # Custom hooks
│   └── api/               # Hooks para recursos de API
├── lib/                   # Utilitários
│   ├── api.ts             # Configuração do Axios
│   └── utils.ts           # Funções utilitárias
├── stores/                # Stores Zustand
│   └── auth.ts            # Store de autenticação
└── types/                 # Tipos TypeScript
    ├── auth.ts            # Tipos de autenticação
    └── posts.ts           # Tipos de posts
```

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. O token é armazenado no localStorage e enviado automaticamente em todas as requisições através dos interceptors do Axios.

### Fluxo de Autenticação

1. Usuário faz login/registro
2. Token JWT é recebido e armazenado
3. Perfil do usuário é carregado
4. Token é enviado automaticamente em requisições subsequentes
5. Em caso de 401, usuário é redirecionado para login

## 📝 Funcionalidades

- ✅ Login e registro de usuários
- ✅ Listagem de posts
- ✅ Visualização de post completo
- ✅ Criação de posts (apenas usuários autenticados)
- ✅ Edição de posts (apenas o autor)
- ✅ Exclusão de posts (apenas o autor)
- ✅ Proteção de rotas
- ✅ Tratamento de erros
- ✅ Estados de loading
- ✅ Interface responsiva

## 🔗 Integração com Backend

O frontend se comunica com o backend Laravel através da API REST:

- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter usuário autenticado
- `GET /api/posts` - Listar posts
- `GET /api/posts/{id}` - Obter post
- `POST /api/posts` - Criar post (autenticado)
- `PUT /api/posts/{id}` - Atualizar post (autenticado, apenas autor)
- `DELETE /api/posts/{id}` - Excluir post (autenticado, apenas autor)

## 🎨 Componentes UI

O projeto utiliza componentes do shadcn/ui, que são baseados em Radix UI e Tailwind CSS:

- Button
- Input
- Label
- Card
- Textarea
- Alert

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa o linter

## 🐛 Troubleshooting

### Erro de CORS

Certifique-se de que o backend está configurado para aceitar requisições do frontend. No Laravel, configure o CORS em `config/cors.php`.

### Token não está sendo enviado

Verifique se o token está sendo salvo no localStorage após o login. Abra o DevTools e verifique o Application > Local Storage.

### Erro 401 em todas as requisições

Verifique se:
1. O token está sendo salvo corretamente
2. O backend está retornando o token no formato correto (`access_token`)
3. A URL da API está correta no `.env.local`

## 👤 Usuário de Teste

Para testar a aplicação, você pode criar um usuário através da página de registro ou usar um usuário existente no banco de dados do backend.

## 📄 Licença

Este projeto foi desenvolvido como teste prático.
