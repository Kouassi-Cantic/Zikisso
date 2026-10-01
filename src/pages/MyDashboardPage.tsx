import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { QuizAttempt, SubmissionData } from '../types';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  Loader2, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  User, 
  CheckSquare, 
  FileEdit 
} from 'lucide-react';
import { CertificateManager } from '../components/CertificateManager';
import { MayorMessageModal } from '../components/MayorMessageModal';
import { Building2, Quote } from 'lucide-react';

const LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY = 'zikisso_local_quiz_attempts';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'zikisso_local_submissions';

interface ModuleTrack {
  id: string;
  name: string;
  badge: string;
  type: 'semaine' | 'bonus' | 'examen';
}

const TRACKED_MODULES: ModuleTrack[] = [
  { id: 'semaine-1', name: 'Fondamentaux de la Décentralisation', badge: 'Semaine 1', type: 'semaine' },
  { id: 'semaine-2', name: 'Gestion Budgétaire & Finances Locales', badge: 'Semaine 2', type: 'semaine' },
  { id: 'semaine-3', name: 'Services Publics & Urbanisme', badge: 'Semaine 3', type: 'semaine' },
  { id: 'semaine-4', name: 'Transformation Digitale & E-Services', badge: 'Semaine 4', type: 'semaine' },
  { id: 'module-bonus', name: 'Boîte à Outils Numériques & Cybersécurité', badge: 'Module Bonus', type: 'bonus' },
  { id: 'examen-final', name: 'Évaluation Globale & Certification', badge: 'Examen Final', type: 'examen' },
];

