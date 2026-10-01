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
  FileCheck2,
  MapPin,
  Building2,
  Edit2,
  Check,
  Landmark,
  Camera,
  Compass
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { AudioReader } from '../components/AudioReader';
import { COTE_D_IVOIRE_TERRITORIES, findTerritoryByCommune } from '../data/territories';
import { ProfileModal } from '../components/ProfileModal';
import { MayorMessageModal } from '../components/MayorMessageModal';

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
  const { userData, currentUser, updateProfileTerritory } = useAuth();
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isEditingTerritory, setIsEditingTerritory] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [tempCommune, setTempCommune] = useState<string>(userData?.commune || 'Zikisso');
  const [tempRegion, setTempRegion] = useState<string>(userData?.region || 'Lôh-Djiboua');
  const [isSavingTerritory, setIsSavingTerritory] = useState<boolean>(false);
  const [isMayorModalOpen, setIsMayorModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (userData?.commune) {
      setTempCommune(userData.commune);
      setTempRegion(userData.region || 'Lôh-Djiboua');
    }
  }, [userData]);

  const handleCommuneChange = (newCommune: string) => {
    const found = findTerritoryByCommune(newCommune);
    setTempCommune(newCommune);
    if (found) {
      setTempRegion(found.region);
    }
  };

  const handleSaveTerritory = async () => {
    try {
      setIsSavingTerritory(true);
      await updateProfileTerritory(tempCommune, tempRegion);
      setIsEditingTerritory(false);
    } catch (e) {
      console.error('Erreur sauvegarde commune:', e);
    } finally {
      setIsSavingTerritory(false);
    }
  };

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
          
          {/* Avatar & Identité */}
          <div className="flex items-start sm:items-center space-x-4">
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-[#1F4E79] shadow-sm bg-slate-100 flex items-center justify-center flex-shrink-0 cursor-pointer group"
              title="Cliquer pour modifier votre photo de profil"
            >
              {userData?.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt={userData.nom || 'Photo de profil'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-[#1F4E79]/10 text-[#1F4E79] flex items-center justify-center font-bold text-xl">
                  {(userData?.nom || currentUser?.email || 'A').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0F7F2] text-[#1A6B3C] border border-[#1A6B3C]/20 mb-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Session active • MOOC e-Communes</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4E79] tracking-tight">
                Bienvenue, {userData?.nom || currentUser?.email}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
                Plateforme nationale de formation continue des acteurs communaux, régionaux et des forces vives citoyennes.
                Laboratoire territorial d'expérimentation : <strong>Commune pilote de Zikisso</strong> (Lôh-Djiboua).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-[#1F4E79] hover:bg-[#153755] text-white rounded-md transition shadow-2xs cursor-pointer group"
              title="Modifier mon nom, photo, profil et commune"
            >
              <span>Profil : {userData?.profil || 'Non renseigné'}</span>
              <Edit2 className="w-3 h-3 text-blue-200 group-hover:text-white" />
            </button>
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

        {/* Bloc d'ancrage territorial de l'apprenant avec photo du lieu emblématique */}
        <div className="mt-5 p-4 rounded-lg bg-[#F8FAFC] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            {/* Vignette du lieu emblématique si téléversé */}
            {userData?.photoLieuEmblematiqueUrl ? (
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#1A6B3C]/40 shadow-xs flex-shrink-0 cursor-pointer group"
                title="Lieu emblématique communal - Cliquer pour modifier"
              >
                <img 
                  src={userData.photoLieuEmblematiqueUrl} 
                  alt="Lieu emblématique de ma commune" 
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <span className="absolute bottom-0 inset-x-0 bg-[#1A6B3C]/80 text-[8px] text-white text-center font-bold py-0.5">
                  Preuve
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1A6B3C]/10 text-[#1A6B3C] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-[#1A6B3C]" />
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Votre ancrage territorial :
                </span>
                <span className="text-xs font-bold text-[#1F4E79]">
                  Commune de {userData?.commune || 'Zikisso'}
                </span>
                <span className="text-xs text-slate-500">
                  (Région du {userData?.region || 'Lôh-Djiboua'})
                </span>
                {userData?.photoLieuEmblematiqueUrl && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded">
                    <span>✓ Lieu vérifié</span>
                    {userData.lieuEmblematiqueNom && <span>: {userData.lieuEmblematiqueNom}</span>}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {userData?.photoLieuEmblematiqueUrl
                  ? `Preuve d'ancrage enregistrée (${userData.lieuEmblematiqueNom || 'Lieu emblématique local'}). Ces mentions figureront sur votre certificat officiel.`
                  : "Ces mentions figureront sur vos certificats officiels et dans le registre pour le parrainage communal."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMayorModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1A6B3C] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-md transition shadow-2xs cursor-pointer"
              title="Lire le mot d'encouragement officiel du Maire de votre commune"
            >
              <Building2 className="w-3.5 h-3.5 text-[#1A6B3C]" />
              <span>Mot du Maire</span>
            </button>

            {!isEditingTerritory ? (
              <button
                type="button"
                onClick={() => setIsEditingTerritory(true)}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#1F4E79] hover:text-[#1A6B3C] bg-white px-3 py-1.5 rounded border border-slate-300 hover:border-[#1A6B3C] transition shadow-2xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Modifier ma commune</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-white p-1 rounded border border-slate-300">
                <select
                  value={tempCommune}
                  onChange={(e) => handleCommuneChange(e.target.value)}
                  className="text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#1A6B3C]"
                >
                  {COTE_D_IVOIRE_TERRITORIES.map((t) => (
                    <option key={`${t.commune}-${t.region}`} value={t.commune}>
                      {t.isPilot ? `★ ${t.commune} (Commune pilote)` : `${t.commune} (${t.region})`}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={isSavingTerritory}
                  onClick={handleSaveTerritory}
                  className="px-2 py-1 text-xs font-bold bg-[#1A6B3C] text-white rounded hover:bg-[#14532D] transition flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Enregistrer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTerritory(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Accès direct à "Mon tableau de bord" personnel */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F0F5FA] p-4 rounded-lg">
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

      {/* Citation institutionnelle en police serif avec lecteur audio */}
      <div className="p-5 rounded-lg bg-[#F0F5FA] border-l-4 border-[#1F4E79] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <blockquote className="quote-serif italic text-base sm:text-lg text-slate-700">
            « La bonne gouvernance locale et la transformation numérique constituent les deux piliers
            d'un développement municipal durable, équitable et au service direct de toutes les populations de nos collectivités. »
          </blockquote>
          <p className="text-xs font-semibold text-[#1F4E79] mt-2 uppercase tracking-wider">
            — Direction du Programme National MOOC e-Communes (Collectivité pilote : Zikisso)
          </p>
        </div>
        <div className="flex-shrink-0">
          <AudioReader
            text="Bienvenue sur le MOOC e-Communes, Gouvernance Municipale et Transformation Digitale. La bonne gouvernance locale et la transformation numérique constituent les deux piliers d'un développement communal durable, équitable et au service direct des populations, avec la collectivité de Zikisso comme laboratoire d'expérimentation."
            title="Introduction audio du MOOC e-Communes"
            variant="button"
          />
        </div>
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

      {/* Modale d'édition de profil complet */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Modale du mot d'encouragement officiel du Maire de la commune */}
      <MayorMessageModal
        isOpen={isMayorModalOpen}
        commune={userData?.commune || 'Zikisso'}
        onClose={() => setIsMayorModalOpen(false)}
      />
    </div>
  );
};
