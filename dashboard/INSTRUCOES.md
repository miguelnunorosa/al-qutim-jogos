# Dashboard Al-Qutim — estado do projeto

## Estrutura de ficheiros (dentro de `dashboard/`)

```
firestore.rules                    Regras de segurança do Firestore
TODO-SEGURANCA.md                  Checklist/decisões de segurança
.env.example                       Modelo das variáveis do Firebase (copiar para .env)
package.json                       + react-router-dom, MUI icons, fontsource, firebase

scripts/
  seedJogos.js                     Popula a coleção "jogos" com os 6 jogos iniciais
  syncClaims.js                    Sincroniza "role" (Firestore) → custom claim (Auth)
  serviceAccountKey.json           NÃO versionado — chave privada do Firebase Admin

src/
  firebase.js                      Inicializa Firebase (Firestore + Auth)
  App.js                           Routing: "/" (Login) e "/dashboard/*" (protegido)
  index.js                         Entry point + import das fontes (Spectral/Inter)

  contexts/
    AuthContext.js                 Liga o utilizador autenticado ao perfil em "utilizadores"

  theme/
    theme.js                       Tema MUI (paleta índigo/ouro/turquesa)
    GeometricMark.js                Motivo geométrico decorativo (assinatura visual)

  layouts/
    DashboardLayout.js             Sidebar + topbar + menu de conta/logout

  components/
    RequireAuth.js                 Bloqueia /dashboard/* sem sessão ou sem role autorizado
    EditJogoDialog.js              Modal de edição de jogo (tabs PT/EN/ES)
    EditUtilizadorDialog.js        Modal de criar/editar utilizador
    ForgotPasswordDialog.js        Modal "recuperar palavra-passe"
    StatCard.js                    Cartão de métrica reutilizável
    EmptyState.js                  Estado vazio reutilizável

  pages/
    Login.js                       Email + palavra-passe, lembrar-me, recuperar password
    Dashboard.js                   "Início" — métricas (ainda parcialmente mock)
    Jogos.js                       Grelha dos jogos, ligada ao Firestore em tempo real
    Utilizadores.js                Tabela de utilizadores, ligada ao Firestore
    Definicoes.js                  Placeholder — ainda por desenhar

  styles/
    login.css                      Ficheiro antigo — já não é importado por Login.js
```

## Como correr

Dentro do container Docker (`docker compose up`, porta 11006):

```bash
npm install                                 # primeira vez / após mudar dependências
```

A app abre em `http://localhost:11006/` — ecrã de login. Depois de autenticado
(role `admin` ou `gestor_conteudo`), és redirecionado para `/dashboard`.

## Configuração necessária no Firebase

1. **Firestore Database** — criado, com as regras de `firestore.rules` publicadas
2. **Authentication → Sign-in method** — "Email/Password" ativado
3. **Criar utilizadores** — já é feito direto pela dashboard (botão "Adicionar"
   em Utilizadores): cria a conta de Authentication **e** o perfil no Firestore
   de uma vez. Depois de criar (ou de mudar o `role` de alguém), corre:
   ```bash
   node scripts/syncClaims.js
   ```
   para essa pessoa ganhar acesso real de acordo com o `role`.

Ver `TODO-SEGURANCA.md` para o detalhe de como as regras usam os `role`.

## O que falta / está por afinar

- **Jogos**: conteúdo (nomes definitivos, regras, imagens) em falta — a reunir
  antes de avançar. A estrutura/CRUD já está pronta para receber.
- **Dashboard "Início"**: as métricas de partidas jogadas / popularidade por jogo
  continuam com dados de exemplo (não há ainda registo de partidas no sistema).
  "Total de utilizadores" e "jogos ativos" já podem ser ligados a dados reais
  quando quiseres.
- **Definições**: página ainda vazia, sem definições configuráveis.
- **Upload de imagem nos jogos**: hoje é um campo de URL manual; podia passar a
  upload direto via Firebase Storage.
- **.gitignore**: confirmar que `.env` e `scripts/serviceAccountKey.json` estão
  lá — são credenciais reais e nunca devem ir para o repositório.