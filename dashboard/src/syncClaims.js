/**
 * Sincroniza o campo "role" de cada documento em Firestore/utilizadores
 * para uma custom claim no respetivo utilizador do Firebase Authentication.
 *
 * As Security Rules (firestore.rules) leem `request.auth.token.role` —
 * este script é o que põe esse valor lá. Corre-o sempre que:
 *   - crias um novo utilizador na dashboard (e já lhe criaste a conta
 *     de Authentication correspondente)
 *   - mudas o "role" de alguém na dashboard
 *
 * IMPORTANTE: depois de correr o script, a pessoa em causa só vê o novo
 * role depois de voltar a fazer login (ou o browser fazer refresh do
 * token, que acontece automaticamente ~1x por hora).
 *
 * COMO USAR (mesmos pré-requisitos do seedJogos.js — scripts/serviceAccountKey.json):
 *   node scripts/syncClaims.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function syncClaims() {
    const snapshot = await db.collection('utilizadores').get();

    if (snapshot.empty) {
        console.log('Sem utilizadores na coleção "utilizadores".');
        process.exit(0);
    }

    let sucesso = 0;
    let semContaAuth = 0;
    let erros = 0;

    for (const docSnap of snapshot.docs) {
        const { nome, email, role } = docSnap.data();
        try {
            const authUser = await admin.auth().getUserByEmail(email);
            await admin.auth().setCustomUserClaims(authUser.uid, { role });
            console.log(`✔ ${email} (${nome}) → role: ${role}`);
            sucesso++;
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                console.warn(`⚠ ${email} (${nome}) — sem conta em Authentication, ignorado.`);
                semContaAuth++;
            } else {
                console.error(`✘ ${email} (${nome}) — erro:`, err.message);
                erros++;
            }
        }
    }

    console.log(`\nConcluído: ${sucesso} sincronizados, ${semContaAuth} sem conta Auth, ${erros} com erro.`);
    process.exit(0);
}

syncClaims().catch((err) => {
    console.error('Erro ao sincronizar claims:', err);
    process.exit(1);
});