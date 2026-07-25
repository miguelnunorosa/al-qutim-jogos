/**
 * Remove contas de Firebase Authentication que já não têm nenhum
 * documento correspondente na coleção "utilizadores" do Firestore.
 *
 * Motivo: apagar um utilizador na dashboard só remove o perfil no
 * Firestore (o browser não pode apagar contas de outras pessoas em
 * Authentication — só a Admin SDK consegue). Este script fecha esse
 * ciclo: corre-o depois de apagares alguém na dashboard.
 *
 * COMO USAR (mesmos pré-requisitos do seedJogos.js / syncClaims.js —
 * scripts/serviceAccountKey.json):
 *   node scripts/removeOrphans.js
 *
 * ⚠ Isto apaga contas de login permanentemente. Confirma antes de correr
 * em produção que o Firestore está mesmo atualizado (ex: já fizeste o
 * "Remover" na dashboard para todos os utilizadores que queres limpar).
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function removeOrphans() {
    const snapshot = await db.collection('utilizadores').get();
    const emailsValidos = new Set(
        snapshot.docs.map((d) => (d.data().email || '').trim().toLowerCase()).filter(Boolean)
    );

    console.log(`${emailsValidos.size} email(s) válido(s) encontrados em "utilizadores".\n`);

    let removidos = 0;
    let mantidos = 0;
    let erros = 0;
    let nextPageToken;

    do {
        const list = await admin.auth().listUsers(1000, nextPageToken);

        for (const userRecord of list.users) {
            const email = (userRecord.email || '').trim().toLowerCase();

            if (!emailsValidos.has(email)) {
                try {
                    await admin.auth().deleteUser(userRecord.uid);
                    console.log(`✔ Removido: ${email || userRecord.uid}`);
                    removidos++;
                } catch (err) {
                    console.error(`✘ Erro ao remover ${email}:`, err.message);
                    erros++;
                }
            } else {
                mantidos++;
            }
        }

        nextPageToken = list.pageToken;
    } while (nextPageToken);

    console.log(`\nConcluído: ${removidos} removida(s), ${mantidos} mantida(s), ${erros} com erro.`);
    process.exit(0);
}

removeOrphans().catch((err) => {
    console.error('Erro ao limpar contas órfãs:', err);
    process.exit(1);
});