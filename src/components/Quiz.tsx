import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import type { QuizQuestion, QuizAttempt } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Loader2, 
  Check, 
  AlertCircle, 
  FileCheck2 
} from 'lucide-react';

interface QuizProps {
  quizId: string;
  questions: QuizQuestion[];
  title?: string;
  onComplete?: (score: number, total: number) => void;
}

const LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY = 'zikisso_local_quiz_attempts';

export const Quiz: React.FC<QuizProps> = ({ quizId, questions, title, onComplete }) => {
  const { currentUser } = useAuth();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  // Sauvegarde et statut réseau
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Historique de tentative préalable
  const [previousAttempt, setPreviousAttempt] = useState<QuizAttempt | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  // Chargement de la dernière tentative enregistrée pour ce quiz
  useEffect(() => {
    let isMounted = true;
    const loadPreviousAttempt = async () => {
      if (!currentUser || !quizId) {
        setIsLoadingHistory(false);
        return;
      }

      setIsLoadingHistory(true);

      if (isFirebaseConfigured) {
        try {
          const q = query(
            collection(db, 'quizAttempts'),
            where('uid', '==', currentUser.uid),
            where('quizId', '==', quizId),
            limit(5)
          );
          const snap = await getDocs(q);
          if (isMounted && !snap.empty) {
            // Prendre la tentative la plus récente
            const attempts = snap.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as any),
            })) as QuizAttempt[];
            attempts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setPreviousAttempt(attempts[0]);
          }
        } catch (err) {
          console.warn('Erreur lecture tentative quiz Firebase:', err);
        }
      } else {
        // Mode local fallback
        try {
          const raw = localStorage.getItem(LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY);
          if (raw) {
            const list: QuizAttempt[] = JSON.parse(raw);
            const found = list
              .filter((a) => a.uid === currentUser.uid && a.quizId === quizId)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            if (isMounted && found.length > 0) {
              setPreviousAttempt(found[0]);
            }
          }
        } catch (err) {
          console.warn('Erreur lecture tentative locale:', err);
        }
      }

      if (isMounted) setIsLoadingHistory(false);
    };

    loadPreviousAttempt();
    return () => {
      isMounted = false;
    };
  }, [currentUser, quizId]);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-xs sm:text-sm text-slate-500">
        Aucune question configurée pour ce quiz actuellement.
      </div>
    );
  }

  // Clic sur une option de réponse
  const handleSelectOption = (optionIndex: number) => {
    // Si la question en cours a déjà reçu une réponse, on fige le choix
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  // Passage à la question suivante ou finalisation
  const handleNext = async () => {
    if (selectedOption === null) return;

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Fin du quiz : calcul du score
      let calculatedScore = 0;
      questions.forEach((q, idx) => {
        const answer = idx === currentIndex ? selectedOption : userAnswers[idx];
        if (answer === q.correctAnswer) {
          calculatedScore += 1;
        }
      });

      setFinalScore(calculatedScore);
      setIsCompleted(true);

      if (onComplete) {
        onComplete(calculatedScore, totalQuestions);
      }

      // Enregistrement dans Firestore (collection "quizAttempts")
      await recordAttempt(calculatedScore, {
        ...userAnswers,
        [currentIndex]: selectedOption,
      });
    }
  };

  // Enregistrement de la tentative
  const recordAttempt = async (score: number, finalAnswers: Record<number, number>) => {
    if (!currentUser) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const attemptData: QuizAttempt = {
      uid: currentUser.uid,
      userId: currentUser.uid,
      quizId,
      score,
      totalQuestions,
      date: new Date().toISOString(),
      reponses: finalAnswers,
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'quizAttempts'), {
          ...attemptData,
          createdAt: serverTimestamp(),
        });
        setSaveSuccess(true);
        setPreviousAttempt(attemptData);
      } catch (err: any) {
        console.error('Erreur enregistrement quizAttempts Firestore:', err);
        setSaveError('Connexion instable : le résultat a été sauvegardé en mémoire locale.');
        // Sauvegarde de secours locale
        saveToLocalStorage(attemptData);
      } finally {
        setIsSaving(false);
      }
    } else {
      // Sauvegarde mode local
      saveToLocalStorage(attemptData);
      setSaveSuccess(true);
      setPreviousAttempt(attemptData);
      setIsSaving(false);
    }
  };

  const saveToLocalStorage = (attempt: QuizAttempt) => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY);
      const list: QuizAttempt[] = raw ? JSON.parse(raw) : [];
      list.push(attempt);
      localStorage.setItem(LOCAL_STORAGE_QUIZ_ATTEMPTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Erreur sauvegarde locale du quiz:', e);
    }
  };

  // Réinitialisation pour repasser le quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setUserAnswers({});
    setIsCompleted(false);
    setFinalScore(0);
    setSaveSuccess(false);
    setSaveError(null);
  };

  const hasAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQuestion.correctAnswer;
  const letters = ['A', 'B', 'C', 'D'];

  // Écran d'accueil si l'utilisateur a déjà complété le quiz et qu'on ne l'a pas encore redémarré
  if (previousAttempt && !isCompleted && currentIndex === 0 && selectedOption === null) {
    const prevPercent = Math.round(
      (previousAttempt.score / (previousAttempt.totalQuestions || totalQuestions)) * 100
    );

    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-3 text-[#1F4E79] font-bold text-lg mb-4 border-b border-slate-100 pb-3">
          <FileCheck2 className="w-6 h-6 text-[#1A6B3C]" />
          <h3>{title || 'Évaluation / Quiz interactif'}</h3>
        </div>

        <div className="p-4 rounded-md bg-[#F0F7F2] border border-[#1A6B3C]/20 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider block mb-1">
              Dernière tentative enregistrée
            </span>
            <p className="text-sm font-bold text-slate-800">
              Score obtenu :{' '}
              <span className="text-[#1A6B3C]">
                {previousAttempt.score} / {previousAttempt.totalQuestions || totalQuestions}
              </span>{' '}
              ({prevPercent}%)
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Passé le {new Date(previousAttempt.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <button
            onClick={() => setPreviousAttempt(null)}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-[#1F4E79] hover:bg-[#153755] text-white text-xs sm:text-sm font-semibold rounded-md shadow-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repasser ce quiz</span>
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Vous pouvez repasser l'évaluation autant de fois que nécessaire pour consolider vos acquis.
        </p>
      </div>
    );
  }

  // Écran final des résultats
  if (isCompleted) {
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    const isPassing = percentage >= 60;

    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="text-center max-w-md mx-auto">
          
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
              isPassing
                ? 'bg-[#F0F7F2] text-[#1A6B3C] border-[#1A6B3C]/30'
                : 'bg-[#FDF4ED] text-[#C55A11] border-[#C55A11]/30'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#1F4E79]">
            {isPassing ? 'Félicitations !' : 'Évaluation terminée'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isPassing
              ? 'Vous avez validé cette évaluation avec succès.'
              : 'Une relecture attentive des capsules est conseillée pour renforcer vos acquis.'}
          </p>

          {/* Affichage du score calculé sur 5 (ou sur le total de questions) */}
          <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Score obtenu
            </span>
            <div className="text-4xl font-extrabold text-[#1F4E79] mt-1">
              <span className={finalScore >= totalQuestions * 0.6 ? 'text-[#1A6B3C]' : 'text-[#C55A11]'}>
                {finalScore}
              </span>{' '}
              <span className="text-2xl text-slate-400 font-normal">/ {totalQuestions}</span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Taux de réussite : <strong>{percentage}%</strong>
            </p>

            {/* Barre de progression du score */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-500 ${
                  isPassing ? 'bg-[#1A6B3C]' : 'bg-[#C55A11]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Statut de persistance Firestore */}
          <div className="mb-6">
            {isSaving && (
              <div className="inline-flex items-center space-x-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-[#1F4E79]" />
                <span>Enregistrement de votre tentative dans Firestore...</span>
              </div>
            )}

            {!isSaving && saveSuccess && (
              <div className="inline-flex items-center space-x-1.5 text-xs text-[#14532D] bg-[#F0F7F2] border border-[#1A6B3C]/30 px-3 py-1.5 rounded-md font-medium">
                <Check className="w-4 h-4 text-[#1A6B3C]" />
                <span>Résultat consigné dans votre dossier apprenant (collection quizAttempts)</span>
              </div>
            )}

            {!isSaving && saveError && (
              <div className="inline-flex items-center space-x-1.5 text-xs text-[#A3480C] bg-[#FDF4ED] border border-[#C55A11]/30 px-3 py-1.5 rounded-md font-medium">
                <AlertCircle className="w-4 h-4 text-[#C55A11]" />
                <span>{saveError}</span>
              </div>
            )}
          </div>

          {/* Action recommencer */}
          <div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#1F4E79] hover:bg-[#153755] text-white text-sm font-semibold rounded-md shadow transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer le quiz</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Écran d'affichage d'une question à la fois
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
      
      {/* En-tête du quiz : Titre et barre de progression */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1F4E79]">
            {title || 'Quiz d’évaluation des connaissances'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sélectionnez l'option correcte pour chaque énoncé
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
            Question {currentIndex + 1} sur {totalQuestions}
          </span>
        </div>
      </div>

      {/* Barre de progression questions */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-[#1F4E79] h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Énoncé de la question courante */}
      <div className="mb-6">
        <h4 className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
          {currentQuestion.question}
        </h4>
      </div>

      {/* 4 Options de réponse cliquables */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((optionText, optionIdx) => {
          const isThisSelected = selectedOption === optionIdx;
          const isThisCorrect = optionIdx === currentQuestion.correctAnswer;

          let optionStyle = 'border-slate-200 hover:border-[#1F4E79] hover:bg-slate-50 text-slate-800';
          let badgeStyle = 'bg-slate-100 text-slate-600 border-slate-300';
          let icon = null;

          if (hasAnswered) {
            if (isThisCorrect) {
              // Bonne réponse en VERT #1A6B3C
              optionStyle = 'border-[#1A6B3C] bg-[#F0F7F2] text-[#14532D] font-medium shadow-sm';
              badgeStyle = 'bg-[#1A6B3C] text-white border-[#1A6B3C]';
              icon = <CheckCircle2 className="w-5 h-5 text-[#1A6B3C] flex-shrink-0" />;
            } else if (isThisSelected && !isThisCorrect) {
              // Réponse incorrecte en ROUGE
              optionStyle = 'border-red-500 bg-red-50 text-red-800 font-medium';
              badgeStyle = 'bg-red-600 text-white border-red-600';
              icon = <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
            } else {
              // Options non choisies après réponse
              optionStyle = 'border-slate-200 opacity-60 text-slate-500';
              badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
            }
          }

          return (
            <button
              key={optionIdx}
              type="button"
              onClick={() => handleSelectOption(optionIdx)}
              disabled={hasAnswered}
              className={`w-full text-left p-3.5 sm:p-4 rounded-lg border transition-all flex items-start space-x-3 ${optionStyle}`}
            >
              {/* Badge lettre A, B, C, D */}
              <span
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold border flex-shrink-0 mt-0.5 ${badgeStyle}`}
              >
                {letters[optionIdx]}
              </span>

              {/* Texte de l'option */}
              <span className="flex-1 text-xs sm:text-sm leading-relaxed">
                {optionText}
              </span>

              {/* Icône de validation / erreur */}
              {icon}
            </button>
          );
        })}
      </div>

      {/* Affichage immédiat de l'explication après clic sur une option */}
      {hasAnswered && (
        <div
          role="alert"
          className={`p-4 rounded-lg border mb-6 transition-all duration-300 ${
            isCorrect
              ? 'bg-[#F0F7F2] border-[#1A6B3C]/30 text-[#14532D]'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm mb-1.5">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#1A6B3C]" />
                <span className="text-[#1A6B3C]">Bonne réponse !</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-700">Réponse incorrecte</span>
              </>
            )}
          </div>

          {currentQuestion.explanation && (
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 mt-1 pl-6 border-l-2 border-slate-300">
              <strong>Explication :</strong> {currentQuestion.explanation}
            </p>
          )}
        </div>
      )}

      {/* Bouton de progression : Suivant ou Terminer */}
      {hasAnswered && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1F4E79] hover:bg-[#153755] text-white text-xs sm:text-sm font-semibold rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-2"
          >
            <span>{currentIndex < totalQuestions - 1 ? 'Question suivante' : 'Terminer le quiz'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
