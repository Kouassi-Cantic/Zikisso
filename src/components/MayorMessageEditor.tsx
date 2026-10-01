import React, { useState, useEffect } from 'react';
import { COTE_D_IVOIRE_TERRITORIES } from '../data/territories';
import { getMayorMessageForCommune, saveMayorMessage } from '../services/mayorsService';
import type { MayorMessageData } from '../data/mayorsMessages';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RotateCcw, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const MayorMessageEditor: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCommune, setSelectedCommune] = useState<string>('Zikisso');
  const [messageData, setMessageData] = useState<MayorMessageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [nomMaire, setNomMaire] = useState('');
  const [titreOfficiel, setTitreOfficiel] = useState('');
  const [citationCle, setCitationCle] = useState('');
  const [messageBienvenue, setMessageBienvenue] = useState('');
  const [prioritesInput, setPrioritesInput] = useState('');

  const loadMessage = async (communeName: string) => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const data = await getMayorMessageForCommune(communeName);
      setMessageData(data);
      setNomMaire(data.nomMaire || '');
      setTitreOfficiel(data.titreOfficiel || '');
      setCitationCle(data.citationCle || '');
      setMessageBienvenue(data.messageBienvenue || '');
      setPrioritesInput((data.prioritesMunicipales || []).join('\n'));
    } catch (e: any) {
      setErrorMsg(e?.message || 'Erreur lors du chargement de la fiche communale.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessage(selectedCommune);
  }, [selectedCommune]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBienvenue.trim()) {
      setErrorMsg('Le corps du message officiel est obligatoire.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const prioritesArray = prioritesInput
        .split('\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const updated = await saveMayorMessage(
        selectedCommune,
        {
          nomMaire: nomMaire.trim(),
          titreOfficiel: titreOfficiel.trim(),
          citationCle: citationCle.trim(),
          messageBienvenue: messageBienvenue.trim(),
          prioritesMunicipales: prioritesArray,
        },
        currentUser?.email || 'Administrateur'
      );

      setMessageData(updated);
      setSuccessMsg(`Le mot officiel du Maire de ${selectedCommune} a été mis à jour avec succès !`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la sauvegarde du message.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1A6B3C] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Gestionnaire des Messages Municipaux</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1F4E79]">
            Personnalisation du Mot Officiel des Maires de Côte d'Ivoire
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Lorsqu'une Mairie transmet un message personnalisé pour ses administrés ou finance une promotion, actualisez son texte ici. Il remplacera immédiatement le texte standard.
          </p>
        </div>

        {/* Sélecteur de commune à modifier */}
        <div className="min-w-[240px]">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sélectionner la commune à éditer :
          </label>
          <select
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            className="w-full text-xs sm:text-sm font-bold text-[#1F4E79] border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          >
            {COTE_D_IVOIRE_TERRITORIES.map((t) => (
              <option key={t.commune} value={t.commune}>
                {t.commune} {t.isPilot ? '⭐ (Commune pilote)' : `(${t.region})`}
              </option>
            ))}
          </select>
        </div>
      </div>

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

      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#1F4E79] mx-auto mb-2" />
          <span className="text-xs">Chargement de la fiche de {selectedCommune}...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nom ou Intitulé de l'Autorité Municipale
              </label>
              <input
                type="text"
                value={nomMaire}
                onChange={(e) => setNomMaire(e.target.value)}
                placeholder="Ex. Monsieur le Maire de Zikisso / Le Conseil Municipal"
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Titre officiel de la Collectivité
              </label>
              <input
                type="text"
                value={titreOfficiel}
                onChange={(e) => setTitreOfficiel(e.target.value)}
                placeholder={`Mairie de la Commune de ${selectedCommune}`}
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Devise ou Citation Clé du Maire
            </label>
            <input
              type="text"
              value={citationCle}
              onChange={(e) => setCitationCle(e.target.value)}
              placeholder="Ex. « L'élévation des compétences communales est la clé de voûte de notre essor territorial. »"
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Message Officiel de Bienvenue &amp; d'Encouragement <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              required
              value={messageBienvenue}
              onChange={(e) => setMessageBienvenue(e.target.value)}
              placeholder="Saisissez ici le mot officiel adressé aux apprenants de la commune..."
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] font-serif leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Ce texte apparaît instantanément sur la page d'accueil (menu déroulant) et dans le tableau de bord de tous les apprenants rattachés à {selectedCommune}.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Priorités d'action de la Commune (1 priorité par ligne)
            </label>
            <textarea
              rows={3}
              value={prioritesInput}
              onChange={(e) => setPrioritesInput(e.target.value)}
              placeholder="Digitalisation des actes municipaux&#10;Salubrité urbaine et gestion des déchets&#10;Promotion de l'Économie Sociale et Solidaire"
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => loadMessage(selectedCommune)}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#1A6B3C] hover:bg-[#14532D] rounded-lg shadow transition disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer le mot officiel du Maire</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
