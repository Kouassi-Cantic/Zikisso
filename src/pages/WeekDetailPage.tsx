import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { WeekData, QuizQuestion, ExerciceFilRouge } from '../types';
import { Quiz } from '../components/Quiz';
import { SubmissionForm } from '../components/SubmissionForm';
import { DEFAULT_QUIZZES } from '../data/defaultQuizzes';
import { DEFAULT_EXERCISES } from '../data/defaultExercises';
import { 
  ArrowLeft, 
  Target, 
  BookOpen, 
  FileText, 
  Clock, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Info,
  CheckSquare
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
    defaultTitre: 'Boîte à Outils Numériques & Cybersécurité des Collectivités',
    quizTitle: 'Quiz d’Évaluation — Module Bonus : Cybersécurité & Outils Numériques',
  },
  'examen-final': {
    badge: 'Examen Final Général',
    defaultTitre: 'Évaluation Globale des Compétences & Certification',
    quizTitle: 'Partie 1 (QCM) — Examen Final Général du MOOC Zikisso',
  },
};

export const WeekDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackInfo = (id && MODULE_TITLES_FALLBACK[id]) || {
    badge: 'Module',
    defaultTitre: id?.toUpperCase() || 'Module de formation',
    quizTitle: 'Quiz d’évaluation des compétences',
  };

  // Questions du quiz : celles du document Firestore en priorité, sinon les questions par défaut
  const activeQuizQuestions: QuizQuestion[] = 
    (weekData?.quiz && weekData.quiz.length > 0)
      ? weekData.quiz
      : (id && DEFAULT_QUIZZES[id]) || [];

  // Exercice fil rouge pour la semaine ou le module bonus
  const activeExercice: ExerciceFilRouge | null = 
    (weekData?.exercice && weekData.exercice.enonce)
      ? (weekData.exercice as ExerciceFilRouge)
      : (id && DEFAULT_EXERCISES[id]) || null;

  const loadWeekContent = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured) {
      setWeekData(null);
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, 'weeks', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setWeekData({ id: docSnap.id, ...(docSnap.data() as any) });
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'weeks'), where('id', '==', id));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const firstDoc = querySnap.docs[0];
        setWeekData({ id: firstDoc.id, ...(firstDoc.data() as any) });
      } else {
        setWeekData(null);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement de la semaine depuis Firestore:', err);
      setError(
        'Impossible de contacter la base de données. Veuillez vérifier votre connexion Internet et réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeekContent();
  }, [id]);

  return (
    <div className="space-y-8 pb-16">
      {/* Bouton retour vers le tableau de bord */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#1F4E79] hover:text-[#C55A11] transition-colors bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </Link>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {fallbackInfo.badge}
        </span>
      </div>

      {/* Indicateur de chargement explicite */}
      {loading && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#1F4E79] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#1F4E79]">
            Chargement des contenus pédagogiques...
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Récupération des capsules et des objectifs depuis Firestore
          </p>
        </div>
      )}

      {/* Message d'erreur réseau explicite */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800">
                Erreur de chargement du module
              </h3>
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

      {/* Cas où le document n'existe pas encore dans Firestore : "Contenu à venir" pour les capsules */}
      {!loading && !error && !weekData && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#F0F5FA] border-b border-[#1F4E79]/15 p-6 sm:p-8">
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#1F4E79] text-white mb-2">
                {fallbackInfo.badge}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1F4E79]">
                {fallbackInfo.defaultTitre}
              </h1>
            </div>

            <div className="p-8 sm:p-10 text-center max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-[#FDF4ED] text-[#C55A11] flex items-center justify-center mx-auto mb-4 border border-[#C55A11]/20">
                <Clock className="w-7 h-7 text-[#C55A11]" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                Contenu à venir
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Les supports de cours rédigés pour ce module seront automatiquement peuplés
                lors du chargement des contenus officiels (Prompt 7).
              </p>

              <div className="inline-flex items-center space-x-2 text-xs bg-slate-100 text-slate-600 px-3 py-2 rounded-md border border-slate-200">
                <Info className="w-4 h-4 text-[#1F4E79]" />
                <span>Document Firestore attendu : <code className="font-mono font-semibold">weeks/{id}</code></span>
              </div>
            </div>
          </div>

          {/* Section d'évaluation Quiz interactive */}
          {activeQuizQuestions.length > 0 && id && (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-lg">
                <CheckSquare className="w-5 h-5 text-[#1A6B3C]" />
                <h2>Évaluation formative du module</h2>
              </div>
              <Quiz
                quizId={id}
                questions={activeQuizQuestions}
                title={fallbackInfo.quizTitle}
              />
            </section>
          )}

          {/* Section Exercice Fil Rouge (disponible sur Semaines 1 à 4 et Module Bonus) */}
          {activeExercice && id !== 'examen-final' && (
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <SubmissionForm exercice={activeExercice} />
            </section>
          )}
        </div>
      )}

      {/* Affichage du contenu complet quand le document Firestore existe */}
      {!loading && !error && weekData && (
        <div className="space-y-8">
          
          <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#1A6B3C] text-white mb-2">
              {fallbackInfo.badge}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4E79] tracking-tight">
              {weekData.titre || fallbackInfo.defaultTitre}
            </h1>
          </div>

          {weekData.objectifs && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-base mb-4 border-b border-slate-100 pb-3">
                <Target className="w-5 h-5 text-[#1A6B3C]" />
                <h2>Objectifs d'apprentissage</h2>
              </div>

              {Array.isArray(weekData.objectifs) ? (
                <ul className="space-y-2.5">
                  {weekData.objectifs.map((objectif, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A6B3C] mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{objectif}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {weekData.objectifs}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-base">
                <BookOpen className="w-5 h-5 text-[#1F4E79]" />
                <h2>Capsules de cours</h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {weekData.capsules?.length || 0} capsule(s)
              </span>
            </div>

            {(!weekData.capsules || weekData.capsules.length === 0) ? (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-xs sm:text-sm text-slate-500">
                Aucune capsule rédigée pour le moment dans ce module.
              </div>
            ) : (
              <div className="space-y-4">
                {weekData.capsules.map((capsule, index) => (
                  <article
                    key={capsule.id || index}
                    className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <div className="bg-[#F0F5FA] border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-7 h-7 rounded bg-[#1F4E79] text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <h3 className="text-base font-bold text-[#1F4E79]">
                          {capsule.title}
                        </h3>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Capsule {index + 1}</span>
                      </span>
                    </div>

                    <div className="p-6 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {capsule.content}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Section Quiz hebdomadaire / QCM intégrée */}
          {activeQuizQuestions.length > 0 && id && (
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2 text-[#1F4E79] font-bold text-lg">
                <CheckSquare className="w-5 h-5 text-[#1A6B3C]" />
                <h2>
                  {id === 'examen-final'
                    ? "Partie 1 : Questionnaire à Choix Multiples (QCM)"
                    : id === 'module-bonus'
                    ? "Quiz d'auto-évaluation du Module Bonus"
                    : "Quiz hebdomadaire de validation des acquis"}
                </h2>
              </div>
              <Quiz
                quizId={id}
                questions={activeQuizQuestions}
                title={fallbackInfo.quizTitle}
              />
            </section>
          )}

          {/* Section Exercice Fil Rouge (disponible sur Semaines 1 à 4 et Module Bonus) */}
          {activeExercice && id !== 'examen-final' && (
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <SubmissionForm exercice={activeExercice} />
            </section>
          )}

        </div>
      )}
    </div>
  );
};
