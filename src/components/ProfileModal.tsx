import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { COTE_D_IVOIRE_TERRITORIES, findTerritoryByCommune } from '../data/territories';
import type { UserProfileType } from '../types';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROFILES: { id: UserProfileType; label: string; desc: string }[] = [
  {
    id: 'Conseiller municipal élu',
    label: 'Conseiller municipal élu / Maire / Adjoint',
    desc: 'Décideur public, orienté vers la gouvernance, les arrêtés municipaux et la vision politique locale.',
  },
  {
    id: 'Agent technique de mairie',
    label: 'Agent technique / Administratif de mairie',
    desc: 'Cadre communal chargé de l’exécution opérationnelle, de la dématérialisation et des services aux usagers.',
  },
  {
    id: 'Citoyen engagé',
    label: 'Citoyen engagé / Société civile / Étudiant',
    desc: 'Acteur du territoire désireux de comprendre et participer activement à la vie publique de sa commune.',
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userData, currentUser, updateUserProfile } = useAuth();

  const [nom, setNom] = useState('');
  const [profil, setProfil] = useState<UserProfileType>('Citoyen engagé');
  const [commune, setCommune] = useState('Zikisso');
  const [region, setRegion] = useState('Lôh-Djiboua');
  const [searchFilter, setSearchFilter] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setNom(userData.nom || currentUser?.displayName || '');
      setProfil(userData.profil || 'Citoyen engagé');
      setCommune(userData.commune || 'Zikisso');
      setRegion(userData.region || 'Lôh-Djiboua');
    }
  }, [userData, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSelectCommune = (selectedCommuneName: string) => {
    const found = findTerritoryByCommune(selectedCommuneName);
    setCommune(selectedCommuneName);
    if (found) {
      setRegion(found.region);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!nom.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return;
    }

    try {
      setIsSaving(true);
      await updateUserProfile({
        nom: nom.trim(),
        profil,
        commune,
        region,
      });
      setSuccessMsg('Votre profil apprenant a été mis à jour avec succès !');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la mise à jour du profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTerritories = searchFilter.trim()
    ? COTE_D_IVOIRE_TERRITORIES.filter(
        (t) =>
          t.commune.toLowerCase().includes(searchFilter.toLowerCase()) ||
          t.region.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : COTE_D_IVOIRE_TERRITORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* En-tête */}
        <div className="bg-[#1F4E79] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Mon Profil Apprenant &amp; Identité Civique</h2>
              <p className="text-xs text-blue-200">Personnalisez votre identité officielle pour les certificats et évaluations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email (non modifiable) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Adresse email institutionnelle / personnelle
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                disabled
                value={currentUser?.email || userData?.email || ''}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 text-slate-600 rounded-md cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Identifiant unique de votre compte d'authentification.
            </p>
          </div>

          {/* Nom complet */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nom &amp; Prénoms officiels <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-[#1F4E79]" />
              </div>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex. Kouamé Jean-Baptiste"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F4E79] transition font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ce nom apparaîtra en toutes lettres sur votre <strong>Attestation de Réussite Officielle</strong>.
            </p>
          </div>

          {/* Profil d'acteur */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Profil d'acteur communal <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {PROFILES.map((p) => {
                const isSelected = profil === p.id;
                return (
                  <label
                    key={p.id}
                    className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1F4E79] bg-blue-50/60 ring-1 ring-[#1F4E79]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="profil_modal"
                        checked={isSelected}
                        onChange={() => setProfil(p.id)}
                        className="mt-1 text-[#1F4E79] focus:ring-[#1F4E79]"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-800">
                          {p.label}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {p.desc}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Ancrage Territorial (Commune & Région) */}
          <div className="p-3.5 bg-[#F0F5FA] border border-[#1F4E79]/20 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1F4E79] flex items-center space-x-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#C55A11]" />
                <span>Ancrage territorial (Commune &amp; Région)</span>
              </label>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Pilotage Zikisso
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Commune de rattachement
                </label>
                <select
                  value={commune}
                  onChange={(e) => handleSelectCommune(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                >
                  {filteredTerritories.map((t) => (
                    <option key={t.commune} value={t.commune}>
                      {t.commune} {t.isPilot ? '⭐ (Pilote national)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Région administrative
                </label>
                <input
                  type="text"
                  readOnly
                  value={region}
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-md bg-slate-100 text-slate-700 cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

          {/* Rôle Système */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#1F4E79]" />
              <span className="text-xs font-semibold text-slate-700">Rôle sur la plateforme :</span>
            </div>
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold ${
                userData?.role === 'admin'
                  ? 'bg-[#C55A11] text-white'
                  : 'bg-[#1A6B3C] text-white'
              }`}
            >
              {userData?.role === 'admin' ? '👑 Super Administrateur' : '🎓 Apprenant'}
            </span>
          </div>

          {/* Boutons d'action */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1F4E79] hover:bg-[#153755] rounded-lg shadow-sm transition disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Mettre à jour mon profil</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
