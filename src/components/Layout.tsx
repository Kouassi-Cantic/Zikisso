import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
import { LogOut, User, Menu, X, BookOpen, ShieldCheck, Home, ShieldAlert, Award, Files, Edit3, Mail, Send, Phone, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import elephantsBgUrl from '../assets/images/elephants_cote_ivoire_savane_1790771623677.jpg';
const moocLogoUrl = '/Medias/logo-mooc-ecommunes.jpg';
import { ProfileModal } from './ProfileModal';
import { LegalModal } from './LegalModal';
import { subscribeToNewsletter } from '../services/newsletterService';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userData, currentUser, logout, isFirebaseConfigured } = useAuth();
  const { currentTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'mentions' | 'cgu_rgpd' | null>(null);

  // Newsletter Footer State
  const [footerEmail, setFooterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleFooterNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail.trim()) return;

    setNewsletterLoading(true);
    setNewsletterStatus(null);
    try {
      const res = await subscribeToNewsletter(footerEmail, {
        commune: userData?.commune || 'Visiteur portail',
        region: userData?.region || 'Côte d’Ivoire',
        nom: userData?.nom || currentUser?.displayName || '',
        source: 'Pied de page MOOC'
      });
      if (res.success) {
        setNewsletterStatus({ text: res.message, type: 'success' });
        setFooterEmail('');
      } else {
        setNewsletterStatus({ text: res.message, type: 'error' });
      }
    } catch (err: any) {
      setNewsletterStatus({ text: err.message || 'Erreur lors de l\'inscription', type: 'error' });
    } finally {
      setNewsletterLoading(false);
      setTimeout(() => setNewsletterStatus(null), 6000);
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Configuration du fond selon le thème sélectionné
  const getBackgroundStyles = () => {
    switch (currentTheme) {
      case 'elephants':
        return {
          wrapperClass: 'bg-[#FAF8F5]',
          bgOverlay: (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              {/* Image de fond : Troupeau d'éléphants emblème national */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.14] filter saturate-120"
                style={{ backgroundImage: `url(${elephantsBgUrl})` }}
              />
              {/* Voile dégradé lumineux pour préserver une lisibilité et un contraste parfaits */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/90 via-[#FAF8F5]/85 to-[#F5F2EC]/95" />
              {/* Halo doré savane */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200/15 rounded-full blur-3xl" />
            </div>
          ),
        };
      case 'republicain':
        return {
          wrapperClass: 'bg-[#FBFBFA]',
          bgOverlay: (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              {/* Liseré tricolore républicain en haut de page */}
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="w-1/3 bg-[#E06A1B]" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-[#1A6B3C]" />
              </div>
              {/* Halos subtils orange et vert */}
              <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-orange-100/35 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl" />
              {/* Trame filigrane républicaine */}
              <div 
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: `radial-gradient(#1F4E79 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />
            </div>
          ),
        };
      case 'foret':
        return {
          wrapperClass: 'bg-[#F3F7F4]',
          bgOverlay: (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1A6B3C]" />
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl" />
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(#1A6B3C 1.5px, transparent 1.5px)`,
                  backgroundSize: '28px 28px'
                }}
              />
            </div>
          ),
        };
      case 'epure':
      default:
        return {
          wrapperClass: 'bg-slate-50',
          bgOverlay: null,
        };
    }
  };

  const { wrapperClass, bgOverlay } = getBackgroundStyles();

  return (
    <div className={`min-h-screen flex flex-col ${wrapperClass} text-slate-800 relative transition-colors duration-300`}>
      {/* Arrière-plan thématique */}
      {bgOverlay}

      {/* Liseré national ivoirien d'en-tête (Orange · Blanc · Vert) */}
      <div className="h-1 w-full flex relative z-50">
        <div className="flex-1 bg-[#E06A1B]" title="Orange national" />
        <div className="w-16 sm:w-28 bg-white" title="Blanc national" />
        <div className="flex-1 bg-[#1A6B3C]" title="Vert national" />
      </div>

      {/* Bannière d'information si Firebase n'est pas encore lié au .env */}
      {!isFirebaseConfigured && (
        <div className="bg-[#FDF4ED] border-b border-[#C55A11]/30 px-4 py-2 text-xs text-[#A3480C] text-center font-medium relative z-50">
          Mode prévisualisation locale actif — Pour connecter Firebase en production, renseignez vos clés dans le fichier <code className="bg-white/80 px-1 py-0.5 rounded border border-[#C55A11]/20 font-mono">.env</code>.
        </div>
      )}

      {/* En-tête institutionnel */}
      <header className="bg-[#1F4E79] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo officiel & marque MOOC e-Communes */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-0.5 shadow-sm border border-emerald-400/30 group-hover:scale-105 transition-transform flex-shrink-0">
                  <img
                    src={moocLogoUrl}
                    alt="Logo MOOC e-Communes"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-emerald-100 transition-colors">
                      MOOC e-Communes
                    </span>
                    <span className="hidden sm:inline-block text-[10px] bg-emerald-700/80 text-emerald-100 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                      Pilote : Zikisso
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-blue-200 tracking-wide font-normal truncate max-w-[200px] sm:max-w-md">
                    Gouvernance Municipale et Transformation Digitale
                  </span>
                </div>
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-2.5 lg:space-x-3">
              {currentUser && (
                <>
                  <Link
                    to="/cours"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-blue-100 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>Programme des cours</span>
                  </Link>

                  <Link
                    to="/mon-tableau-de-bord"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-emerald-100 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors bg-white/5 border border-white/10"
                  >
                    <Award className="w-4 h-4 text-emerald-300" />
                    <span>Mon tableau de bord</span>
                  </Link>

                  <Link
                    to="/ressources"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-blue-100 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <Files className="w-4 h-4 text-amber-300" />
                    <span>Ressources</span>
                  </Link>

                  <Link
                    to="/verifier-certificat"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-blue-100 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                    title="Vérifier une attestation par son identifiant"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Vérifier diplôme</span>
                  </Link>

                  {/* Lien administration si le rôle est 'admin' */}
                  {userData?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-white bg-[#C55A11] hover:bg-[#A3480C] px-2.5 py-1.5 rounded-md shadow-xs transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Correction Admin</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center space-x-2 text-xs sm:text-sm bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-md border border-white/15 transition text-left group cursor-pointer"
                    title="Cliquer pour modifier votre profil, photo et commune"
                  >
                    {userData?.photoUrl ? (
                      <img
                        src={userData.photoUrl}
                        alt="Avatar"
                        className="w-5 h-5 rounded-full object-cover border border-emerald-300 group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <User className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="text-left">
                      <div className="flex items-center space-x-1.5">
                        <p className="font-semibold text-white leading-none">
                          {userData?.nom || currentUser.email}
                        </p>
                        <Edit3 className="w-3 h-3 text-blue-200 opacity-60 group-hover:opacity-100" />
                      </div>
                      <p className="text-[11px] text-blue-200 mt-0.5 leading-none flex items-center space-x-1.5 flex-wrap">
                        <span>{userData?.profil || 'Apprenant'}</span>
                        {userData?.commune && (
                          <span className="text-[10px] text-emerald-200 font-semibold bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-400/30">
                            📍 {userData.commune}
                          </span>
                        )}
                        {userData?.role === 'admin' && (
                          <span className="inline-flex items-center text-[10px] bg-[#C55A11] text-white px-1.5 py-0.2 rounded font-semibold">
                            Admin
                          </span>
                        )}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-white hover:text-red-200 transition-colors bg-white/10 hover:bg-red-900/40 px-2.5 py-1.5 rounded-md border border-white/20 disabled:opacity-50"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4 text-red-300" />
                    <span>{isLoggingOut ? '...' : 'Sortir'}</span>
                  </button>
                </>
              )}

              {/* Boutons pour visiteurs non connectés */}
              {!currentUser && (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-blue-100 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Accueil</span>
                  </Link>

                  <Link
                    to="/verifier-certificat"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-blue-100 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Vérifier diplôme</span>
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-md border border-white/20 transition-colors"
                  >
                    <span>Connexion</span>
                  </Link>

                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-white bg-[#C55A11] hover:bg-[#A3480C] px-3.5 py-1.5 rounded-md shadow-xs transition-colors"
                  >
                    <span>Rejoindre</span>
                  </Link>
                </div>
              )}

              {/* Sélecteur de Thème Visuel */}
              <div className="pl-1 border-l border-white/20">
                <ThemeSelector />
              </div>
            </div>

            {/* Bouton Menu Mobile & Sélecteur Thème */}
            <div className="flex items-center space-x-2 md:hidden">
              <ThemeSelector />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10 focus:outline-none"
                aria-label="Ouvrir le menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Déroulant */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#153755] px-4 pt-3 pb-4 space-y-3">
            {currentUser ? (
              <>
                <Link
                  to="/cours"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-white px-3 py-2 rounded-md hover:bg-white/10 text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4 text-blue-200" />
                  <span>Programme de formation (Cours)</span>
                </Link>

                <Link
                  to="/mon-tableau-de-bord"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-white px-3 py-2 rounded-md bg-white/10 text-sm font-semibold border border-white/15"
                >
                  <Award className="w-4 h-4 text-emerald-300" />
                  <span>Mon tableau de bord (Notes et Progression)</span>
                </Link>

                <Link
                  to="/ressources"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-white px-3 py-2 rounded-md hover:bg-white/10 text-sm font-medium"
                >
                  <Files className="w-4 h-4 text-amber-300" />
                  <span>Ressources, PDF et Charte d'Engagement</span>
                </Link>

                <Link
                  to="/verifier-certificat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-white px-3 py-2 rounded-md hover:bg-white/10 text-sm font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Vérifier un certificat</span>
                </Link>

                {userData?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-white bg-[#C55A11] px-3 py-2 rounded-md text-sm font-bold"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Correction Admin</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full p-3 bg-white/10 hover:bg-white/15 rounded-md text-left transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white text-sm">{userData?.nom || currentUser.email}</p>
                    <Edit3 className="w-3.5 h-3.5 text-blue-200" />
                  </div>
                  <p className="text-xs text-blue-200">{userData?.profil || 'Apprenant'}</p>
                  {userData?.role === 'admin' && (
                    <span className="mt-1 inline-block text-[11px] bg-[#C55A11] text-white px-2 py-0.5 rounded font-semibold">
                      Administrateur
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium text-white bg-red-800/60 hover:bg-red-800 border border-red-500/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isLoggingOut ? 'Déconnexion en cours...' : 'Se déconnecter'}</span>
                </button>
              </>
            ) : (
              <div className="text-sm text-blue-200 text-center py-2">
                Plateforme de formation numérique pour les acteurs locaux et communaux.
              </div>
            )}
          </div>
        )}
      </header>

      {/* Contenu principal surélevé par rapport à l'arrière-plan */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {children}
      </main>

      {/* ========================================================================= */}
      {/* PIED DE PAGE ULTRA-MODERNE ADAPTÉ AU MOOC e-COMMUNES (Conforme à la maquette) */}
      {/* ========================================================================= */}
      <footer className="bg-[#090D14] text-slate-300 text-xs border-t border-slate-800/80 relative z-10 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Grille principale en 5 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-12 border-b border-slate-800">
            
            {/* Colonne 1 (lg:col-span-3) : Marque & Manifeste institutionnel */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-blue-500 shadow-md flex-shrink-0">
                  <img
                    src={moocLogoUrl}
                    alt="Logo MOOC e-Communes"
                    className="w-full h-full object-cover rounded-full bg-slate-900"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight leading-tight">
                    MOOC e-COMMUNES
                  </h3>
                  <span className="text-[11px] font-bold text-[#00E5A3] tracking-wide block uppercase">
                    GOUVERNANCE ET TRANSFORMATION DIGITALE
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Penser l'utile. Former l'élu. Outiller l'agent. Éclairer le citoyen. 
                Première initiative certifiante de gouvernance territoriale et de transition numérique en Côte d'Ivoire. 
                Laboratoire pilote : Commune de Zikisso (Lôh-Djiboua).
              </p>

              {/* Réseaux sociaux et liens communautaires */}
              <div className="flex items-center space-x-2.5 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X Twitter"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Colonne 2 (lg:col-span-2) : Parcours & Cursus (Remplace Solutions & Cabinet) */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#00E5A3] uppercase tracking-wider">
                <span>💼</span>
                <span>PARCOURS ET CURSUS</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link to="/cours" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-emerald-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Semaine 1 : Décentralisation 🏛️</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cours" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-emerald-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Semaine 2 : Finances Locales 📊</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cours" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-emerald-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Semaine 3 : Services Municipaux 🏗️</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cours" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-emerald-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Semaine 4 : E-Administration 💻</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cours" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-emerald-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Examen Final et Certification 🎓</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3 (lg:col-span-2) : Citoyenneté & Ressources (Remplace Engagement Citoyen & RSE) */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-pink-400 uppercase tracking-wider">
                <span>🌍</span>
                <span>ENGAGEMENT ET RESSOURCES</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link to="/ressources" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-pink-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Charte d'Engagement Civique 📜</span>
                  </Link>
                </li>
                <li>
                  <Link to="/ressources" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-pink-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Fascicule Complet (PDF) 📥</span>
                  </Link>
                </li>
                <li>
                  <Link to="/ressources" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-pink-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Glossaire des Collectivités 📖</span>
                  </Link>
                </li>
                <li>
                  <Link to="/verifier-certificat" className="hover:text-white transition flex items-center space-x-1 group">
                    <span className="text-slate-500 group-hover:text-pink-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Vérificateur d'Attestation 🛡️</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.klo-like.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center space-x-1 group"
                  >
                    <span className="text-slate-500 group-hover:text-pink-400">→</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Plateforme Klo-Liké (Relève) 🤝</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Colonne 4 (lg:col-span-2) : Siège & Coordination Territoriale */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>COORDINATION ET PILOTE</span>
              </div>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-start space-x-2">
                  <span className="text-amber-400 flex-shrink-0 mt-0.5">📍</span>
                  <p className="leading-snug">
                    <strong className="text-slate-200">Commune de Zikisso</strong><br />
                    Hôtel de Ville — Place de la République, Région du Lôh-Djiboua, Côte d'Ivoire
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>+225 07 08 00 24 00</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <a href="mailto:contact@mooc-ecommunes.ci" className="hover:text-white transition truncate">
                    contact@mooc-ecommunes.ci
                  </a>
                </div>
              </div>
            </div>

            {/* Colonne 5 (lg:col-span-3) : Veille Stratégique & Newsletter */}
            <div className="lg:col-span-3 space-y-3.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#00E5A3] uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-[#00E5A3]" />
                <span>VEILLE STRATÉGIQUE</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recevez nos notes de prospective municipale, analyses des réformes territoriales et alertes de sessions directement dans votre boîte de réception.
              </p>

              {newsletterStatus && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center space-x-2 ${
                  newsletterStatus.type === 'success' 
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-red-950/80 text-red-300 border border-red-500/40'
                }`}>
                  {newsletterStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  )}
                  <span>{newsletterStatus.text}</span>
                </div>
              )}

              {/* Formulaire stylisé conforme à la capture */}
              <form onSubmit={handleFooterNewsletterSubmit} className="relative">
                <div className="flex items-center bg-[#131B2A] border border-slate-700/80 rounded-xl p-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition shadow-inner">
                  <div className="pl-3 pr-2 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="contact@collectivite.ci"
                    className="w-full bg-transparent text-white text-xs placeholder:text-slate-500 focus:outline-none py-1.5 pr-2"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading || !footerEmail.trim()}
                    aria-label="S'inscrire à la veille"
                    className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#C55A11] to-[#E05A10] hover:from-[#A3480C] hover:to-[#C55A11] text-white flex items-center justify-center flex-shrink-0 shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    {newsletterLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Barre inférieure : Copyright, Bouton Console de Gouvernance & Mentions Légales */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-500">
            
            {/* Copyright */}
            <div>
              <p>
                © 2026 MOOC e-COMMUNES CI. Tous droits réservés. Penser l'utile, Agir pour le bien commun.
              </p>
            </div>

            {/* Bouton central : Console de Gouvernance */}
            <div>
              <Link
                to={userData?.role === 'admin' ? '/admin' : '/login'}
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#181B34] hover:bg-[#23274A] border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-bold tracking-wider transition uppercase shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>CONSOLE DE GOUVERNANCE</span>
              </Link>
            </div>

            {/* Liens légaux */}
            <div className="flex items-center space-x-6 font-bold tracking-wider uppercase text-[11px]">
              <button
                type="button"
                onClick={() => setLegalModalType('mentions')}
                className="hover:text-white transition cursor-pointer"
              >
                MENTIONS LÉGALES
              </button>
              <button
                type="button"
                onClick={() => setLegalModalType('cgu_rgpd')}
                className="hover:text-white transition cursor-pointer"
              >
                CGU / RGPD
              </button>
            </div>

          </div>

        </div>
      </footer>

      {/* Modale d'édition du profil apprenant */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Modale légale et réglementaire */}
      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType || 'mentions'}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};

