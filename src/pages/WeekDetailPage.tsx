import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import type { WeekData, QuizQuestion, ExerciceFilRouge } from '../types';
import { Quiz } from '../components/Quiz';
import { SubmissionForm } from '../components/SubmissionForm';
import { CapsuleCard } from '../components/CapsuleCard';
import { AudioReader } from '../components/AudioReader';
import { DEFAULT_QUIZZES } from '../data/defaultQuizzes';
import { DEFAULT_EXERCISES } from '../data/defaultExercises';
import { DEFAULT_WEEKS } from '../data/defaultWeeks';
import { 
  ArrowLeft, 
  Target, 
  BookOpen, 
  Clock, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  CheckSquare,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const MODULE_TITLES_FALLBACK: Record<string, { badge: string; defaultTitre: string; quizTitle: string }> = {
  'semaine-1': {
    badge: 'Semaine 1',
    defaultTitre: 'Fondamentaux de la Décentralisation & Cadre Institutionnel Ivoirien',
    quizTitle: 'Quiz Hebdomadaire — Semaine 1 : Institutions & Compétences Communales',
  },
  'semaine-2': {
    badge: 'Semaine 2',
    defaultTitre: 'Gestion Budgétaire, Finances Locales & Mobilisation des Ressources',
    quizTitle: 'Quiz Hebdomadaire — Semaine 2 : Finances & Budget Communal',
  },
  'semaine-3': {
    badge: 'Semaine 3',
    defaultTitre: 'Services Publics Municipaux, Urbanisme & Gestion Territoriale',
    quizTitle: 'Quiz Hebdomadaire — Semaine 3 : Services Municipaux & Aménagement',
  },
  'semaine-4': {
    badge: 'Semaine 4',
    defaultTitre: 'Transformation Digitale, E-Administration & Démocratie Participative',
    quizTitle: 'Quiz Hebdomadaire — Semaine 4 : Numérisation & Démocratie Participative',
  },
  'module-bonus': {
    badge: 'Module Bonus',
    defaultTitre: 'Redevabilité, Cybersécurité & Participation Citoyenne',
    quizTitle: 'Quiz d’Évaluation — Module Bonus : Cybersécurité & Participation',
  },
  'examen-final': {
    badge: 'Examen Final Général',
    defaultTitre: 'Évaluation Globale des Compétences & Certification',
    quizTitle: 'Partie 1 (QCM) — Examen Final Général du MOOC Zikisso',
  },
};

const LOCAL_STORAGE_READ_CAPSULES_KEY = 'zikisso_read_capsules';

export const WeekDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();

  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [readCapsules, setReadCapsules] = useState<string[]>([]);

  const fallbackInfo = (id && MODULE_TITLES_FALLBACK[id]) || {
    badge: 'Module',
    defaultTitre: id?.toUpperCase() || 'Module de formation',
    quizTitle: 'Quiz d’évaluation des compétences',
  };

  // Chargement des capsules déjà lues par l'apprenant (localStorage + Firestore)
  useEffect(() => {
    if (!currentUser) return;
    try {
      const storageKey = `${LOCAL_STORAGE_READ_CAPSULES_KEY}_${currentUser.uid}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setReadCapsules(JSON.parse(saved));
      }
    } catch (e) {}
  }, [currentUser]);

  // Bascule de l'état "Lu et assimilé" pour une capsule
  const handleToggleRead = async (capsuleId: string) => {
    if (!currentUser) return;

    const fullCapsuleKey = `${id}_${capsuleId}`;
    let updated: string[];

    if (readCapsules.includes(fullCapsuleKey)) {
      updated = readCapsules.filter((k) => k !== fullCapsuleKey);
    } else {
      updated = [...readCapsules, fullCapsuleKey];
    }

    setReadCapsules(updated);

    // Sauvegarde locale instantanée
    try {
      const storageKey = `${LOCAL_STORAGE_READ_CAPSULES_KEY}_${currentUser.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    // Synchronisation Firestore si configuré
    if (isFirebaseConfigured) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          readCapsules: updated,
        });
      } catch (err) {
        // non bloquant
      }
    }
  };

  const loadWeekContent = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // Fallback par défaut enrichi
    const defaultData = DEFAULT_WEEKS[id] || null;

    if (!isFirebaseConfigured) {
      setWeekData(defaultData);
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, 'weeks', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const firestoreData = { id: docSnap.id, ...(docSnap.data() as any) };
        // S'assurer que les capsules existent, sinon compléter avec les capsules par défaut
        if (!firestoreData.capsules || firestoreData.capsules.length === 0) {
          firestoreData.capsules = defaultData?.capsules || [];
        }
        setWeekData(firestoreData);
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'weeks'), where('id', '==', id));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const firstDoc = querySnap.docs[0];
        const firestoreData = { id: firstDoc.id, ...(firstDoc.data() as any) };
        if (!firestoreData.capsules || firestoreData.capsules.length === 0) {
          firestoreData.capsules = defaultData?.capsules || [];
        }
        setWeekData(firestoreData);
      } else {
        // Repli transparent sur les données officielles
        setWeekData(defaultData);
      }
    } catch (err: any) {
      console.warn('Chargement Firestore indisponible, utilisation du cours local:', err);
      setWeekData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeekContent();
  }, [id]);

  // Détermination des capsules actives
  const activeCapsules = weekData?.capsules || (id && DEFAULT_WEEKS[id]?.capsules) || [];

  // Calcul du temps total de lecture estimé
  const totalReadingTime = activeCapsules.reduce((acc, c: any) => acc + (c.dureeMinutes || 6), 0);

  // Calcul du taux de complétion des capsules pour cette semaine
  const completedCapsulesCount = activeCapsules.filter((c) =>
    readCapsules.includes(`${id}_${c.id}`)
  ).length;
  const progressPercent = activeCapsules.length > 0
    ? Math.round((completedCapsulesCount / activeCapsules.length) * 100)
    : 0;

  // Questions du quiz
  const activeQuizQuestions: QuizQuestion[] = 
    (weekData?.quiz && weekData.quiz.length > 0)
      ? weekData.quiz
      : (id && DEFAULT_QUIZZES[id]) || [];

  // Exercice fil rouge
  const activeExercice: ExerciceFilRouge | null = 
    (weekData?.exercice && weekData.exercice.enonce)
      ? (weekData.exercice as ExerciceFilRouge)
      : (id && DEFAULT_EXERCISES[id]) || null;

  // Texte complet des objectifs pour la lecture audio
  const objectifsText = weekData?.objectifs
    ? Array.isArray(weekData.objectifs)
      ? `Objectifs d'apprentissage de cette semaine : ${weekData.objectifs.join('. ')}`
      : `Objectifs d'apprentissage de cette semaine : ${weekData.objectifs}`
    : '';

  return (
    <div className="space-y-8 pb-16">
      {/* Barre de retour et fil d'ariane */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#1F4E79] hover:text-[#C55A11] transition-colors bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-white px-3 py-1 rounded-md border border-slate-200">
            {fallbackInfo.badge}
          </span>
          {totalReadingTime > 0 && (
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#1F4E79] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              <Clock className="w-3.5 h-3.5 text-[#C55A11]" />
              <span>⏱ {totalReadingTime} min de lecture totale</span>
            </span>
          )}
        </div>
      </div>

      {/* Chargement en cours */}
      {loading && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#1F4E79] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#1F4E79]">
            Chargement des contenus pédagogiques...
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Préparation des capsules, synthèse audio et évaluations
          </p>
        </div>
      )}

      {/* Message d'erreur si échec complet */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800">Erreur de chargement</h3>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <button
                onClick={loadWeekContent}
                className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Réessayer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de la semaine */}
      {!loading && (weekData || activeCapsules.length > 0) && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Bannière titre & Progression granulaire des capsules */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#1A6B3C] text-white mb-2">
                  {fallbackInfo.badge}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F4E79] tracking-tight">
                  {weekData?.titre || fallbackInfo.defaultTitre}
                </h1>
              </div>

              {/* Jauge de complétion des capsules */}
              {activeCapsules.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-w-[200px]">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span className="flex items-center space-x-1 text-[#1F4E79]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1A6B3C]" />
                      <span>Capsules assimilées</span>
                    </span>
                    <span className="text-[#1A6B3C] font-mono">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1A6B3C] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 text-right">
                    {completedCapsulesCount} sur {activeCapsules.length} lue(s)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section Objectifs d'apprentissage avec AudioReader */}
          {weekData?.objectifs && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-base">
                  <Target className="w-5 h-5 text-[#1A6B3C]" />
                  <h2>Objectifs d'apprentissage clés</h2>
                </div>

                {/* Synthèse audio native pour les objectifs */}
                {objectifsText && (
                  <AudioReader
                    text={objectifsText}
                    title={`Objectifs de la ${fallbackInfo.badge}`}
                    variant="button"
                  />
                )}
              </div>

              {Array.isArray(weekData.objectifs) ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {weekData.objectifs.map((objectif, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 bg-slate-50/80 p-3 rounded-lg border border-slate-100"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#1A6B3C] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{objectif}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/80 p-4 rounded-lg border border-slate-100">
                  {weekData.objectifs}
                </p>
              )}
            </div>
          )}

          {/* Section Capsules de cours avec lecture native & validation */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-base sm:text-lg">
                <BookOpen className="w-5 h-5 text-[#1F4E79]" />
                <h2>Capsules théoriques du cours</h2>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Cliquez sur « Écouter » pour lancer la lecture vocale native</span>
              </div>
            </div>

            {activeCapsules.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-xs sm:text-sm text-slate-500">
                Aucune capsule disponible pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {activeCapsules.map((capsule, index) => {
                  const isRead = readCapsules.includes(`${id}_${capsule.id}`);
                  return (
                    <CapsuleCard
                      key={capsule.id || index}
                      id={capsule.id}
                      orderNumber={index + 1}
                      title={capsule.title}
                      content={capsule.content}
                      dureeMinutes={(capsule as any).dureeMinutes || 6}
                      isRead={isRead}
                      onToggleRead={handleToggleRead}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Section Quiz hebdomadaire / QCM */}
          {activeQuizQuestions.length > 0 && id && (
            <section className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-lg">
                <CheckSquare className="w-5 h-5 text-[#1A6B3C]" />
                <h2>
                  {id === 'examen-final'
                    ? "Partie 1 : Questionnaire à Choix Multiples (QCM)"
                    : id === 'module-bonus'
                    ? "Quiz d'auto-évaluation du Module Bonus"
                    : `Quiz de validation des acquis — ${fallbackInfo.badge}`}
                </h2>
              </div>
              <Quiz
                quizId={id}
                questions={activeQuizQuestions}
                title={fallbackInfo.quizTitle}
              />
            </section>
          )}

          {/* Section Exercice Fil Rouge */}
          {activeExercice && id !== 'examen-final' && (
            <section className="space-y-4 pt-6 border-t border-slate-200">
              <SubmissionForm exercice={activeExercice} />
            </section>
          )}

        </div>
      )}
    </div>
  );
};
