import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, AlertCircle, Mail, Lock, Loader2, Info } from 'lucide-react';
const moocLogoUrl = '/Medias/logo-mooc-ecommunes.jpg';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirection vers la page demandée ou vers le tableau de bord des cours
  const from = (location.state as any)?.from?.pathname || '/cours';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !motDePasse) {
      setErrorMessage('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    try {
      setLoading(true);
      await login(email, motDePasse);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Erreur lors de la connexion:', err);
      let message = 'Identifiants invalides ou erreur de connexion.';
      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential'
      ) {
        message = 'Email ou mot de passe incorrect. Veuillez vérifier vos accès.';
      } else if (err?.code === 'auth/invalid-email') {
        message = 'Le format de l’adresse email est invalide.';
      } else if (err?.code === 'auth/too-many-requests') {
        message = 'Trop de tentatives infructueuses. Veuillez patienter quelques instants avant de réessayer.';
      } else if (err?.code === 'auth/network-request-failed') {
        message = 'Problème de connectivité réseau. Veuillez vérifier votre accès Internet.';
      } else if (err?.message) {
        message = err.message;
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Erreur connexion Google:', err);
      let message = 'Impossible de se connecter avec Google.';
      if (err?.code === 'auth/popup-closed-by-user') {
        message = 'La fenêtre de connexion Google a été fermée avant la fin de l’authentification.';
      } else if (err?.code === 'auth/popup-blocked') {
        message = 'Le pop-up de connexion a été bloqué par votre navigateur. Veuillez autoriser les fenêtres pop-up.';
      } else if (err?.code === 'auth/cancelled-popup-request') {
        message = 'Opération de connexion annulée.';
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        message = 'Un compte existe déjà avec cette adresse email sous un autre mode de connexion.';
      } else if (err?.message) {
        message = err.message;
      }
      setErrorMessage(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-lg p-6 sm:p-8">
        
        {/* Titre et en-tête institutionnel */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md mx-auto mb-3 border border-slate-200 bg-white p-1">
            <img
              src={moocLogoUrl}
              alt="Logo MOOC e-Communes"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F4E79] tracking-tight">
            Espace d'Accès Sécurisé
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connectez-vous à votre espace <strong>MOOC e-Communes</strong>
          </p>
          <p className="text-[11px] text-[#1A6B3C] font-semibold mt-0.5">
            Collectivité pilote d'application : Commune de Zikisso
          </p>
        </div>

        {/* Message informatif si l'utilisateur a été redirigé */}
        {location.state?.from && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md flex items-center space-x-2">
            <Info className="w-4 h-4 flex-shrink-0 text-[#C55A11]" />
            <span>Veuillez vous authentifier pour accéder à cette formation.</span>
          </div>
        )}

        {/* Message d'erreur explicite */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-md flex items-start space-x-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Connexion rapide avec Google */}
        <div className="mb-5 space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-md border border-slate-300 shadow-2xs transition focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-1 disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#1F4E79]" />
                <span>Connexion à Google en cours...</span>
              </>
            ) : (
              <>
                {/* Logo officiel Google multi-couleurs */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </>
            )}
          </button>

          {/* Accès rapide direct Super Administrateur */}
          <button
            type="button"
            onClick={async () => {
              setEmail('teletechnologyci@gmail.com');
              setMotDePasse('admin1234');
              try {
                setLoading(true);
                await login('teletechnologyci@gmail.com', 'admin1234');
                navigate('/admin');
              } catch (e: any) {
                // Si pas encore de mot de passe, propose l'inscription
                setErrorMessage("Connexion directe Super Admin activée pour teletechnologyci@gmail.com.");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#FDF4ED] hover:bg-[#FCE8D8] text-[#C55A11] border border-[#C55A11]/30 rounded-md text-xs font-bold transition shadow-xs"
            title="Connexion instantanée avec le compte Super Admin"
          >
            <span>👑 Accès Direct Super Admin (teletechnologyci@gmail.com)</span>
          </button>
        </div>

          {/* Séparateur élégant "OU" */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-500 uppercase tracking-wider font-semibold">
                ou avec email et mot de passe
              </span>
            </div>
          </div>

        {/* Formulaire de connexion Email / Mot de passe */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Adresse email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@domaine.ci"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent transition"
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent transition"
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          {/* Bouton de connexion : Marine #1F4E79 */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#1F4E79] hover:bg-[#153755] text-white text-sm font-semibold rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification des identifiants...</span>
              </>
            ) : (
              <span>Se connecter par Email</span>
            )}
          </button>
        </form>

        {/* Lien de redirection vers l'inscription */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <p className="text-xs sm:text-sm text-slate-600">
            Vous n'avez pas encore de compte ?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#1A6B3C] hover:text-[#14532D] underline transition-colors"
            >
              Inscrivez-vous ici
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

