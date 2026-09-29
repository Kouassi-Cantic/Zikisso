import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  FileCheck2 
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

interface CourseCardMeta {
  id: string;
  badge: string;
  titre: string;
  description: string;
  type: 'semaine' | 'bonus' | 'examen';
  dureeEstimee: string;
}

const MODULES_LIST: CourseCardMeta[] = [
  {
    id: 'semaine-1',
    badge: 'Semaine 1',
    titre: 'Fondamentaux de la Décentralisation & Cadre Institutionnel Ivoirien',
    description: 'Organisation administrative, compétences communales de Zikisso, et responsabilités des élus et agents locaux.',
    type: 'semaine',
    dureeEstimee: '3 à 4 heures',
  },
  {
    id: 'semaine-2',
    badge: 'Semaine 2',
    titre: 'Gestion Budgétaire, Finances Locales & Mobilisation des Ressources',
    description: 'Élaboration du budget communal, fiscalité locale, recouvrement des taxes et transparence des comptes publics.',
    type: 'semaine',
    dureeEstimee: '3 à 4 heures',
  },
  {
    id: 'semaine-3',
    badge: 'Semaine 3',
    titre: 'Services Publics Municipaux, Urbanisme & Gestion Territoriale',
    description: 'Pilotage de l’état civil, voirie, assainissement, salubrité publique et aménagement du territoire communal.',
    type: 'semaine',
    dureeEstimee: '3 à 4 heures',
  },
  {
    id: 'semaine-4',
    badge: 'Semaine 4',
    titre: 'Transformation Digitale, E-Administration & Démocratie Participative',
    description: 'Dématérialisation des démarches administratives, inclusion numérique et concertation active des citoyens de Zikisso.',
    type: 'semaine',
    dureeEstimee: '3 à 4 heures',
  },
  {
    id: 'module-bonus',
    badge: 'Module Bonus',
    titre: 'Boîte à Outils Numériques & Cybersécurité des Collectivités',
    description: 'Guides pratiques, protection des données personnelles communales et bonnes pratiques informatiques quotidiennes.',
    type: 'bonus',
    dureeEstimee: '2 heures',
  },
  {
    id: 'examen-final',
    badge: 'Examen Final Général',
    titre: 'Évaluation Globale des Compétences & Certification',
    description: 'Épreuve terminale de validation des acquis pour l’obtention de l’attestation de réussite du MOOC Zikisso.',
    type: 'examen',
    dureeEstimee: '2 heures',
  },
];

