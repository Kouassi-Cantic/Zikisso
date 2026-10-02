import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
import { LogOut, User, Menu, X, BookOpen, ShieldCheck, Home, ShieldAlert, Award, Files, Edit3 } from 'lucide-react';
import elephantsBgUrl from '../assets/images/elephants_cote_ivoire_savane_1790771623677.jpg';
const moocLogoUrl = '/Medias/logo-mooc-ecommunes.jpg';
import { ProfileModal } from './ProfileModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userData, currentUser, logout, isFirebaseConfigured } = useAuth();
  const { currentTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
                    Gouvernance Municipale &amp; Transformation Digitale
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
                  <span>Mon tableau de bord (Notes &amp; Progression)</span>
                </Link>

                <Link
                  to="/ressources"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-white px-3 py-2 rounded-md hover:bg-white/10 text-sm font-medium"
                >
                  <Files className="w-4 h-4 text-amber-300" />
                  <span>Ressources, PDF &amp; Charte Civique</span>
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

      {/* Pied de page institutionnel */}
      <footer className="bg-slate-900/95 text-slate-300 text-xs py-6 border-t border-slate-700 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-white tracking-wide">
              MOOC e-Communes — Gouvernance Municipale &amp; Transformation Digitale
            </p>
            <p className="text-slate-400 mt-0.5">
              Plateforme nationale certifiante • Collectivité pilote d'expérimentation : Commune de Zikisso (Lôh-Djiboua).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-slate-400">
            <Link
              to="/verifier-certificat"
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition underline underline-offset-4"
            >
              <ShieldCheck className="w-4 h-4 text-[#1A6B3C]" />
              <span>Vérifier un certificat officiel</span>
            </Link>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1A6B3C]"></span>
              <span>Réseau des Collectivités Locales de Côte d'Ivoire</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modale d'édition du profil apprenant */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

