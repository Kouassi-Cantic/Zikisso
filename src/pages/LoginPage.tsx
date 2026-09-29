import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, AlertCircle, Mail, Lock, Loader2, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirection vers la page demandée ou vers l'accueil
  const from = (location.state as any)?.from?.pathname || '/';

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

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-lg p-6 sm:p-8">
        
        {/* Titre et en-tête institutionnel */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#F0F5FA] text-[#1F4E79] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#1F4E79]/20">
            <LogIn className="w-6 h-6 text-[#1F4E79]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F4E79] tracking-tight">
            Espace d'Accès Sécurisé
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connectez-vous à votre espace MOOC Zikisso
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

        {/* Formulaire de connexion */}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          {/* Bouton de connexion : Marine #1F4E79 ou Orange #C55A11 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#1F4E79] hover:bg-[#153755] text-white text-sm font-semibold rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification des identifiants...</span>
              </>
            ) : (
              <span>Se connecter</span>
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
