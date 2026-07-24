/**
 * Script para popular a coleção "jogos" no Firestore com os 6 jogos iniciais.
 *
 * COMO USAR:
 * 1. Na Firebase Console: Definições do projeto → Contas de serviço →
 *    "Gerar nova chave privada". Isto descarrega um ficheiro JSON.
 * 2. Guarda esse ficheiro como `scripts/serviceAccountKey.json`
 *    (NUNCA fazer commit deste ficheiro — já está preparado para ficar de fora do git,
 *    confirma que "serviceAccountKey.json" está no .gitignore).
 * 3. A partir da pasta dashboard/, corre:
 *      npm install firebase-admin --save-dev
 *      node scripts/seedJogos.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Traduções só preenchidas para pt/en por agora como exemplo — completa o "es"
// e ajusta os textos à vontade antes de correr o script.
const JOGOS = [
  {
    slug: 'moinho',
    ordem: 1,
    traducoes: {
      pt: { nome: 'Moinho', tipo: 'Alinhamento e captura' },
      en: { nome: 'Mill', tipo: 'Alignment and capture' },
      es: { nome: 'Molino', tipo: 'Alineación y captura' },
    },
  },
  {
    slug: 'alquerque',
    ordem: 2,
    traducoes: {
      pt: { nome: 'Alquerque', tipo: 'Estratégia militar' },
      en: { nome: 'Alquerque', tipo: 'Military strategy' },
      es: { nome: 'Alquerque', tipo: 'Estrategia militar' },
    },
  },
  {
    slug: 'tapatan',
    ordem: 3,
    traducoes: {
      pt: { nome: 'Tapatan', tipo: 'Jogo do Galo' },
      en: { nome: 'Tapatan', tipo: 'Tic-tac-toe style' },
      es: { nome: 'Tapatan', tipo: 'Estilo tres en raya' },
    },
  },
  {
    slug: 'tabula',
    ordem: 4,
    traducoes: {
      pt: { nome: 'Tábula', tipo: 'Ancestral do gamão' },
      en: { nome: 'Tabula', tipo: 'Ancestor of backgammon' },
      es: { nome: 'Tabula', tipo: 'Antecesor del backgammon' },
    },
  },
  {
    slug: 'mancala-iii',
    ordem: 5,
    traducoes: {
      pt: { nome: 'Mancala III', tipo: 'Semeadura e contagem' },
      en: { nome: 'Mancala III', tipo: 'Sowing and counting' },
      es: { nome: 'Mancala III', tipo: 'Siembra y conteo' },
    },
  },
  {
    slug: 'soldado',
    ordem: 6,
    traducoes: {
      pt: { nome: 'Soldado', tipo: 'Percurso e estratégia' },
      en: { nome: 'Soldier', tipo: 'Path and strategy' },
      es: { nome: 'Soldado', tipo: 'Recorrido y estrategia' },
    },
  },
];

async function seed() {
  const batch = db.batch();

  JOGOS.forEach((jogo) => {
    const ref = db.collection('jogos').doc(jogo.slug);
    batch.set(ref, {
      slug: jogo.slug,
      ordem: jogo.ordem,
      ativo: true,
      imagemUrl: '',
      traducoes: jogo.traducoes,
    });
  });

  await batch.commit();
  console.log(`✔ ${JOGOS.length} jogos criados/atualizados na coleção "jogos".`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro ao popular a coleção "jogos":', err);
  process.exit(1);
});