export const MyDashboardPage: React.FC = () => {
  const { currentUser, userData } = useAuth();

  const [quizAttempts, setQuizAttempts] = useState<Record<string, QuizAttempt>>({});
  const [submissions, setSubmissions] = useState<Record<string, SubmissionData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMayorModalOpen, setIsMayorModalOpen] = useState<boolean>(false);

  const fetchData = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);

    const quizMap: Record<string, QuizAttempt> = {};
    const subMap: Record<string, SubmissionData> = {};

    if (isFirebaseConfigured) {
      try {
        // 1. Récupération des quiz
        const qQuiz = query(collection(db, 'quizAttempts'), where('uid', '==', currentUser.uid));
        const snapQuiz = await getDocs(qQuiz);
        snapQuiz.forEach((doc) => {
          const data = { id: doc.id, ...(doc.data() as any) } as QuizAttempt;
          // Conserver la tentative la plus récente si multiple
          if (!quizMap[data.quizId] || new Date(data.date).getTime() > new Date(quizMap[data.quizId].date).getTime()) {
            quizMap[data.quizId] = data;
          }
        });

        // 2. Récupération des soumissions d'exercices
        const qSub = query(collection(db, 'submissions'), where('uid', '==', currentUser.uid));
        const snapSub = await getDocs(qSub);
        snapSub.forEach((doc) => {
          const data = { id: doc.id, ...(doc.data() as any) } as SubmissionData;
          if (!subMap[data.exerciceId] || new Date(data.dateEnvoi).getTime() > new Date(subMap[data.exerciceId].dateEnvoi).getTime()) {
            subMap[data.exerciceId] = data;
          }
        });

        setQuizAttempts(quizMap);
        setSubmissions(subMap);
      } catch (err: any) {
        console.error('Erreur chargement données de progression:', err);
        setError('Impossible de synchroniser toutes les données. Affichage du dernier état disponible.');
      } finally {
        setLoading(false);
      }
    } else {
      // Mode simulation secours local
      try {
        const rawQuiz = localStorage.getItem(LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY);
        if (rawQuiz) {
          const list: QuizAttempt[] = JSON.parse(rawQuiz);
          list.filter((a) => a.uid === currentUser.uid).forEach((a) => {
            if (!quizMap[a.quizId] || new Date(a.date).getTime() > new Date(quizMap[a.quizId].date).getTime()) {
              quizMap[a.quizId] = a;
            }
          });
        }

        const rawSub = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
        if (rawSub) {
          const listSub: SubmissionData[] = JSON.parse(rawSub);
          listSub.filter((s) => s.uid === currentUser.uid).forEach((s) => {
            if (!subMap[s.exerciceId] || new Date(s.dateEnvoi).getTime() > new Date(subMap[s.exerciceId].dateEnvoi).getTime()) {
              subMap[s.exerciceId] = s;
            }
          });
        }

        setQuizAttempts(quizMap);
        setSubmissions(subMap);
      } catch (e) {
        console.warn('Erreur lecture données locales de progression:', e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // --- CALCUL DES NOTES SELON LA PONDÉRATION OFFICIELLE ---
  // Formule demandée :
  // 1. Moyenne des 4 exercices fil rouge (S1 à S4) × coefficient 3
  // 2. Moyenne des 4 quiz hebdomadaires (S1 à S4) × coefficient 1
  // 3. Note du Module Bonus (exercice + quiz) × coefficient 2
  // 4. Note de l'Examen Final Général × coefficient 4
  // Le tout ramené sur 20 (Somme des coefficients = 3 + 1 + 2 + 4 = 10, donc somme pondérée / 10).

  const weeksIds = ['semaine-1', 'semaine-2', 'semaine-3', 'semaine-4'];

  // 1. Exercices fil rouge (S1 à S4)
  let sumExos = 0;
  let gradedExosCount = 0;
  weeksIds.forEach((id) => {
    const sub = submissions[id];
    if (sub && sub.statut === 'noté' && sub.note !== undefined) {
      const noteSur20 = (sub.note / (sub.totalPointsMax || 20)) * 20;
      sumExos += noteSur20;
      gradedExosCount++;
    }
  });
  const moyenneExercicesSur20 = gradedExosCount > 0 ? sumExos / 4 : 0;

  // 2. Quiz hebdomadaires (S1 à S4)
  let sumQuiz = 0;
  let quizPassedCount = 0;
  weeksIds.forEach((id) => {
    const att = quizAttempts[id];
    if (att) {
      const noteSur20 = (att.score / (att.totalQuestions || 5)) * 20;
      sumQuiz += noteSur20;
      quizPassedCount++;
    }
  });
  const moyenneQuizSur20 = quizPassedCount > 0 ? sumQuiz / 4 : 0;

  // 3. Module Bonus (exercice + quiz)
  const bonusQuiz = quizAttempts['module-bonus'];
  const bonusSub = submissions['module-bonus'];
  const noteQuizBonusSur20 = bonusQuiz ? (bonusQuiz.score / (bonusQuiz.totalQuestions || 5)) * 20 : 0;
  const noteExoBonusSur20 = bonusSub && bonusSub.statut === 'noté' && bonusSub.note !== undefined
    ? (bonusSub.note / (bonusSub.totalPointsMax || 20)) * 20
    : 0;

  let noteBonusSur20 = 0;
  if (bonusQuiz && bonusSub && bonusSub.statut === 'noté') {
    noteBonusSur20 = (noteQuizBonusSur20 + noteExoBonusSur20) / 2;
  } else if (bonusQuiz) {
    noteBonusSur20 = noteQuizBonusSur20;
  } else if (bonusSub && bonusSub.statut === 'noté') {
    noteBonusSur20 = noteExoBonusSur20;
  }

  // 4. Examen Final Général : (Note QCM × 40 %) + (Note Étude de cas × 60 %)
  const examAtt = quizAttempts['examen-final'];
  const noteQcmExamSur20 = examAtt ? (examAtt.score / (examAtt.totalQuestions || 12)) * 20 : 0;
  const examSub = submissions['examFinal_etudeDeCas'] || submissions['examen-final'];
  const noteCaseExamSur20 = examSub && examSub.statut === 'noté' && examSub.note !== undefined
    ? (examSub.note / (examSub.totalPointsMax || 20)) * 20
    : 0;

  let noteExamenFinalSur20 = 0;
  if (examAtt && examSub && examSub.statut === 'noté') {
    noteExamenFinalSur20 = Math.round(((noteQcmExamSur20 * 0.4) + (noteCaseExamSur20 * 0.6)) * 10) / 10;
  } else if (examAtt && (!examSub || examSub.statut !== 'noté')) {
    noteExamenFinalSur20 = Math.round((noteQcmExamSur20 * 0.4) * 10) / 10;
  } else if (examSub && examSub.statut === 'noté' && !examAtt) {
    noteExamenFinalSur20 = Math.round((noteCaseExamSur20 * 0.6) * 10) / 10;
  }

  // 5. Note globale pondérée sur 20
  // Coeffs : Exos (3) + Quiz (1) + Bonus (2) + Examen (4) = 10
  const totalPoids = 10;
  const sommePonderee =
    (moyenneExercicesSur20 * 3) +
    (moyenneQuizSur20 * 1) +
    (noteBonusSur20 * 2) +
    (noteExamenFinalSur20 * 4);

  const noteGlobaleSur20 = Math.round((sommePonderee / totalPoids) * 10) / 10;

  // --- INDICATEUR DE COMPLÉTION DU PARCOURS (11 ACTIVITÉS CLÉS) ---
  // - 4 Quiz hebdomadaires
  // - 4 Exercices hebdomadaires
  // - 1 Quiz Bonus
  // - 1 Exercice Bonus
  // - 1 Examen Final
  const totalActivities = 11;
  let completedActivities = 0;

  weeksIds.forEach((id) => {
    if (quizAttempts[id]) completedActivities++;
    if (submissions[id]) completedActivities++;
  });
  if (quizAttempts['module-bonus']) completedActivities++;
  if (submissions['module-bonus']) completedActivities++;
  if (quizAttempts['examen-final']) completedActivities++;

  const completionPercentage = Math.round((completedActivities / totalActivities) * 100);

  return (
    <div className="space-y-8 pb-16">
      
      {/* En-tête institutionnel de la page */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F5FA] text-[#1F4E79] border border-[#1F4E79]/20 mb-2">
              <User className="w-3.5 h-3.5" />
              <span>Dossier Pédagogique Individuel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4E79] tracking-tight">
              Mon Tableau de Bord Pédagogique
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Consultez vos résultats aux quiz, le statut d'évaluation de vos devoirs fil rouge,
              votre progression globale et le relevé des notes officiel du MOOC Zikisso.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F4E79] bg-slate-100 hover:bg-slate-200 rounded transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser mes notes</span>
            </button>
          </div>
        </div>

        {/* Indicateur visuel de complétion du parcours */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#1A6B3C]" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Progression dans le parcours MOOC
              </span>
            </div>
            <span className="text-xs font-bold text-[#1F4E79]">
              {completedActivities} / {totalActivities} activités terminées ({completionPercentage}%)
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-[#1F4E79] to-[#1A6B3C] h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
            <span>Début du parcours</span>
            <span>Attestation &amp; Fin de formation</span>
          </div>
        </div>
      </div>

      {/* Cartes de synthèse : Note Globale & Pondération Officielle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carte 1 : Note Globale Calculée sur 20 */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-sm mb-2">
              <Award className="w-5 h-5 text-[#C55A11]" />
              <span>Note Globale de Formation</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Calculée selon la pondération officielle du comité pédagogique de Zikisso.
            </p>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#1F4E79]">
                {noteGlobaleSur20}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 20</span>
            </div>

            <div className="mt-3">
              {noteGlobaleSur20 >= 12 ? (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-bold bg-[#F0F7F2] text-[#14532D] border border-[#1A6B3C]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1A6B3C]" />
                  <span>Seuil de certification atteint (≥ 12/20)</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#FDF4ED] text-[#A3480C] border border-[#C55A11]/30">
                  <Clock className="w-3.5 h-3.5 text-[#C55A11]" />
                  <span>En cours d'acquisition (Seuil : 12/20)</span>
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Total des coefficients : <strong>10</strong> (ramené sur 20).
          </div>
        </div>

        {/* Carte 2 : Détail des 4 Composantes Pondérées */}
        <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider mb-4 flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-[#1A6B3C]" />
            <span>Barème &amp; Pondérations Réglementaires</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* 1. Exercices fil rouge (Coeff 3) */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">Exercices Fil Rouge (S1-S4)</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#1F4E79] text-white">Coeff. 3</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Moyenne des 4 devoirs écrits</p>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Note moyenne :</span>
                <strong className="text-sm text-[#1F4E79]">
                  {Math.round(moyenneExercicesSur20 * 10) / 10} / 20
                </strong>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {gradedExosCount} / 4 devoir(s) noté(s)
              </span>
            </div>

            {/* 2. Quiz hebdomadaires (Coeff 1) */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">Quiz Hebdomadaires (S1-S4)</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#1A6B3C] text-white">Coeff. 1</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Moyenne des 4 QCM de validation</p>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Note moyenne :</span>
                <strong className="text-sm text-[#1A6B3C]">
                  {Math.round(moyenneQuizSur20 * 10) / 10} / 20
                </strong>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {quizPassedCount} / 4 quiz validé(s)
              </span>
            </div>

            {/* 3. Module Bonus (Coeff 2) */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">Module Bonus</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#C55A11] text-white">Coeff. 2</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Exercice pratique + Quiz de sécurité</p>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Note combinée :</span>
                <strong className="text-sm text-[#C55A11]">
                  {Math.round(noteBonusSur20 * 10) / 10} / 20
                </strong>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Quiz : {Math.round(noteQuizBonusSur20 * 10) / 10}/20 • Devoir : {Math.round(noteExoBonusSur20 * 10) / 10}/20
              </span>
            </div>

            {/* 4. Examen Final Général (Coeff 4) */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">Examen Final Général</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#1F4E79] text-white">Coeff. 4</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Épreuve terminale de synthèse</p>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600">Note d'examen :</span>
                <strong className="text-sm text-[#1F4E79]">
                  {Math.round(noteExamenFinalSur20 * 10) / 10} / 20
                </strong>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {examAtt ? '✓ Épreuve complétée' : 'Épreuve non encore passée'}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Section Certification & Attestation Officielle (Téléchargement PDF) */}
      <CertificateManager noteGlobale={noteGlobaleSur20} />

      {/* Section 1 : Suivi détaillé des Exercices Fil Rouge */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-[#F0F5FA] border-b border-[#1F4E79]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-base">
              <FileEdit className="w-5 h-5 text-[#1F4E79]" />
              <h2>Exercices Fil Rouge Soumis</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Statut d'évaluation par l'administration communale et notes attribuées.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded border border-slate-200 text-slate-700">
            Coeff. 3 sur la note finale
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {TRACKED_MODULES.filter((m) => m.type !== 'examen').map((module) => {
            const sub = submissions[module.id];
            const isGraded = sub?.statut === 'noté';

            return (
              <div
                key={module.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#1F4E79] text-white">
                      {module.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {module.name}
                    </span>
                  </div>

                  {sub ? (
                    <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                      <p>
                        Envoyé le{' '}
                        {new Date(sub.dateEnvoi).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}{' '}
                        • {sub.texte?.trim().split(/\s+/).length || 0} mots
                      </p>
                      {sub.commentaire && (
                        <p className="text-slate-700 italic bg-amber-50/70 p-2 rounded border border-amber-200/60 mt-2">
                          « {sub.commentaire} »
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1">
                      Aucun devoir soumis pour le moment.
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-auto flex-shrink-0">
                  {sub ? (
                    isGraded ? (
                      <div className="text-right">
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#14532D] bg-[#F0F7F2] border border-[#1A6B3C]/30 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1A6B3C]" />
                          <span>Noté : {sub.note} / {sub.totalPointsMax || 20}</span>
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Ramené : {Math.round(((sub.note || 0) / (sub.totalPointsMax || 20)) * 20 * 10) / 10} / 20
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#A3480C] bg-[#FDF4ED] border border-[#C55A11]/30 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-[#C55A11]" />
                        <span>En attente de notation</span>
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-slate-400 italic">Non rendu</span>
                  )}

                  <Link
                    to={`/semaine/${module.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-[#1F4E79] hover:text-[#C55A11] transition-colors"
                  >
                    <span>{sub ? 'Consulter' : 'Rédiger'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2 : Suivi détaillé des Quiz */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-[#F0F7F2] border-b border-[#1A6B3C]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-[#14532D] font-bold text-base">
              <CheckSquare className="w-5 h-5 text-[#1A6B3C]" />
              <h2>Historique des Quiz &amp; Évaluations QCM</h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Scores obtenus aux questionnaires interactifs hebdomadaires et examens.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded border border-slate-200 text-slate-700">
            Coeff. 1 (Quiz) • Coeff. 4 (Examen)
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {TRACKED_MODULES.map((module) => {
            const attempt = quizAttempts[module.id];
            const isPassing = attempt ? (attempt.score / (attempt.totalQuestions || 5)) >= 0.6 : false;

            return (
              <div
                key={module.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        module.type === 'bonus'
                          ? 'bg-[#C55A11] text-white'
                          : module.type === 'examen'
                          ? 'bg-[#1F4E79] text-white'
                          : 'bg-[#1A6B3C] text-white'
                      }`}
                    >
                      {module.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {module.name}
                    </span>
                  </div>

                  {attempt ? (
                    <p className="text-xs text-slate-500 mt-1">
                      Dernière tentative enregistrée le{' '}
                      {new Date(attempt.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1">
                      Quiz non encore passé.
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-auto flex-shrink-0">
                  {attempt ? (
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full border ${
                          isPassing
                            ? 'bg-[#F0F7F2] text-[#14532D] border-[#1A6B3C]/30'
                            : 'bg-[#FDF4ED] text-[#A3480C] border-[#C55A11]/30'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {attempt.score} / {attempt.totalQuestions || 5} questions
                        </span>
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        Ramené : {Math.round((attempt.score / (attempt.totalQuestions || 5)) * 20 * 10) / 10} / 20
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Non effectué</span>
                  )}

                  <Link
                    to={`/semaine/${module.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-[#1F4E79] hover:text-[#C55A11] transition-colors"
                  >
                    <span>{attempt ? 'Repasser' : 'Commencer'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
