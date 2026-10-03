import React, { useState, useEffect } from 'react';
import { 
  getFooterConfig, 
  saveFooterConfig, 
  resetFooterConfig 
} from '../services/footerConfigService';
import { FooterConfig, DEFAULT_FOOTER_CONFIG } from '../data/defaultFooterConfig';
import { 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Layout, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Share2, 
  MessageCircle, 
  Link as LinkIcon, 
  ExternalLink,
  Building2,
  Sliders,
  Send,
  Sparkles
} from 'lucide-react';

export const FooterConfigEditor: React.FC = () => {
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sous-onglets pour la configuration du pied de page
  const [activeSection, setActiveSection] = useState<'coordination' | 'reseaux' | 'marque' | 'colonnes' | 'barre'>('coordination');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const loaded = await getFooterConfig();
        setConfig(loaded);
      } catch (err) {
        console.error('Erreur chargement configuration footer:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await saveFooterConfig(config);
      setStatusMsg({ text: res.message || 'Pied de page mis à jour !', type: 'success' });
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Erreur lors de la sauvegarde', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Voulez-vous rétablir toutes les informations du pied de page aux valeurs officielles par défaut ?")) {
      setSaving(true);
      try {
        const def = await resetFooterConfig();
        setConfig(def);
        setStatusMsg({ text: 'Informations rétablies aux paramètres officiels.', type: 'success' });
      } catch (err: any) {
        setStatusMsg({ text: err.message || 'Erreur lors de la réinitialisation', type: 'error' });
      } finally {
        setSaving(false);
        setTimeout(() => setStatusMsg(null), 4000);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#1F4E79] mx-auto mb-2" />
        <p className="text-xs">Chargement de la configuration du pied de page...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* En-tête de section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-11 h-11 rounded-lg bg-[#090D14] text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-700">
              <Layout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-[#1A6B3C] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
                <Sparkles className="w-3 h-3 text-[#1A6B3C]" />
                <span>Pied de Page Réactif & Gouvernance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F4E79]">
                Gestionnaire & Personnalisation du Pied de Page
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Modifiez les coordonnées de pilotage (Cantic Think IA, WhatsApp, Cocody Deux Plateaux), les liens institutionnels et les réseaux sociaux.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Valeurs par défaut</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-[#1A6B3C] hover:bg-[#14532D] rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Enregistrer le Pied de Page</span>
            </button>
          </div>
        </div>

        {/* Message de notification */}
        {statusMsg && (
          <div className={`mt-4 p-3 rounded-lg text-xs font-medium flex items-center space-x-2 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Barre de navigation des sous-sections */}
        <div className="flex border-b border-slate-200 space-x-3 mt-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection('coordination')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeSection === 'coordination'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>Coordination & Pilotage (Colonne 4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('reseaux')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeSection === 'reseaux'
                ? 'border-emerald-500 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-500" />
            <span>Réseaux Sociaux & WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('marque')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeSection === 'marque'
                ? 'border-[#1F4E79] text-[#1F4E79]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#1F4E79]" />
            <span>Marque & Devise (Colonne 1)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('colonnes')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeSection === 'colonnes'
                ? 'border-indigo-500 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>Colonnes 2, 3 & 5 (Cursus, Ressources & Veille)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('barre')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeSection === 'barre'
                ? 'border-slate-700 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layout className="w-4 h-4 text-slate-600" />
            <span>Barre Inférieure & Copyright</span>
          </button>
        </div>
      </div>

      {/* FORMULAIRE PRINCIPAL */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* SECTION 1 : COORDINATION ET PILOTAGE (Demande prioritaire de l'utilisateur) */}
        {activeSection === 'coordination' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#1F4E79] flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <span>Paramètres de la Colonne 4 : Coordination et Pilotage</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configurez l'entité coordinatrice (Cantic Think IA), l'adresse à Abidjan Cocody, les contacts téléphoniques et le lien WhatsApp direct.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* Titre de la colonne */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Titre de la colonne
                </label>
                <input
                  type="text"
                  value={config.column4Title}
                  onChange={(e) => setConfig({ ...config, column4Title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              {/* Nom de l'organisme coordinateur */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nom du Cabinet / Entité de pilotage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={config.coordinationEntityName}
                  onChange={(e) => setConfig({ ...config, coordinationEntityName: e.target.value })}
                  placeholder="Ex : Cantic Think IA"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              {/* Site web cliquable */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Site Web cliquable (URL complète) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={config.coordinationWebsiteUrl}
                    onChange={(e) => setConfig({ ...config, coordinationWebsiteUrl: e.target.value })}
                    placeholder="https://canticthinkia.work"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ce lien s'ouvrira dans un nouvel onglet lorsque l'utilisateur cliquera sur le nom du cabinet.
                </p>
              </div>

              {/* Standard Téléphonique */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Téléphone fixe / Standard
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.coordinationPhone}
                    onChange={(e) => setConfig({ ...config, coordinationPhone: e.target.value })}
                    placeholder="+225 25 22 00 12 39"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
              </div>

              {/* Email commercial / officiel */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Adresse email de contact
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={config.coordinationEmail}
                    onChange={(e) => setConfig({ ...config, coordinationEmail: e.target.value })}
                    placeholder="commercial@canticthinkia.work"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
              </div>

              {/* Responsable & Coordinateur */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Responsable / Coordinateur en chef
                </label>
                <input
                  type="text"
                  value={config.coordinationLeadName}
                  onChange={(e) => setConfig({ ...config, coordinationLeadName: e.target.value })}
                  placeholder="Kouassi Ouréga Goble"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              {/* Numéro WhatsApp du responsable */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Numéro WhatsApp direct du coordinateur
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.coordinationLeadWhatsapp}
                    onChange={(e) => {
                      const val = e.target.value;
                      const cleanNumber = val.replace(/\D/g, '');
                      setConfig({ 
                        ...config, 
                        coordinationLeadWhatsapp: val,
                        whatsappNumber: val,
                        whatsappUrl: `https://wa.me/${cleanNumber}`
                      });
                    }}
                    placeholder="+225 0103438456"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Génère automatiquement le lien direct : <code>https://wa.me/{config.coordinationLeadWhatsapp.replace(/\D/g, '')}</code>
                </p>
              </div>

              {/* Adresse géographique complète */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Adresse géographique physique
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={config.coordinationAddress}
                    onChange={(e) => setConfig({ ...config, coordinationAddress: e.target.value })}
                    placeholder="544, Deux Plateaux Agban — Rue 70, Carrefour Kratos, Cocody, Abidjan, Côte d'Ivoire"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
              </div>

              {/* Mention complémentaire / Ancrage pilote */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Laboratoire pilote / Mention complémentaire
                </label>
                <input
                  type="text"
                  value={config.coordinationComplementText || ''}
                  onChange={(e) => setConfig({ ...config, coordinationComplementText: e.target.value })}
                  placeholder="Laboratoire d'expérimentation territoriale : Commune de Zikisso (Hôtel de Ville)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2 : RÉSEAUX SOCIAUX & WHATSAPP */}
        {activeSection === 'reseaux' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#1F4E79] flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-emerald-500" />
                <span>Liens des Réseaux Sociaux & Bouton WhatsApp</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Positionnez les liens de vos pages dès leur création. Les boutons sont déjà visibles dans le pied de page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* WhatsApp direct */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>WhatsApp Officiel ({config.whatsappNumber})</span>
                </div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  Lien de discussion WhatsApp direct :
                </label>
                <input
                  type="text"
                  value={config.whatsappUrl}
                  onChange={(e) => setConfig({ ...config, whatsappUrl: e.target.value })}
                  placeholder="https://wa.me/2250103438456"
                  className="w-full p-2.5 bg-white border border-emerald-300 rounded-lg text-sm font-mono text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-emerald-700">
                  Permet à tout élu ou visiteur de démarrer un échange direct avec le coordinateur.
                </p>
              </div>

              {/* Facebook */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Facebook
                </label>
                <input
                  type="text"
                  value={config.facebookUrl}
                  onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/mooc-ecommunes"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              {/* X / Twitter */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Compte X (Twitter)
                </label>
                <input
                  type="text"
                  value={config.twitterUrl}
                  onChange={(e) => setConfig({ ...config, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/mooc_ecommunes"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page LinkedIn
                </label>
                <input
                  type="text"
                  value={config.linkedinUrl}
                  onChange={(e) => setConfig({ ...config, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/cantic-think-ia"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              {/* Numéro affiché */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Numéro de contact WhatsApp
                </label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  placeholder="+225 0103438456"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3 : MARQUE & DEVISE (Colonne 1) */}
        {activeSection === 'marque' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#1F4E79] flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>Paramètres de la Colonne 1 : Marque & Devise</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Nom officiel du programme, sous-titre vert néon et texte d'introduction républicain.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Titre principal de la marque
                </label>
                <input
                  type="text"
                  value={config.brandTitle}
                  onChange={(e) => setConfig({ ...config, brandTitle: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-[#1F4E79] focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sous-titre / Thématique (Vert émeraude)
                </label>
                <input
                  type="text"
                  value={config.brandSubtitle}
                  onChange={(e) => setConfig({ ...config, brandSubtitle: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Texte de présentation / Manifeste
                </label>
                <textarea
                  rows={4}
                  value={config.brandDescription}
                  onChange={(e) => setConfig({ ...config, brandDescription: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4 : COLONNES 2, 3 & 5 (Cursus, Ressources & Veille) */}
        {activeSection === 'colonnes' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#1F4E79] flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-indigo-500" />
                <span>Titres et Descriptions des Colonnes Pédagogiques & Veille</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* Colonne 2 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">Colonne 2 (Parcours & Cursus)</span>
                <div>
                  <label className="block text-slate-600 mb-1">Titre affiché :</label>
                  <input
                    type="text"
                    value={config.column2Title}
                    onChange={(e) => setConfig({ ...config, column2Title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* Colonne 3 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">Colonne 3 (Engagement & Ressources)</span>
                <div>
                  <label className="block text-slate-600 mb-1">Titre affiché :</label>
                  <input
                    type="text"
                    value={config.column3Title}
                    onChange={(e) => setConfig({ ...config, column3Title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-bold text-pink-600"
                  />
                </div>
              </div>

              {/* Colonne 5 : Veille Stratégique */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 md:col-span-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">Colonne 5 (Veille Stratégique & Newsletter)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Titre de la veille :</label>
                    <input
                      type="text"
                      value={config.column5Title}
                      onChange={(e) => setConfig({ ...config, column5Title: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-bold text-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Texte d'espace réservé (Placeholder) :</label>
                    <input
                      type="text"
                      value={config.newsletterPlaceholder}
                      onChange={(e) => setConfig({ ...config, newsletterPlaceholder: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-600 mb-1">Description explicative :</label>
                    <textarea
                      rows={2}
                      value={config.column5Description}
                      onChange={(e) => setConfig({ ...config, column5Description: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 5 : BARRE INFÉRIEURE & COPYRIGHT */}
        {activeSection === 'barre' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#1F4E79] flex items-center space-x-2">
                <Layout className="w-5 h-5 text-slate-700" />
                <span>Barre Inférieure & Bouton Central</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Texte de Copyright
                </label>
                <input
                  type="text"
                  value={config.copyrightText}
                  onChange={(e) => setConfig({ ...config, copyrightText: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Libellé du Bouton Central
                </label>
                <input
                  type="text"
                  value={config.consoleButtonText}
                  onChange={(e) => setConfig({ ...config, consoleButtonText: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bouton d'enregistrement flottant en bas */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
          >
            Rétablir les valeurs par défaut
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Enregistrer toutes les modifications</span>
          </button>
        </div>

      </form>

    </div>
  );
};
