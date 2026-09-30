import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Menu, X, BookOpen, ShieldCheck, Home, ShieldAlert, Award, Files } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userData, currentUser, logout, isFirebaseConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Bannière d'information si Firebase n'est pas encore lié au .env */}
      {!isFirebaseConfigured && (
        <div className="bg-[#FDF4ED] border-b border-[#C55A11]/30 px-4 py-2 text-xs text-[#A3480C] text-center font-medium">
          Mode prévisualisation locale actif — Pour connecter Firebase en production, renseignez vos clés dans le fichier <code className="bg-white/80 px-1 py-0.5 rounded border border-[#C55A11]/20 font-mono">.env</code>.
        </div>
      )}

      {/* En-tête institutionnel */}
      <header className="bg-[#1F4E79] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo texte MOOC e-Communes */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded bg-[#1A6B3C] flex items-center justify-center text-white font-bold text-lg shadow-sm border border-emerald-400/20 group-hover:bg-[#14532D] transition">
                  <BookOpen className="w-5 h-5 text-white" />
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
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {currentUser && (
                <>
                  <Link
                    to="/"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-blue-100 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Programme</span>
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
                    <span>Ressources &amp; Charte</span>
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

                  <div className="flex items-center space-x-2 text-xs sm:text-sm bg-white/10 px-3 py-1.5 rounded-md border border-white/15">
                    <User className="w-4 h-4 text-emerald-300" />
                    <div className="text-left">
                      <p className="font-semibold text-white leading-none">
                        {userData?.nom || currentUser.email}
                      </p>
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
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-white hover:text-red-200 transition-colors bg-white/10 hover:bg-red-900/40 px-3 py-1.5 rounded-md border border-white/20 disabled:opacity-50"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4 text-red-300" />
                    <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
                  </button>
                </>
              )}
            </div>

            {/* Bouton Menu Mobile */}
            <div className="flex md:hidden">
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
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-white px-3 py-2 rounded-md hover:bg-white/10 text-sm font-medium"
                >
                  <Home className="w-4 h-4 text-blue-200" />
                  <span>Programme de formation</span>
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

                <div className="p-3 bg-white/10 rounded-md">
                  <p className="font-semibold text-white text-sm">{userData?.nom || currentUser.email}</p>
                  <p className="text-xs text-blue-200">{userData?.profil || 'Apprenant'}</p>
                  {userData?.role === 'admin' && (
                    <span className="mt-1 inline-block text-[11px] bg-[#C55A11] text-white px-2 py-0.5 rounded font-semibold">
                      Administrateur
                    </span>
                  )}
                </div>

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
                Plateforme de formation numérique pour les acteurs locaux de Zikisso.
              </div>
            )}
          </div>
        )}
      </header>

      {/* Contenu principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Pied de page institutionnel */}
      <footer className="bg-slate-800 text-slate-300 text-xs py-6 border-t border-slate-700">
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
    </div>
  );
};
