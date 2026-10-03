import React, { useState, useEffect } from 'react';
import { 
  getNewsletterSubscribers, 
  updateSubscriberStatus, 
  deleteSubscriber, 
  getNewsletterCampaigns, 
  sendNewsletterCampaign,
  subscribeToNewsletter 
} from '../services/newsletterService';
import type { NewsletterSubscriber, NewsletterCampaign } from '../types';
import { 
  Mail, 
  Send, 
  Users, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Download, 
  Plus, 
  AlertCircle, 
  Loader2, 
  Building2, 
  Calendar,
  Sparkles,
  Inbox
} from 'lucide-react';
import { COTE_D_IVOIRE_TERRITORIES } from '../data/territories';

export const NewsletterManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'subscribers' | 'compose' | 'history'>('subscribers');

  // Formulaire d'ajout rapide
  const [newEmail, setNewEmail] = useState('');
  const [newCommune, setNewCommune] = useState('Zikisso');
  const [addingSub, setAddingSub] = useState(false);
  const [formMsg, setFormMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Formulaire de rédaction
  const [sujet, setSujet] = useState('');
  const [contenu, setContenu] = useState('');
  const [cibleCommune, setCibleCommune] = useState('toutes');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  // Filtre recherche
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, camps] = await Promise.all([
        getNewsletterSubscribers(),
        getNewsletterCampaigns()
      ]);
      setSubscribers(subs);
      setCampaigns(camps);
    } catch (err) {
      console.error("Erreur chargement newsletter:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (sub: NewsletterSubscriber) => {
    const nextStatus = sub.statut === 'actif' ? 'désabonné' : 'actif';
    await updateSubscriberStatus(sub.id || '', nextStatus);
    setSubscribers((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, statut: nextStatus } : s))
    );
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("Êtes-vous sûr(e) de vouloir retirer cette adresse email de la liste ?")) {
      await deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setAddingSub(true);
    setFormMsg(null);
    try {
      const territory = COTE_D_IVOIRE_TERRITORIES.find((t) => t.commune === newCommune);
      const res = await subscribeToNewsletter(newEmail, {
        commune: newCommune,
        region: territory?.region || 'Côte d’Ivoire',
        source: 'Console Admin'
      });

      if (res.success) {
        setFormMsg({ text: res.message, type: 'success' });
        setNewEmail('');
        await loadData();
      } else {
        setFormMsg({ text: res.message, type: 'error' });
      }
    } catch (err: any) {
      setFormMsg({ text: err.message || 'Erreur lors de l\'ajout', type: 'error' });
    } finally {
      setAddingSub(false);
      setTimeout(() => setFormMsg(null), 4000);
    }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sujet.trim() || !contenu.trim()) return;

    setIsSending(true);
    setSendSuccess(null);

    try {
      // Calcul du nombre de destinataires actifs selon le filtre commune
      const actifs = subscribers.filter((s) => s.statut === 'actif');
      const filtered = cibleCommune === 'toutes' 
        ? actifs 
        : actifs.filter((s) => s.commune?.toLowerCase() === cibleCommune.toLowerCase());

      const created = await sendNewsletterCampaign({
        sujet,
        contenu,
        cibleCommune,
        destinatairesCount: filtered.length || actifs.length,
        statut: 'envoyé',
        auteurNom: 'Administration MOOC e-Communes'
      });

      setCampaigns((prev) => [created, ...prev]);
      setSendSuccess(`La lettre d'information a été transmise avec succès à ${filtered.length} abonné(s) actif(s) !`);
      setSujet('');
      setContenu('');
    } catch (err: any) {
      console.error("Erreur diffusion newsletter:", err);
    } finally {
      setIsSending(false);
      setTimeout(() => setSendSuccess(null), 6000);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Statut', 'Commune', 'Région', 'Date Inscription', 'Source'];
    const rows = subscribers.map((s) => [
      `"${s.email}"`,
      `"${s.statut}"`,
      `"${s.commune || ''}"`,
      `"${s.region || ''}"`,
      `"${new Date(s.dateInscription).toLocaleDateString('fr-FR')}"`,
      `"${s.source || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Abonnes_Newsletter_MOOC_eCommunes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeSubscribersCount = subscribers.filter((s) => s.statut === 'actif').length;

  const filteredSubscribers = subscribers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.email.toLowerCase().includes(q) ||
      (s.commune && s.commune.toLowerCase().includes(q)) ||
      (s.region && s.region.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* En-tête du gestionnaire */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-11 h-11 rounded-lg bg-[#1F4E79] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Mail className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-[#1A6B3C] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
                <Sparkles className="w-3 h-3 text-[#1A6B3C]" />
                <span>Veille Stratégique et Lettre d'Information</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F4E79]">
                Gestionnaire de la Newsletter et Veille Communale
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Supervisez les abonnés, diffusez les notes de veille hebdomadaires et gérez l'audience territoriale.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-[#1F4E79] bg-[#F0F5FA] hover:bg-[#e2eaf2] border border-[#1F4E79]/20 rounded-lg transition"
              title="Exporter la liste des abonnés en fichier CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter CSV</span>
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
              title="Actualiser la liste"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* 3 Métriques clés */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Abonnés Actifs</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1A6B3C]">{activeSubscribersCount}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-[#1A6B3C]" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Total Enregistrés</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1F4E79]">{subscribers.length}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1F4E79] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Notes Diffusées</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#C55A11]">{campaigns.length}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#C55A11] flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Sous-onglets */}
        <div className="flex border-b border-slate-200 space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setActiveSubTab('subscribers')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
              activeSubTab === 'subscribers'
                ? 'border-[#1F4E79] text-[#1F4E79]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Liste des Abonnés ({subscribers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('compose')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
              activeSubTab === 'compose'
                ? 'border-[#1A6B3C] text-[#1A6B3C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Rédiger et Diffuser une Note de Veille</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
              activeSubTab === 'history'
                ? 'border-[#C55A11] text-[#C55A11]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Historique des Campagnes ({campaigns.length})</span>
          </button>
        </div>
      </div>

      {/* VUE 1 : LISTE DES ABONNÉS */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-5">
          
          {/* Bloc d'ajout rapide d'un abonné */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-[#1A6B3C]" />
              <span>Inscrire manuellement un contact institutionnel ou citoyen</span>
            </h3>

            {formMsg && (
              <div className={`p-3 rounded-lg text-xs font-medium mb-3 flex items-center space-x-2 ${
                formMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {formMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                <span>{formMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleAddSubscriber} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ex : secretaire.general@commune.ci"
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={newCommune}
                  onChange={(e) => setNewCommune(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                >
                  {COTE_D_IVOIRE_TERRITORIES.map((t) => (
                    <option key={t.commune} value={t.commune}>
                      {t.commune} ({t.region})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={addingSub || !newEmail.trim()}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {addingSub ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Ajouter</span>
                </button>
              </div>
            </form>
          </div>

          {/* Recherche & Tableau des abonnés */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par email, commune ou région..."
                className="w-full sm:max-w-md p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
              />
              <span className="text-xs text-slate-500 font-medium">
                {filteredSubscribers.length} résultat(s) affiché(s)
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#1F4E79] mx-auto" />
                <p className="text-xs">Chargement des abonnés...</p>
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Aucun abonné ne correspond à votre recherche.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Adresse Email</th>
                      <th className="py-3 px-4">Commune / Région</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">Date d'inscription</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {sub.email}
                          {sub.nom && <span className="block text-[10px] text-slate-400 font-normal">{sub.nom}</span>}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="font-medium text-slate-800">{sub.commune || '—'}</span>
                          <span className="block text-[10px] text-slate-400">{sub.region || ''}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(sub)}
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                              sub.statut === 'actif'
                                ? 'bg-emerald-100 text-[#14532D] hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title="Cliquer pour basculer le statut"
                          >
                            {sub.statut === 'actif' ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>Actif</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                <span>Désabonné</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(sub.dateInscription).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {sub.source || 'Portail'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(sub.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VUE 2 : RÉDACTION D'UNE NOTE DE VEILLE */}
      {activeSubTab === 'compose' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#1F4E79]">
                Diffuser une Note de Veille et d'Actualité Municipale
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cette note sera transmise aux adresses inscrites pour partager les évolutions juridiques, cas pratiques et avis officiels.
              </p>
            </div>

            {sendSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs sm:text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{sendSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ciblage territorial des destinataires :
                </label>
                <select
                  value={cibleCommune}
                  onChange={(e) => setCibleCommune(e.target.value)}
                  className="w-full sm:max-w-md p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] font-medium"
                >
                  <option value="toutes">Toutes les communes ({activeSubscribersCount} abonnés actifs)</option>
                  {COTE_D_IVOIRE_TERRITORIES.map((t) => {
                    const countInCommune = subscribers.filter(s => s.statut === 'actif' && s.commune === t.commune).length;
                    return (
                      <option key={t.commune} value={t.commune}>
                        Commune de {t.commune} ({t.region}) — {countInCommune} contact(s)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Objet de la Note de Veille <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sujet}
                  onChange={(e) => setSujet(e.target.value)}
                  placeholder="Ex : Veille DGDDL : Publication du nouveau guide sur les budgets participatifs 2026"
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contenu de la lettre d'information <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={contenu}
                  onChange={(e) => setContenu(e.target.value)}
                  placeholder="Rédigez ici le corps de votre note d'actualité, les liens vers les ressources ou arrêtés municipaux..."
                  className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] font-serif leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Expéditeur officiel : <strong>MOOC e-Communes (Veille Territoriale)</strong>
                </span>
                <button
                  type="submit"
                  disabled={isSending || !sujet.trim() || !contenu.trim()}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer la note aux abonnés</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VUE 3 : HISTORIQUE DES CAMPAGNES */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Historique des notes et veilles diffusées
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {campaigns.length} campagne(s) enregistrée(s)
            </span>
          </div>

          {campaigns.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Aucune campagne diffusée pour l'instant.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-5 hover:bg-slate-50 transition space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#1F4E79]">
                      {camp.sujet}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(camp.dateEnvoi).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {camp.contenu}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-[#14532D] font-semibold border border-emerald-200">
                      <Users className="w-3 h-3" />
                      <span>{camp.destinatairesCount} destinataire(s)</span>
                    </span>
                    <span>Cible : <strong>{camp.cibleCommune === 'toutes' ? 'Toutes les collectivités' : `Commune de ${camp.cibleCommune}`}</strong></span>
                    <span>Rédacteur : <strong>{camp.auteurNom || 'Administration'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
