import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfileType } from '../types';
import { 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  Loader2, 
  MapPin, 
  Building2,
  Sparkles
} from 'lucide-react';
import { COTE_D_IVOIRE_TERRITORIES, PILOT_COMMUNE, findTerritoryByCommune } from '../data/territories';

const PROFILES: UserProfileType[] = [
  'Conseiller municipal élu',
  'Agent technique de mairie',
  'Citoyen engagé',
];

export const RegisterPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // État du formulaire
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [profil, setProfil] = useState<UserProfileType>('Conseiller municipal élu');

  // Ancrage territorial (Commune & Région)
  const [commune, setCommune] = useState<string>(PILOT_COMMUNE.commune);
  const [region, setRegion] = useState<string>(PILOT_COMMUNE.region);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtrage des communes pour le sélecteur assisté
  const filteredTerritories = useMemo(() => {
    if (!searchFilter.trim()) return COTE_D_IVOIRE_TERRITORIES;
    const query = searchFilter.toLowerCase();
    return COTE_D_IVOIRE_TERRITORIES.filter(
      (t) =>
        t.commune.toLowerCase().includes(query) ||
        t.region.toLowerCase().includes(query)
    );
  }, [searchFilter]);

  const handleSelectCommune = (selectedCommuneName: string) => {
    const found = findTerritoryByCommune(selectedCommuneName);
    if (found) {
      setCommune(found.commune);
      setRegion(found.region);
    } else {
      setCommune(selectedCommuneName);
    }
  };

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
      await signup(nom, email, motDePasse, profil, commune, region);
      setSuccessMessage('Compte apprenant créé avec succès ! Redirection en cours...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
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
      <div className="w-full max-w-lg bg-white border border-slate-200 shadow-sm rounded-lg p-6 sm:p-8">
        
        {/* Titre et sous-titre institutionnel */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#F0F7F2] text-[#1A6B3C] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#1A6B3C]/20">
            <UserPlus className="w-6 h-6 text-[#1A6B3C]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F4E79] tracking-tight">
            Inscription au MOOC e-Communes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gouvernance Municipale &amp; Transformation Digitale <br className="hidden sm:inline" />
            <span className="text-[#1A6B3C] font-semibold">Collectivité pilote d'application : Commune de Zikisso</span>
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
                placeholder="exemple@mairie.ci ou citoyen@domaine.ci"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Ancrage Territorial : Commune & Région (Sélecteur assisté) */}
          <div className="p-3.5 bg-[#F0F5FA] border border-[#1F4E79]/20 rounded-md space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="commune-select" className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C55A11]" />
                <span>Commune &amp; Région de rattachement <span className="text-red-500">*</span></span>
              </label>
              {commune === 'Zikisso' && (
                <span className="text-[10px] bg-emerald-100 text-[#14532D] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-300">
                  <Sparkles className="w-3 h-3 text-[#1A6B3C]" />
                  <span>Commune Pilote</span>
                </span>
              )}
            </div>

            {/* Raccourcis de sélection rapide */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-500 self-center mr-1">Suggestions :</span>
              {[
                { c: 'Zikisso', r: 'Lôh-Djiboua' },
                { c: 'Lakota', r: 'Lôh-Djiboua' },
                { c: 'Divo', r: 'Lôh-Djiboua' },
                { c: 'Gagnoa', r: 'Gôh' },
                { c: 'Cocody', r: "District d'Abidjan" },
                { c: 'Bouaké', r: 'Gbêkê' },
              ].map((item) => (
                <button
                  key={item.c}
                  type="button"
                  onClick={() => {
                    setCommune(item.c);
                    setRegion(item.r);
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded border transition ${
                    commune === item.c
                      ? 'bg-[#1F4E79] text-white border-[#1F4E79] font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.c === 'Zikisso' ? '★ Zikisso' : item.c}
                </button>
              ))}
            </div>

            {/* Sélecteur assisté */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Commune / Localité
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <select
                    id="commune-select"
                    value={commune}
                    onChange={(e) => handleSelectCommune(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:border-transparent font-medium"
                    disabled={loading}
                  >
                    {filteredTerritories.map((t) => (
                      <option key={`${t.commune}-${t.region}`} value={t.commune}>
                        {t.isPilot ? `★ ${t.commune} (Commune pilote)` : `${t.commune} (${t.region})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Région / District
                </label>
                <input
                  type="text"
                  readOnly
                  value={region}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-300 text-slate-700 rounded font-semibold focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              ℹ️ Votre commune et région seront inscrites sur vos <strong>attestations officielles</strong> et permettront le parrainage institutionnel de votre promotion par votre collectivité locale.
            </p>
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
              Votre statut servira à adapter le suivi pédagogique. Le rôle initial attribué sera <strong>apprenant</strong>.
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
