/**
 * Script de peuplement (seed) pour le MOOC Zikisso
 * 
 * Utilisation :
 * node seed.js
 * 
 * Prérequis :
 * 1. Télécharger la clé de compte de service depuis la console Firebase :
 *    Paramètres du projet > Comptes de service > Générer une nouvelle clé privée
 * 2. Renommer le fichier téléchargé en "serviceAccountKey.json" à la racine du projet
 *    (ou définir la variable d'environnement GOOGLE_APPLICATION_CREDENTIALS=/chemin/vers/cle.json)
 * 3. Exécuter : node seed.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier de seed JSON
const SEED_FILE_PATH = path.resolve(__dirname, 'mooc_zikisso_seed.json');

// Chemins possibles pour la clé de compte de service Firebase Admin
const POSSIBLE_KEY_PATHS = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  path.resolve(__dirname, 'serviceAccountKey.json'),
  path.resolve(__dirname, 'firebase-service-account.json'),
  path.resolve(__dirname, 'firebase_service_account.json'),
].filter(Boolean);

console.log('====================================================');
console.log('🚀 INITIALISATION DU PEUPLEMENT FIRESTORE (SEED)');
console.log('   MOOC Zikisso — Collectivités Locales & Numérique');
console.log('====================================================\n');

// 1. Recherche du fichier serviceAccountKey.json
let serviceAccountPath = null;
for (const p of POSSIBLE_KEY_PATHS) {
  if (p && fs.existsSync(p)) {
    serviceAccountPath = p;
    break;
  }
}

if (!serviceAccountPath) {
  console.error('❌ ERREUR : Clé de compte de service Firebase introuvable !\n');
  console.error('👉 Veuillez suivre ces étapes :');
  console.error('1. Rendez-vous sur la Console Firebase : https://console.firebase.google.com/');
  console.error('2. Sélectionnez votre projet Firebase.');
  console.error('3. Cliquez sur ⚙️ (Paramètres du projet) > Onglet "Comptes de service".');
  console.error('4. Cliquez sur "Générer une nouvelle clé privée", puis confirmez.');
  console.error('5. Enregistrez le fichier JSON à la racine du projet sous le nom :');
  console.error('   serviceAccountKey.json');
  console.error('\nPuis relancez : node seed.js\n');
  process.exit(1);
}

// 2. Initialisation de Firebase Admin SDK
try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log(`✅ Connexion Firebase Admin réussie avec : ${path.basename(serviceAccountPath)}`);
} catch (err) {
  console.error('❌ Erreur lors de l\'initialisation de Firebase Admin :', err.message);
  process.exit(1);
}

const db = admin.firestore();

// 3. Lecture du fichier mooc_zikisso_seed.json
if (!fs.existsSync(SEED_FILE_PATH)) {
  console.error(`❌ Fichier introuvable : ${SEED_FILE_PATH}`);
  process.exit(1);
}

const seedData = JSON.parse(fs.readFileSync(SEED_FILE_PATH, 'utf8'));
console.log(`📖 Fichier JSON chargé avec succès : "${seedData.meta?.title}"\n`);

// Fonction utilitaire de conversion des options de quiz (ex: A, B, C, D -> index 0, 1, 2, 3)
const parseQuizQuestions = (rawQuestions) => {
  if (!Array.isArray(rawQuestions)) return [];
  const letterMap = { A: 0, B: 1, C: 2, D: 3, a: 0, b: 1, c: 2, d: 3 };

  return rawQuestions.map((q, idx) => {
    let correctIndex = 0;
    if (typeof q.correct === 'number') {
      correctIndex = q.correct;
    } else if (typeof q.correct === 'string' && letterMap[q.correct] !== undefined) {
      correctIndex = letterMap[q.correct];
    } else if (typeof q.correctAnswer === 'number') {
      correctIndex = q.correctAnswer;
    }

    return {
      id: idx + 1,
      question: q.q || q.question || '',
      options: q.options || [],
      correctAnswer: correctIndex,
      explanation: q.explain || q.explanation || '',
      correctLetter: q.correct || 'A',
    };
  });
};

// Fonction utilitaire de conversion des grilles de notation
const parseExerciseGrid = (rawGrid) => {
  if (!Array.isArray(rawGrid)) return [];
  return rawGrid.map((item, idx) => ({
    id: `c${idx + 1}`,
    libelle: item.critere || item.libelle || `Critère ${idx + 1}`,
    pointsMax: item.points || item.pointsMax || 5,
    description: item.description || '',
  }));
};

async function runSeed() {
  const batch = db.batch();
  let operationsCount = 0;

  console.log('📦 Préparation des documents Firestore...\n');

  // --- 1. COLLECTION "weeks" ---
  // Un document par semaine (avec alias standardisés 's1' et 'semaine-1' pour assurer la compatibilité)
  if (Array.isArray(seedData.weeks)) {
    for (const week of seedData.weeks) {
      const parsedQuiz = parseQuizQuestions(week.quiz);
      const parsedGrid = parseExerciseGrid(week.exercise?.grid);

      const weekDocPayload = {
        id: week.id,
        ordre: week.order,
        titre: week.title,
        objectifs: week.objectifs,
        capsules: week.capsules || [],
        exercice: {
          id: `semaine-${week.order}`,
          titre: week.exercise?.title || `Exercice Fil Rouge — Semaine ${week.order}`,
          enonce: week.exercise?.statement || '',
          corrige: week.exercise?.corrige || [],
          grilleNotation: parsedGrid,
        },
        quiz: parsedQuiz,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Insertion sous l'id 's1', 's2', etc. (spécifié dans le JSON)
      const refShort = db.collection('weeks').doc(week.id);
      batch.set(refShort, weekDocPayload, { merge: true });
      operationsCount++;

      // Insertion également sous l'id 'semaine-1', 'semaine-2' (utilisé dans les routes du client web)
      const refLong = db.collection('weeks').doc(`semaine-${week.order}`);
      batch.set(refLong, { ...weekDocPayload, id: `semaine-${week.order}` }, { merge: true });
      operationsCount++;

      console.log(`  ✓ Semaine ${week.order} préparée : "${week.title}" (IDs: '${week.id}', 'semaine-${week.order}')`);
    }
  }

  // --- 2. COLLECTION "moduleBonus" ---
  if (seedData.moduleBonus) {
    const bonus = seedData.moduleBonus;
    const parsedBonusQuiz = parseQuizQuestions(bonus.quiz);
    const parsedBonusGrid = parseExerciseGrid(bonus.exercise?.grid);

    const bonusPayload = {
      id: bonus.id || 'bonus',
      titre: bonus.title,
      objectifs: bonus.objectifs,
      capsules: bonus.capsules || [],
      exercice: {
        id: 'module-bonus',
        titre: bonus.exercise?.title || 'Exercice Fil Rouge — Module Bonus',
        enonce: bonus.exercise?.statement || '',
        corrige: bonus.exercise?.corrige || [],
        grilleNotation: parsedBonusGrid,
      },
      quiz: parsedBonusQuiz,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Document principal dans 'moduleBonus/main'
    const refBonusMain = db.collection('moduleBonus').doc('main');
    batch.set(refBonusMain, bonusPayload, { merge: true });
    operationsCount++;

    // Document également sous 'moduleBonus/bonus'
    const refBonusBonus = db.collection('moduleBonus').doc(bonus.id || 'bonus');
    batch.set(refBonusBonus, bonusPayload, { merge: true });
    operationsCount++;

    // Également dans 'weeks/module-bonus' pour affichage direct via /semaine/module-bonus
    const refBonusWeek = db.collection('weeks').doc('module-bonus');
    batch.set(refBonusWeek, { ...bonusPayload, id: 'module-bonus', ordre: 5 }, { merge: true });
    operationsCount++;

    console.log(`  ✓ Module Bonus préparé : "${bonus.title}"`);
  }

  // --- 3. COLLECTION "examFinal" ---
  if (seedData.examFinal) {
    const exam = seedData.examFinal;
    const parsedExamQcm = parseQuizQuestions(exam.qcm);
    const parsedExamGrid = parseExerciseGrid(exam.caseStudy?.grid);

    const examPayload = {
      id: exam.id || 'exam',
      titre: exam.title,
      intro: exam.intro || '',
      bareme: exam.bareme || '',
      questions: parsedExamQcm,
      quiz: parsedExamQcm,
      etudeDeCas: {
        id: 'examFinal_etudeDeCas',
        titre: exam.caseStudy?.title || 'Le Guichet Unique de Zikisso',
        enonce: exam.caseStudy?.statement || '',
        corrige: exam.caseStudy?.corrige || [],
        grilleNotation: parsedExamGrid,
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Document dans 'examFinal/main'
    const refExamMain = db.collection('examFinal').doc('main');
    batch.set(refExamMain, examPayload, { merge: true });
    operationsCount++;

    // Document dans 'examFinal/qcm'
    const refExamQcm = db.collection('examFinal').doc('qcm');
    batch.set(refExamQcm, { questions: parsedExamQcm }, { merge: true });
    operationsCount++;

    // Également dans 'weeks/examen-final'
    const refExamWeek = db.collection('weeks').doc('examen-final');
    batch.set(
      refExamWeek,
      {
        id: 'examen-final',
        ordre: 6,
        titre: exam.title,
        intro: exam.intro || '',
        capsules: [],
        quiz: parsedExamQcm,
        exercice: examPayload.etudeDeCas,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    operationsCount++;

    console.log(`  ✓ Examen Final Général préparé (12 questions QCM + Étude de cas)`);
  }

  // --- 4. COLLECTION "glossary" ---
  if (seedData.annexes?.glossaryC) {
    const rawGlossary = seedData.annexes.glossaryC;
    const glossaryItems = rawGlossary.map(([terme, definition]) => ({
      terme,
      definition,
    }));

    const refGlossaryMain = db.collection('glossary').doc('main');
    batch.set(
      refGlossaryMain,
      {
        titre: 'Glossaire Officiel des Collectivités Locales & Numérique',
        termes: glossaryItems,
        total: glossaryItems.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    operationsCount++;

    console.log(`  ✓ Glossaire préparé (${glossaryItems.length} définitions institutionnelles)`);
  }

  // --- 5. COLLECTION "toolboxResources" ---
  if (seedData.annexes) {
    const annexes = seedData.annexes;

    // A. Boîte à outils
    if (annexes.toolboxA) {
      const refToolbox = db.collection('toolboxResources').doc('toolboxA');
      batch.set(
        refToolbox,
        {
          titre: annexes.toolboxA.title,
          outils: annexes.toolboxA.items || [],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      operationsCount++;
    }

    // B. Carnet de bord
    if (annexes.logbookB) {
      const refLogbook = db.collection('toolboxResources').doc('logbookB');
      batch.set(
        refLogbook,
        {
          titre: annexes.logbookB.title,
          rubriques: annexes.logbookB.fieldsPerModule || [],
          modules: annexes.logbookB.modules || [],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      operationsCount++;
    }

    // C. Charte d'engagement civique
    if (annexes.charter) {
      const refCharter = db.collection('toolboxResources').doc('charter');
      batch.set(
        refCharter,
        {
          titre: annexes.charter.title,
          engagements: annexes.charter.commitments || [],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      operationsCount++;
    }

    // D. Passerelle Ambassadeur & Écosophie territoriale (ECT)
    const refAdditions = db.collection('toolboxResources').doc('additionalGuides');
    batch.set(
      refAdditions,
      {
        bridge: seedData.bridge || null,
        ectOpening: seedData.ectOpening || null,
        recommendations: seedData.productionRecommendations || [],
        certificationWeighting: seedData.certification || null,
        meta: seedData.meta || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    operationsCount++;

    console.log(`  ✓ Ressources et Boîte à Outils préparées (Trame délibération, Carnet de bord, Charte civique)`);
  }

  console.log('\n🔒 Sécurité & Intégrité des données utilisateurs :');
  console.log('   - Aucune modification apportée à la collection "users"');
  console.log('   - Aucune modification apportée à la collection "submissions"');
  console.log('   - Aucune modification apportée à la collection "quizAttempts"');
  console.log('   - Aucune modification apportée à la collection "certificates"');

  // Exécution du batch de commit
  console.log(`\n⏳ Écriture en cours de ${operationsCount} documents dans Firestore...`);
  await batch.commit();

  console.log('\n====================================================');
  console.log('🎉 PEUPLEMENT FIRESTORE TERMINÉ AVEC SUCCÈS !');
  console.log('====================================================');
  console.log('Les collections suivantes sont désormais opérationnelles :');
  console.log('  • weeks (4 semaines complètes)');
  console.log('  • moduleBonus (Module de participation citoyenne)');
  console.log('  • examFinal (12 questions QCM + Étude de cas)');
  console.log('  • glossary (Glossaire des termes)');
  console.log('  • toolboxResources (Outils communaux et charte)');
  console.log('====================================================\n');

  process.exit(0);
}

runSeed().catch((err) => {
  console.error('\n❌ Échec du peuplement Firestore :', err);
  process.exit(1);
});
