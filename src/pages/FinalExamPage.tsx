import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { QuizQuestion, QuizAttempt, SubmissionData } from '../types';
import { Quiz } from '../components/Quiz';
import { SubmissionForm } from '../components/SubmissionForm';
import { DEFAULT_QUIZZES } from '../data/defaultQuizzes';
import { DEFAULT_EXERCISES } from '../data/defaultExercises';
import { 
  Award, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  BookOpen, 
  FileEdit, 
  HelpCircle, 
  CheckSquare2, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

const LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY = 'zikisso_local_quiz_attempts';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'zikisso_local_submissions';

export const FinalExamPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Questions QCM de synthèse
  const [qcmQuestions, setQcmQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);

  // Tentative QCM
  const [qcmAttempt, setQcmAttempt] = useState<QuizAttempt | null>(null);

  // Soumission Étude de cas
  const [caseSubmission, setCaseSubmission] = useState<SubmissionData | null>(null);

  const [loadingResults, setLoadingResults] = useState<boolean>(true);

  // 1. Chargement des 12 questions QCM depuis Firestore (document "examFinal") avec fallback
  const fetchQcmQuestions = async () => {
    setLoadingQuestions(true);

    if (isFirebaseConfigured) {
      try {
        // Tentative de lecture du document "examFinal"
        let foundQuestions: QuizQuestion[] | null = null;

        // Option A : doc "examFinal" dans collection "weeks"
        const docRefWeek = doc(db, 'weeks', 'examen-final');
        const snapWeek = await getDoc(docRefWeek);
        if (snapWeek.exists() && snapWeek.data().quiz && snapWeek.data().quiz.length >= 10) {
          foundQuestions = snapWeek.data().quiz;
        }

        // Option B : doc "main" ou "questions" dans collection "examFinal"
        if (!foundQuestions) {
          const docRefExam = doc(db, 'examFinal', 'main');
          const snapExam = await getDoc(docRefExam);
          if (snapExam.exists()) {
            const data = snapExam.data();
            foundQuestions = data.questions || data.quiz || null;
          }
        }

        // Option C : doc "qcm" dans collection "examFinal"
        if (!foundQuestions) {
          const docRefQcm = doc(db, 'examFinal', 'qcm');
          const snapQcm = await getDoc(docRefQcm);
          if (snapQcm.exists()) {
            const data = snapQcm.data();
            foundQuestions = data.questions || data.quiz || null;
          }
        }

        if (foundQuestions && foundQuestions.length > 0) {
          setQcmQuestions(foundQuestions);
        } else {
          // Utilisation des 12 questions de synthèse officielles par défaut
          setQcmQuestions(DEFAULT_QUIZZES['examFinal'] || DEFAULT_QUIZZES['examen-final'] || []);
        }
      } catch (err) {
        console.warn('Erreur lecture Firestore examFinal, chargement des questions par défaut:', err);
        setQcmQuestions(DEFAULT_QUIZZES['examFinal'] || DEFAULT_QUIZZES['examen-final'] || []);
      } finally {
        setLoadingQuestions(false);
      }
    } else {
      setQcmQuestions(DEFAULT_QUIZZES['examFinal'] || DEFAULT_QUIZZES['examen-final'] || []);
      setLoadingQuestions(false);
    }
  };

  // 2. Chargement des résultats de l'apprenant (QCM et Étude de cas)
  const fetchUserExamData = async () => {
    if (!currentUser) {
      setLoadingResults(false);
      return;
    }

    setLoadingResults(true);

    if (isFirebaseConfigured) {
      try {
        // Tentative QCM (quizId: 'examen-final')
        const qQuiz = query(
          collection(db, 'quizAttempts'),
          where('uid', '==', currentUser.uid),
          where('quizId', '==', 'examen-final'),
          limit(5)
        );
        const snapQuiz = await getDocs(qQuiz);
        if (!snapQuiz.empty) {
          const list = snapQuiz.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as QuizAttempt[];
          list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setQcmAttempt(list[0]);
        }

        // Soumission Étude de cas (exerciceId: 'examFinal_etudeDeCas')
        const qSub = query(
          collection(db, 'submissions'),
          where('uid', '==', currentUser.uid),
          where('exerciceId', '==', 'examFinal_etudeDeCas'),
          limit(1)
        );
        const snapSub = await getDocs(qSub);
        if (!snapSub.empty) {
          const docData = snapSub.docs[0];
          setCaseSubmission({ id: docData.id, ...(docData.data() as any) } as SubmissionData);
        }
      } catch (err) {
        console.warn('Erreur chargement résultats examen Firebase:', err);
      } finally {
        setLoadingResults(false);
      }
    } else {
      // Mode simulation secours local
      try {
        const rawQuiz = localStorage.getItem(LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY);
        if (rawQuiz) {
          const list: QuizAttempt[] = JSON.parse(rawQuiz);
          const found = list
            .filter((a) => a.uid === currentUser.uid && a.quizId === 'examen-final')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          if (found.length > 0) setQcmAttempt(found[0]);
        }

        const rawSub = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
        if (rawSub) {
          const listSub: SubmissionData[] = JSON.parse(rawSub);
          const foundSub = listSub.find(
            (s) => s.uid === currentUser.uid && s.exerciceId === 'examFinal_etudeDeCas'
          );
          if (foundSub) setCaseSubmission(foundSub);
        }
      } catch (e) {
        console.warn('Erreur lecture données locales examen:', e);
      } finally {
        setLoadingResults(false);
      }
    }
  };

  useEffect(() => {
    fetchQcmQuestions();
    fetchUserExamData();
  }, [currentUser]);

  // Callback lorsque l'apprenant termine le QCM
  const handleQcmComplete = (score: number, total: number) => {
    setQcmAttempt({
      uid: currentUser?.uid || '',
      quizId: 'examen-final',
      score,
      totalQuestions: total,
      date: new Date().toISOString(),
      reponses: {},
    });
  };

  // --- CALCUL DU BARÈME OFFICIEL ---
  // Formule demandée :
  // note finale = (note QCM/20 × 40 %) + (note étude de cas/20 × 60 %)
  // seuil de réussite : 12/20

  const hasTakenQcm = !!qcmAttempt;
  const qcmTotalQuestions = qcmAttempt?.totalQuestions || qcmQuestions.length || 12;
  const noteQcmSur20 = qcmAttempt ? (qcmAttempt.score / qcmTotalQuestions) * 20 : 0;

  const hasSubmittedCase = !!caseSubmission;
  const isCaseGraded = caseSubmission?.statut === 'noté' && caseSubmission.note !== undefined;
  const noteCaseSur20 = isCaseGraded
    ? (caseSubmission.note! / (caseSubmission.totalPointsMax || 20)) * 20
    : 0;

  // Calcul pondéré officiel
  const noteFinaleExamenSur20 =
    Math.round(((noteQcmSur20 * 0.4) + (noteCaseSur20 * 0.6)) * 10) / 10;

  const isExamPassed = hasTakenQcm && isCaseGraded && noteFinaleExamenSur20 >= 12;

  const caseStudyExercise = DEFAULT_EXERCISES['examFinal_etudeDeCas'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Bouton retour et fil d'Ariane */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#1F4E79] hover:text-[#C55A11] transition-colors bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au programme de formation</span>
        </Link>

        <span className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider bg-[#F0F5FA] px-2.5 py-1 rounded border border-[#1F4E79]/20">
          Épreuve Certifiante Terminale
        </span>
      </div>

      {/* En-tête officiel de l'Examen Final Général */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F5FA] text-[#1F4E79] border border-[#1F4E79]/25 mb-2">
              <Award className="w-4 h-4 text-[#C55A11]" />
              <span>Examen Final Général • MOOC Zikisso</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4E79] tracking-tight">
              Évaluation Globale des Compétences &amp; Certification
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Cette épreuve terminale valide l'ensemble des connaissances institutionnelles, budgétaires,
              urbaines et numériques acquises durant le parcours de formation des acteurs communaux.
            </p>
          </div>

          <button
            onClick={fetchUserExamData}
            className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F4E79] bg-slate-100 hover:bg-slate-200 rounded transition"
            title="Actualiser les résultats d'examen"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Panneau de présentation du Barème Officiel */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="bg-[#F0F5FA] border-l-4 border-[#1F4E79] p-5 rounded-r-lg">
            <h2 className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1A6B3C]" />
              <span>Règlement de l'Épreuve &amp; Modalités de Calcul</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3">
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="font-bold text-[#1F4E79] block mb-0.5">Partie 1 : QCM de Synthèse</span>
                <span className="text-slate-600">12 questions couvrant les 4 semaines</span>
                <strong className="block text-[#1F4E79] mt-1 text-sm">Pondération : 40 %</strong>
              </div>

              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="font-bold text-[#1F4E79] block mb-0.5">Partie 2 : Étude de Cas Pratique</span>
                <span className="text-slate-600">"Le Guichet Unique de Zikisso" (4 axes)</span>
                <strong className="block text-[#1F4E79] mt-1 text-sm">Pondération : 60 %</strong>
              </div>

              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="font-bold text-[#1A6B3C] block mb-0.5">Validation &amp; Réussite</span>
                <span className="text-slate-600">Note finale = (QCM × 40 %) + (Cas × 60 %)</span>
                <strong className="block text-[#1A6B3C] mt-1 text-sm">Seuil d'admission : 12 / 20</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau récapitulatif des notes de l'apprenant à l'examen */}
        <div className="mt-6 p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Note QCM */}
            <div className="flex-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Partie 1 : QCM (40 %)
              </span>
              {hasTakenQcm ? (
                <div className="mt-1">
                  <span className="text-xl font-extrabold text-[#1F4E79]">
                    {Math.round(noteQcmSur20 * 10) / 10} / 20
                  </span>
                  <span className="text-xs text-slate-500 ml-2">
                    ({qcmAttempt?.score}/{qcmTotalQuestions} bonnes réponses)
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic block mt-1">
                  Non effectuée — Voir ci-dessous
                </span>
              )}
            </div>

            {/* Note Étude de cas */}
            <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Partie 2 : Étude de Cas (60 %)
              </span>
              {isCaseGraded ? (
                <div className="mt-1">
                  <span className="text-xl font-extrabold text-[#1A6B3C]">
                    {Math.round(noteCaseSur20 * 10) / 10} / 20
                  </span>
                  <span className="text-xs text-[#14532D] ml-2 font-medium">✓ Évalué par le correcteur</span>
                </div>
              ) : hasSubmittedCase ? (
                <span className="inline-flex items-center space-x-1 text-xs text-[#A3480C] bg-[#FDF4ED] px-2 py-0.5 rounded font-semibold mt-1">
                  <Clock className="w-3.5 h-3.5 text-[#C55A11]" />
                  <span>En attente de notation admin</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400 italic block mt-1">
                  Non soumise — Voir ci-dessous
                </span>
              )}
            </div>

            {/* Note Finale d'Examen */}
            <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Note Finale d'Examen (/20)
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1F4E79]">
                  {noteFinaleExamenSur20}
                </span>
                <span className="text-slate-400 text-sm font-semibold">/ 20</span>
              </div>
              <div className="mt-1">
                {isExamPassed ? (
                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#14532D] bg-[#F0F7F2] px-2 py-0.5 rounded border border-[#1A6B3C]/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A6B3C]" />
                    <span>Examen Validé (Admis)</span>
                  </span>
                ) : (hasTakenQcm && isCaseGraded) ? (
                  <span className="text-xs font-bold text-red-600">
                    Non validé (Inférieur à 12/20)
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">
                    En attente des deux parties
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PARTIE 1 : QUESTIONNAIRE À CHOIX MULTIPLES (12 QUESTIONS DE SYNTHÈSE) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="bg-[#1F4E79] text-white p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded bg-[#1A6B3C] text-white flex items-center justify-center font-bold text-sm">
              1
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Partie 1 : Questionnaire à Choix Multiples (QCM)
              </h2>
              <p className="text-xs text-blue-100">
                12 questions de synthèse • Pondération : 40 % de la note finale d'examen
              </p>
            </div>
          </div>

          <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded border border-white/20">
            {qcmQuestions.length} Questions
          </span>
        </div>

        {loadingQuestions ? (
          <div className="bg-white rounded-lg border border-slate-200 p-10 text-center shadow-sm">
            <Loader2 className="w-7 h-7 animate-spin text-[#1F4E79] mx-auto mb-2" />
            <span className="text-xs text-slate-500 font-medium">
              Chargement des 12 questions de synthèse de l'examen final...
            </span>
          </div>
        ) : (
          <Quiz
            quizId="examen-final"
            questions={qcmQuestions}
            title="QCM de Synthèse — 12 Questions d'Examen Final"
            onComplete={handleQcmComplete}
          />
        )}
      </section>

      {/* ========================================================================= */}
      {/* PARTIE 2 : ÉTUDE DE CAS PROFESSIONNELLE ("GUICHET UNIQUE DE ZIKISSO") */}
      {/* ========================================================================= */}
      <section className="space-y-4 pt-4 border-t-2 border-slate-200">
        <div className="bg-[#1F4E79] text-white p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded bg-[#C55A11] text-white flex items-center justify-center font-bold text-sm">
              2
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Partie 2 : Étude de Cas Professionnelle
              </h2>
              <p className="text-xs text-blue-100">
                Mémoire opérationnel "Le Guichet Unique de Zikisso" • Pondération : 60 % de la note finale
              </p>
            </div>
          </div>

          <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded border border-white/20">
            Grille à 4 Critères (20 pts)
          </span>
        </div>

        {/* Intégration du composant SubmissionForm avec la soumission spéciale "examFinal_etudeDeCas" */}
        <SubmissionForm exercice={caseStudyExercise} />
      </section>

    </div>
  );
};
