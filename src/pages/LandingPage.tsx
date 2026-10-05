import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, SUPER_ADMIN_EMAILS } from '../contexts/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { COTE_D_IVOIRE_TERRITORIES, PILOT_COMMUNE } from '../data/territories';
import { MayorMessageModal } from '../components/MayorMessageModal';
import { AuthModal } from '../components/AuthModal';
import { 
  Building2, 
  MapPin, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  Compass, 
  CheckCircle2, 
  FileText, 
  Users, 
  GraduationCap, 
  Lock, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
const moocLogoUrl = '/Medias/logo-mooc-ecommunes.jpg';

export const LandingPage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const [selectedCommune, setSelectedCommune] = useState<string>('Zikisso');
  const [isMayorModalOpen, setIsMayorModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [superAdminPhotoUrl, setSuperAdminPhotoUrl] = useState<string | null>(null);

  // Récupération automatique de la photo de profil du Super Admin (teletechnologyci@gmail.com)
  useEffect(() => {
    let isMounted = true;

    const fetchSuperAdminPhoto = async () => {
      // 1. Si l'utilisateur actuellement connecté est le Super Admin, utiliser directement sa photo
      const primaryEmail = SUPER_ADMIN_EMAILS[0].toLowerCase();
      if (currentUser?.email?.toLowerCase() === primaryEmail && userData?.photoUrl) {
        if (isMounted) setSuperAdminPhotoUrl(userData.photoUrl);
        return;
      }

      // 2. Chercher dans Firestore si configuré
      if (isFirebaseConfigured) {
        try {
          const q = query(
            collection(db, 'users'),
            where('email', '==', primaryEmail),
            limit(1)
          );
          const snap = await getDocs(q);
          if (!snap.empty && isMounted) {
            const adminDoc = snap.docs[0].data();
            if (adminDoc.photoUrl) {
              setSuperAdminPhotoUrl(adminDoc.photoUrl);
              return;
            }
          }
        } catch (e) {
          console.warn('Erreur récupération photo super admin Firestore:', e);
        }
      }

      // 3. Chercher dans le localStorage (session ou utilisateurs sauvegardés localement)
      try {
        const localSession = localStorage.getItem('zikisso_local_session');
        if (localSession) {
          const parsedSession = JSON.parse(localSession);
          if (parsedSession.email?.toLowerCase() === primaryEmail && parsedSession.photoUrl) {
            if (isMounted) setSuperAdminPhotoUrl(parsedSession.photoUrl);
            return;
          }
        }

        const localUsers = localStorage.getItem('zikisso_local_users');
        if (localUsers) {
          const usersList = JSON.parse(localUsers);
          const foundAdmin = usersList.find(
            (u: any) => u.email?.toLowerCase() === primaryEmail && u.photoUrl
          );
          if (foundAdmin && isMounted) {
            setSuperAdminPhotoUrl(foundAdmin.photoUrl);
          }
        }
      } catch (e) {
        console.warn('Erreur lecture photo super admin locale:', e);
      }
    };

    fetchSuperAdminPhoto();

    return () => {
      isMounted = false;
    };
  }, [currentUser, userData]);

  const handleSelectCommuneChange = (communeName: string) => {
    setSelectedCommune(communeName);
    setIsMayorModalOpen(true);
  };

  const handleDirectAuth = (initialMode: 'login' | 'register' = 'register') => {
    if (currentUser) {
      navigate('/cours');
    } else {
      setAuthModalMode(initialMode);
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="space-y-12 pb-16 animate-fadeIn">
      
      {/* 1. HERO SECTION : Message Solennel du Gestionnaire en Chef */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F4E79] via-[#153755] to-[#0F2840] text-white shadow-xl border border-white/10">
        
        {/* Liseré tricolore ivoirien d'apparat */}
        <div className="h-1.5 flex w-full">
          <div className="w-1/3 bg-[#E06A1B]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#1A6B3C]" />
        </div>

        <div className="p-6 sm:p-10 lg:p-12 space-y-8 relative z-10">
          
          {/* Badge & Titre de tête */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Plateforme Nationale de Formation Continue des Collectivités Locales</span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-200">
              <Building2 className="w-4 h-4 text-[#C55A11]" />
              <span>Laboratoire d'expérimentation : <strong>Commune pilote de Zikisso</strong></span>
            </div>
          </div>

          {/* Titre Impactant */}
          <div className="max-w-4xl space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Bâtir la gouvernance locale de demain à l’ère de l’intelligence numérique et de la responsabilité citoyenne
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
              Le <strong>MOOC e-Communes</strong> est l'université ouverte des territoires ivoiriens : un parcours certifiant d'excellence dédié aux élus municipaux, aux cadres communaux et aux forces vives citoyennes.
            </p>
          </div>

          {/* Message Officiel de M. Kouassi Ouréga Goblé */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/15 shadow-inner space-y-5 text-white">
            
            {/* Destinataires protocolaires */}
            <div className="text-xs sm:text-sm font-semibold text-emerald-300 italic">
              Chères élues, chers élus, chers agents des collectivités territoriales, chers concitoyens et forces vives de nos communes,
            </div>

            {/* Texte éditorial solennel */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-100 leading-relaxed font-serif">
              <p>
                C’est avec un profond sens du devoir républicain et une immense fierté que je vous accueille sur la plateforme nationale du <strong>MOOC e-Communes</strong>.
              </p>
              <p>
                La décentralisation ne saurait être un simple découpage administratif : elle est le cœur battant du développement inclusif, de la cohésion sociale et de l'essor économique de la Côte d'Ivoire. À l'heure où les technologies de l'information et l'intelligence artificielle redéfinissent nos services publics, la maîtrise des finances communales, de l'aménagement du territoire, de la salubrité environnementale et de l'Économie Sociale et Solidaire (ESS) devient un impératif patriotique.
              </p>
              <p>
                Conçu à partir des réalités concrètes du terrain — avec notre laboratoire d'expérimentation de la <strong>Commune pilote de Zikisso</strong> dans la région du Lôh-Djiboua —, ce MOOC est bien plus qu'un programme de formation certifiant : c'est un pacte républicain entre décideurs locaux, personnels municipaux et citoyens engagés.
              </p>
              <p>
                Je vous invite à vous approprier chaque module, à confronter vos expériences et à faire de votre commune un modèle de transparence, d’innovation et de prospérité partagée.
              </p>
              <p className="font-sans font-bold text-white pt-1">
                Ensemble, faisons rayonner nos territoires.
              </p>
            </div>

            {/* Signature Protocolaire */}
            <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                {superAdminPhotoUrl ? (
                  <div className="w-14 h-14 rounded-full border-2 border-emerald-400 overflow-hidden shadow-md flex-shrink-0 bg-slate-900">
                    <img
                      src={superAdminPhotoUrl}
                      alt="Kouassi Ouréga Goblé"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-emerald-400 flex items-center justify-center font-bold text-lg text-white shadow-sm flex-shrink-0">
                    KG
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug">
                    Kouassi Ouréga Goblé
                  </h3>
                  <p className="text-xs text-emerald-300 font-semibold">
                    Gestionnaire en chef du MOOC e-Communes
                  </p>
                  <p className="text-[11px] text-blue-200 mt-0.5 leading-snug max-w-xl">
                    Informaticien — Consultant Digital et Intelligence Artificielle • Citoyen bénévole engagé pour l'éducation, le civisme, la salubrité publique et l'Économie Sociale et Solidaire (ESS)
                  </p>
                </div>
              </div>

              {/* Emplacement pour signature publique vérifiable */}
              <div className="self-start sm:self-center">
                <span className="inline-flex items-center space-x-1.5 text-[11px] text-blue-200 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Signature officielle certifiée</span>
                </span>
              </div>
            </div>

          </div>

          {/* Boutons d'Action Principaux */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            <button
              onClick={() => handleDirectAuth('register')}
              className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#C55A11] hover:bg-[#A3480C] rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-amber-200" />
              <span>
                {currentUser ? 'Accéder à mon tableau de bord de cours' : 'Créer mon compte apprenant / Se connecter'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/cours"
              className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/20 border border-white/25 rounded-xl transition"
            >
              <BookOpen className="w-4.5 h-4.5 text-blue-200" />
              <span>Explorer le programme et le cursus</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. LEVIER D'ENGAGEMENT DES MAIRES : Menu déroulant & Mot de l'Autorité Municipale */}
      <section className="bg-white rounded-2xl border-2 border-[#1A6B3C]/30 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1A6B3C] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#1A6B3C]" />
              <span>Parrainage des Collectivités Locales de Côte d'Ivoire</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F4E79]">
              La Voix des Maires : Encouragements et Parrainage Municipal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Sélectionnez votre commune pour découvrir le mot de bienvenue solennel et les félicitations de votre Maire. Ce message apparaîtra également dans votre espace apprenant pour vous encourager jusqu'à la certification.
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[280px]">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Choisir une commune :
            </label>
            <div className="relative">
              <select
                value={selectedCommune}
                onChange={(e) => handleSelectCommuneChange(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm font-bold text-[#1F4E79] bg-[#F0F5FA] border-2 border-[#1F4E79]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] transition cursor-pointer appearance-none"
              >
                {COTE_D_IVOIRE_TERRITORIES.map((t) => (
                  <option key={`${t.commune}-${t.region}`} value={t.commune}>
                    {t.isPilot ? `⭐ ${t.commune} (Commune pilote nationale)` : `${t.commune} — Région : ${t.region}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#1F4E79] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Aperçu valorisant de la commune sélectionnée */}
        <div className="bg-gradient-to-r from-emerald-50/70 via-slate-50 to-blue-50/70 p-5 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#1A6B3C] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Compass className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Commune actuellement consultée :
              </span>
              <h3 className="text-lg font-bold text-[#1F4E79]">
                Commune de {selectedCommune}
              </h3>
              <p className="text-xs text-slate-600">
                Cliquez pour lire le mot officiel de félicitations et les priorités municipales.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMayorModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#1A6B3C] hover:bg-[#14532D] rounded-lg shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            <span>Lire le mot du Maire de {selectedCommune}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* 3. VISITE DES PARTIES COMMUNES DE LA PLATEFORME (Point 2 de la demande) */}
      <section id="visite-commune" className="space-y-6 scroll-mt-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C55A11] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Vitrine Publique et Transparence Pédagogique
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F4E79]">
            Visitez les composantes ouvertes du MOOC
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Chaque citoyen, cadre ou élu peut consulter les fondements méthodologiques, le cursus et les règles d'éthique de la formation.
          </p>
        </div>

        {/* Grille des 4 rubriques publiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Carte 1 : Les 4 Semaines de formation (Syllabus & Cursus) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#1F4E79] transition">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#1F4E79]/10 text-[#1F4E79] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Syllabus et 4 Semaines Thématiques
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Découvrez le programme structuré : institutions locales, budgets communaux, digitalisation et salubrité publique.
              </p>
            </div>
            <Link
              to="/cours"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1F4E79] hover:text-[#C55A11] transition pt-2 border-t border-slate-100"
            >
              <span>Consulter le cursus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Carte 2 : Ressources et Textes fondateurs */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#1A6B3C] transition">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#1A6B3C]/10 text-[#1A6B3C] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Ressources Légales et Guides PDF
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Textes de décentralisation en Côte d’Ivoire, modèles d'arrêtés municipaux et guides méthodologiques de Zikisso.
              </p>
            </div>
            <Link
              to="/ressources"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1A6B3C] hover:text-[#14532D] transition pt-2 border-t border-slate-100"
            >
              <span>Accéder aux documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Carte 3 : Observatoire Territorial et Cartographie */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#C55A11] transition">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#C55A11]/10 text-[#C55A11] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Observatoire et Impact National
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Suivi cartographique des communes engagées, des apprenants mobilisés et des partenariats municipaux.
              </p>
            </div>
            <Link
              to="/observatoire"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#C55A11] hover:text-[#A3480C] transition pt-2 border-t border-slate-100"
            >
              <span>Voir l'Observatoire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Carte 4 : Vérification publique d'attestation */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-600 transition">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#14532D] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Registre Public d'Authenticité
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vérification instantanée de toute attestation officielle délivrée par le MOOC pour les employeurs et collectivités.
              </p>
            </div>
            <Link
              to="/verifier-certificat"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition pt-2 border-t border-slate-100"
            >
              <span>Vérifier un diplôme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </section>

      {/* 4. MODAL DU MOT DU MAIRE */}
      <MayorMessageModal
        isOpen={isMayorModalOpen}
        commune={selectedCommune}
        onClose={() => setIsMayorModalOpen(false)}
        onGoToAuth={() => handleDirectAuth('register')}
      />

      {/* 5. MODALE DE CONNEXION / CRÉATION DE COMPTE DIRECTE */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
};
