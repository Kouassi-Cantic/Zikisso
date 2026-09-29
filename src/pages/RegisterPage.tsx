import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfileType } from '../types';
import { UserPlus, AlertCircle, CheckCircle2, Lock, Mail, User, Briefcase, Loader2 } from 'lucide-react';

const PROFILES: UserProfileType[] = [
  'Conseiller municipal élu',
  'Agent technique de mairie',
  'Citoyen engagé',
];

export const RegisterPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // État du formulaire conservé pour éviter la perte de données en cas d'erreur de connexion
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [profil, setProfil] = useState<UserProfileType>('Conseiller municipal élu');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validations locales préalables
    if (!nom.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Veuillez renseigner une adresse email valide.');
      return;
    }
    if (motDePasse.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (motDePasse !== confirmationMotDePasse) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);
      await signup(nom, email, motDePasse, profil);
      setSuccessMessage('Compte apprenant créé avec succès ! Redirection en cours...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
      // Traduction et explication des erreurs courantes Firebase
      let message = err?.message || "Une erreur est survenue lors de l'inscription.";
      if (err?.code === 'auth/email-already-in-use') {
        message = 'Cette adresse email est déjà enregistrée. Veuillez vous connecter.';
      } else if (err?.code === 'auth/invalid-email') {
        message = 'Format d’adresse email invalide.';
      } else if (err?.code === 'auth/weak-password') {
        message = 'Le mot de passe choisi est trop faible (minimum 6 caractères requis).';
      } else if (err?.code === 'auth/network-request-failed') {
        message = 'Connexion instable ou interrompue. Veuillez vérifier votre réseau puis réessayer.';
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-lg p-6 sm:p-8">
        
        {/* Titre et sous-titre institutionnel */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#F0F7F2] text-[#1A6B3C] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#1A6B3C]/20">
            <UserPlus className="w-6 h-6 text-[#1A6B3C]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F4E79] tracking-tight">
            Inscription au MOOC Zikisso
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Création de votre compte apprenant pour accéder aux formations
          </p>
        </div>

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

        {/* Message de succès */}
        {successMessage && (
          <div
            role="status"
            className="mb-5 p-3.5 bg-[#F0F7F2] border border-[#1A6B3C]/30 text-[#14532D] text-xs sm:text-sm rounded-md flex items-start space-x-2"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#1A6B3C] mt-0.5" />
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nom complet */}
          <div>
            <label htmlFor="nom" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="nom"
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex. Kouamé Jean-Baptiste"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Adresse email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@commune-zikisso.ci"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Profil */}
          <div>
            <label htmlFor="profil" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Profil institutionnel <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <select
                id="profil"
                value={profil}
                onChange={(e) => setProfil(e.target.value as UserProfileType)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:border-transparent transition"
                disabled={loading}
              >
                {PROFILES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Votre statut servira à personnaliser le suivi pédagogique. Le rôle initial attribué sera <strong>apprenant</strong>.
            </p>
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="motDePasse"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Mot de passe (min. 6 caractères) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="motDePasse"
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label
              htmlFor="confirmationMotDePasse"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmationMotDePasse"
                type="password"
                required
                value={confirmationMotDePasse}
                onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Bouton d'action principal (Vert #1A6B3C) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-sm font-semibold rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Création du compte en cours...</span>
              </>
            ) : (
              <span>Créer mon compte apprenant</span>
            )}
          </button>
        </form>

        {/* Lien de redirection vers la connexion */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <p className="text-xs sm:text-sm text-slate-600">
            Vous disposez déjà d'un compte ?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#1F4E79] hover:text-[#C55A11] underline transition-colors"
            >
              Connectez-vous ici
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
