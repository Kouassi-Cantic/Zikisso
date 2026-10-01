import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { UserProfileType } from '../types';
import { COTE_D_IVOIRE_TERRITORIES, PILOT_COMMUNE, findTerritoryByCommune } from '../data/territories';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
const moocLogoUrl = '/Medias/logo-mooc-ecommunes.jpg';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [nom, setNom] = useState('');
  const [profil, setProfil] = useState<UserProfileType>('Conseiller municipal élu');
  const [commune, setCommune] = useState<string>(PILOT_COMMUNE.commune);
  const [region, setRegion] = useState<string>(PILOT_COMMUNE.region);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectCommune = (selectedCommuneName: string) => {
    const found = findTerritoryByCommune(selectedCommuneName);
    setCommune(selectedCommuneName);
    if (found) {
      setRegion(found.region);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !motDePasse) {
      setErrorMessage('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), motDePasse);
      setSuccessMessage('Connexion réussie ! Redirection...');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        navigate('/cours');
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Identifiants invalides ou erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!nom.trim() || !email.trim() || !motDePasse) {
      setErrorMessage('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    if (motDePasse.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (motDePasse !== confirmationMotDePasse) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);
      await signup(nom.trim(), email.trim(), motDePasse, profil, commune, region);
      setSuccessMessage('Compte apprenant créé avec succès ! Bienvenue au MOOC.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        navigate('/cours');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      onClose();
      if (onSuccess) onSuccess();
      navigate('/cours');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erreur lors de la connexion Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Bandeau supérieur tricolore */}
        <div className="h-1.5 flex w-full">
          <div className="w-1/3 bg-[#E06A1B]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#1A6B3C]" />
        </div>

        {/* En-tête */}
        <div className="bg-[#1F4E79] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              {mode === 'login' ? (
                <LogIn className="w-5 h-5 text-emerald-300" />
              ) : (
                <UserPlus className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {mode === 'login' ? 'Connexion à votre Espace MOOC' : 'Inscription Apprenant MOOC'}
              </h2>
              <p className="text-xs text-blue-200">
                Collectivités Locales de Côte d'Ivoire
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Onglets Connexion / Inscription */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-3 text-center border-b-2 transition ${
              mode === 'login'
                ? 'border-[#1F4E79] text-[#1F4E79] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-3 text-center border-b-2 transition ${
              mode === 'register'
                ? 'border-[#C55A11] text-[#C55A11] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Corps du formulaire */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800">
          
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Formulaire Connexion */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.ci"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1F4E79] hover:bg-[#153755] rounded-lg shadow transition disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>Se connecter à mon espace</span>
              </button>
            </form>
          ) : (
            /* Formulaire Inscription */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nom &amp; Prénoms officiels <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex. Kouamé Jean-Baptiste"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C55A11]"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Ce nom apparaîtra sur votre attestation officielle.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Adresse email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.ci"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C55A11]"
                  />
                </div>
              </div>

              {/* Profil d'acteur */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Profil d'acteur communal <span className="text-red-500">*</span>
                </label>
                <select
                  value={profil}
                  onChange={(e) => setProfil(e.target.value as UserProfileType)}
                  className="w-full p-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C55A11]"
                >
                  <option value="Conseiller municipal élu">Conseiller municipal élu / Maire / Adjoint</option>
                  <option value="Agent technique de mairie">Agent technique / Administratif de mairie</option>
                  <option value="Citoyen engagé">Citoyen engagé / Société civile / Étudiant</option>
                </select>
              </div>

              {/* Commune et Région */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Commune
                  </label>
                  <select
                    value={commune}
                    onChange={(e) => handleSelectCommune(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C55A11]"
                  >
                    {COTE_D_IVOIRE_TERRITORIES.map((t) => (
                      <option key={t.commune} value={t.commune}>
                        {t.commune} {t.isPilot ? '⭐ (Pilote)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Région
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={region}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C55A11]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Confirmer
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmationMotDePasse}
                    onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C55A11]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs sm:text-sm font-bold text-white bg-[#C55A11] hover:bg-[#A3480C] rounded-lg shadow transition disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>Créer mon compte apprenant</span>
              </button>
            </form>
          )}

          {/* Connexion Google */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Continuer avec Google</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
