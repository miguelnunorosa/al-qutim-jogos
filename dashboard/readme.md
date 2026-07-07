# React Docker Development Environment

Este projeto fornece um ambiente Docker completo para desenvolvimento React sem necessidade de instalar Node.js ou outras dependências no seu computador.

## 🚀 Como Usar

### Pré-requisitos
- Docker Desktop instalado e funcionando
- Git (opcional, para clonar projetos)

### Iniciar o Ambiente

1. **Abra o terminal/prompt de comando na pasta do projeto**

2. **Execute o comando para iniciar o ambiente:**
   ```bash
   docker-compose up --build
   ```

3. **Aguarde a instalação das dependências** (primeira vez pode demorar alguns minutos)

4. **Abra o navegador em:** `http://localhost:3000`

### Comandos Úteis

```bash
# Iniciar o ambiente
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar o ambiente
docker-compose down

# Reconstruir (quando houver mudanças no Dockerfile)
docker-compose up --build

# Ver logs
docker-compose logs -f

# Executar comandos dentro do container
docker-compose exec react-dev npm install [pacote]
docker-compose exec react-dev npm run build
```

### Estrutura do Projeto

```
react/
├── Dockerfile              # Configuração do container
├── docker-compose.yml      # Orquestração dos serviços
├── package.json           # Dependências do React
├── .gitignore            # Arquivos a ignorar no Git
└── README.md             # Este arquivo
```

### Desenvolvimento

- **Hot Reload**: Funciona automaticamente - mudanças no código são refletidas instantaneamente
- **Porta**: 3000 (padrão do React)
- **Volumes**: O código é montado no container, então você pode editar normalmente

### Resolução de Problemas

**Se o hot reload não funcionar:**
```bash
docker-compose down
docker-compose up --build
```

**Se a porta 3000 estiver ocupada:**
Edite o `docker-compose.yml` e mude a porta:
```yaml
ports:
  - "3001:3000"  # Usa porta 3001 no seu PC
```

**Para limpar tudo e começar do zero:**
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

### Adicionando Novas Dependências

```bash
# Instalar um novo pacote
docker-compose exec react-dev npm install nome-do-pacote

# Instalar dependência de desenvolvimento
docker-compose exec react-dev npm install --save-dev nome-do-pacote
```

## ✅ Vantagens

- ✅ Não precisa instalar Node.js no PC
- ✅ Ambiente isolado e limpo
- ✅ Hot reload funcionando
- ✅ Fácil de usar e configurar
- ✅ Funciona em qualquer sistema operacional
- ✅ Fácil de compartilhar com outros desenvolvedores

## 🎯 Próximos Passos

1. Execute `docker-compose up --build`
2. Abra `http://localhost:3000`
3. Comece a programar! 🚀


```bash
src/
│
├── assets/              # Arquivos estáticos, como imagens e fontes
│   └── logo.png         # Logo da aplicação
│
├── components/          # Componentes reutilizáveis
│   ├── Header.js        # Cabeçalho, se necessário
│   ├── Sidebar.js       # Barra lateral
│   └── ...              # Outros componentes reutilizáveis
│
├── pages/               # Páginas do aplicativo (como Login, Dashboard, etc.)
│   ├── Login.js         # Tela de Login
│   └── Dashboard.js     # Página principal do Dashboard
│
├── services/            # Lógica de comunicação com API ou funções utilitárias
│   ├── authService.js   # Funções relacionadas à autenticação
│   └── apiService.js    # Funções de chamada de API, se necessário
│
├── theme/               # Arquivos relacionados ao tema da aplicação
│   └── theme.js         # Definições de temas (escuro, claro, etc.)
│
├── App.js               # Componente principal que renderiza o App
├── index.js             # Ponto de entrada do React
└── styles/              # Arquivos de estilo (CSS ou SCSS)
    └── global.css       # Estilos globais, como reset ou fontes
```