export const DashboardPage: React.FC = () => {
  const { userData, currentUser } = useAuth();
  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchQuickProgress = async () => {
      if (!currentUser) return;
      let count = 0;
      if (isFirebaseConfigured) {
        try {
          const qQuiz = query(collection(db, 'quizAttempts'), where('uid', '==', currentUser.uid));
          const qSub = query(collection(db, 'submissions'), where('uid', '==', currentUser.uid));
          const [snapQuiz, snapSub] = await Promise.all([getDocs(qQuiz), getDocs(qSub)]);
          if (isMounted) {
            count = snapQuiz.size + snapSub.size;
            setCompletedCount(count);
          }
        } catch (e) {
          // Silencieux
        }
      } else {
        try {
          const rawQuiz = localStorage.getItem('zikisso_local_quiz_attempts');
          const rawSub = localStorage.getItem('zikisso_local_submissions');
          const countQ = rawQuiz ? JSON.parse(rawQuiz).filter((q: any) => q.uid === currentUser.uid).length : 0;
          const countS = rawSub ? JSON.parse(rawSub).filter((s: any) => s.uid === currentUser.uid).length : 0;
          if (isMounted) setCompletedCount(countQ + countS);
        } catch (e) {}
      }
    };
    fetchQuickProgress();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const completionPercent = Math.min(100, Math.round((completedCount / 11) * 100));

  return (
    <div className="space-y-8">
      
      {/* En-tête de bienvenue personnalisé */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0F7F2] text-[#1A6B3C] border border-[#1A6B3C]/20 mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Session active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4E79] tracking-tight">
              Bienvenue, {userData?.nom || currentUser?.email}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Plateforme de formation continue des acteurs communaux et des forces vives de Zikisso. 
              Accédez ci-dessous à votre parcours pédagogique ou consultez votre suivi individuel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 text-xs font-semibold bg-[#1F4E79] text-white rounded-md">
              Profil : {userData?.profil || 'Non renseigné'}
            </span>
            <span
              className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                userData?.role === 'admin'
                  ? 'bg-[#C55A11] text-white'
                  : 'bg-[#1A6B3C] text-white'
              }`}
            >
              Rôle : {userData?.role === 'admin' ? 'Administrateur' : 'Apprenant'}
            </span>
          </div>
        </div>

        {/* Accès direct à "Mon tableau de bord" personnel */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F0F5FA] p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#1F4E79] text-white flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#1F4E79]">
                Mon Tableau de Bord Pédagogique (Relevé &amp; Progression)
              </p>
              <p className="text-[11px] text-slate-500">
                Suivi des 4 quiz, devoirs fil rouge notés, calcul de la note globale sur 20 ({completionPercent}% du parcours complété).
              </p>
            </div>
          </div>

          <Link
            to="/mon-tableau-de-bord"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition flex-shrink-0"
          >
            <span>Consulter mon tableau de bord</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Citation institutionnelle en police serif */}
      <div className="p-5 rounded-lg bg-[#F0F5FA] border-l-4 border-[#1F4E79]">
        <blockquote className="quote-serif italic text-base sm:text-lg text-slate-700">
          « La bonne gouvernance locale et la transformation numérique constituent les deux piliers
          d'un développement communal durable, équitable et au service direct des populations de Zikisso. »
        </blockquote>
        <p className="text-xs font-semibold text-[#1F4E79] mt-2 uppercase tracking-wider">
          — Direction du Programme Pédagogique Communal
        </p>
      </div>

      {/* Titre de section du programme */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F4E79]">
              Programme Général de la Formation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sélectionnez une semaine ou un module pour consulter les capsules de cours et les activités.
            </p>
          </div>
        </div>

        {/* Grille de cartes cliquables */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES_LIST.map((module) => {
            const badgeBg = 
              module.type === 'bonus' 
                ? 'bg-[#FDF4ED] text-[#C55A11] border-[#C55A11]/30'
                : module.type === 'examen'
                ? 'bg-[#F0F5FA] text-[#1F4E79] border-[#1F4E79]/30'
                : 'bg-[#F0F7F2] text-[#1A6B3C] border-[#1A6B3C]/30';

            const headerIcon =
              module.type === 'bonus' ? (
                <Sparkles className="w-5 h-5 text-[#C55A11]" />
              ) : module.type === 'examen' ? (
                <Award className="w-5 h-5 text-[#1F4E79]" />
              ) : (
                <BookOpen className="w-5 h-5 text-[#1A6B3C]" />
              );

            return (
              <Link
                key={module.id}
                to={`/semaine/${module.id}`}
                className="group flex flex-col justify-between bg-white rounded-lg border border-slate-200 hover:border-[#1F4E79] hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Haut de carte */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeBg}`}>
                      {module.badge}
                    </span>
                    <div className="p-2 rounded-md bg-slate-50 group-hover:bg-slate-100 transition-colors">
                      {headerIcon}
                    </div>
                  </div>

                  {/* Titre du module */}
                  <h3 className="text-base sm:text-lg font-bold text-[#1F4E79] group-hover:text-[#1A6B3C] transition-colors line-clamp-2 mb-2">
                    {module.titre}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                {/* Pied de carte avec statut & action */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center text-slate-500 space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{module.dureeEstimee}</span>
                  </div>

                  <div className="flex items-center font-semibold text-[#1F4E79] group-hover:text-[#C55A11] transition-colors space-x-1">
                    <span>Ouvrir</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};
