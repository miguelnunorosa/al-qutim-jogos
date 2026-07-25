# Segurança do Firestore

## ✅ Já feito

- `jogos`: escrita só para `admin` / `gestor_conteudo` autenticados (via custom claim `role`)
- `utilizadores`: leitura só para autenticados; escrita normal só para `admin`;
  exceção para o campo `ultimoAcesso`, que qualquer autenticado pode atualizar
  (é o que o Login usa)
- `RequireAuth` bloqueia quem não tem `role: admin` ou `role: gestor_conteudo`
  (utilizadores com `role: jogador` fazem login mas são expulsos de volta ao "/")
- Todas as coleções não listadas ficam bloqueadas por omissão

## ⚠️ Manutenção contínua — não esquecer

As regras leem `request.auth.token.role`, que é uma **custom claim** do
Firebase Auth — não é o mesmo que o campo `role` no documento Firestore.
Sempre que:

- **crias um novo utilizador** na dashboard **e** lhe crias a conta em
  Authentication → Users, ou
- **mudas o `role`** de alguém existente na dashboard,

tens de correr:
```bash
node scripts/syncClaims.js
```
(dentro do container Docker, tal como o `../../../Downloads/seedJogos.js`)

A pessoa em causa só vê o novo acesso depois de voltar a fazer login (ou
até 1h depois, quando o token renovar sozinho).

## Publicar as regras

Firebase Console → Firestore Database → separador "Regras" → colar o
conteúdo de `firestore.rules` → Publicar.

## Ainda por fazer (não urgente)

- Automatizar a sincronização de claims (hoje é manual, via script) —
  candidato natural a uma Cloud Function no futuro, disparada sempre que
  um documento em `utilizadores` for escrito.
- Decidir se a coleção `jogos` deve continuar de leitura 100% pública
  quando a app principal também tiver autenticação própria.
