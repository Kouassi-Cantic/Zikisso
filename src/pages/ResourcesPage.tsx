import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage, isFirebaseConfigured } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { generateToolboxPDF, generateGlossaryPDF } from '../utils/generateResourcesPDF';
import { 
  BookOpen, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  PenTool, 
  HeartHandshake, 
  FolderDown, 
  Info,
  Calendar
} from 'lucide-react';

interface CharterSignature {
  id?: string;
  uid: string;
  nom: string;
  dateSignature: string;
  createdAt?: any;
}

const LOCAL_STORAGE_CHARTER_SIGNATURE_KEY = 'zikisso_local_charter_signature';

const DEFAULT_CHARTER_COMMITMENTS = [
  "Faire connaître les principes de transparence budgétaire et de contrôle citoyen au sein de ma communauté.",
  "Contribuer à une veille citoyenne bienveillante, constructive et rigoureuse sur les projets communaux de Zikisso.",
  "Promouvoir un usage responsable, inclusif et sécurisé des technologies numériques auprès de tous les usagers.",
  "Partager les connaissances acquises lors du MOOC, en particulier avec les jeunes et les acteurs de la société civile."
];

const DEFAULT_GLOSSARY_ITEMS: Array<[string, string]> = [
  ["Libre administration", "Principe selon lequel les collectivités gèrent leurs affaires par des conseils élus, sous contrôle de légalité."],
  ["Tutelle administrative", "Contrôle du représentant de l'État sur les actes locaux, limité à un contrôle de légalité a posteriori."],
  ["Contrôle de légalité", "Vérification de la conformité d'un acte local à la loi."],
  ["DGDDL", "Direction Générale de la Décentralisation et du Développement Local."],
  ["ONECI", "Office National de l'État Civil et de l'Identification."],
  ["Ordonnateur", "Autorité qui décide la dépense (le Maire), sans manier les fonds."],
  ["Receveur Municipal", "Comptable public chargé du maniement effectif des fonds communaux."],
  ["Séparation ordonnateur/comptable", "Principe de contrôle mutuel entre décision et maniement des fonds."],
  ["Plan Triennal", "Programmation glissante des investissements sur trois exercices."],
  ["Budget Primitif", "Budget prévisionnel voté avant le début de l'exercice."],
  ["Compte Administratif", "Document retraçant l'exécution réelle du budget."],
  ["Section de Fonctionnement", "Dépenses courantes, équilibre réel obligatoire."],
  ["Section d'Investissement", "Dépenses durables, financées par subventions/emprunts/péréquation."],
  ["FPCL", "Fonds de Péréquation des Collectivités Locales."],
  ["Patente", "Impôt d'État rétrocédé dû par commerçants et artisans."],
  ["Taxe communale directe", "Taxe instituée par délibération du Conseil Municipal."],
  ["Mobile Money / télépaiement", "Paiement électronique sécurisant la collecte des recettes."],
  ["USSD", "Protocole accessible sans connexion internet depuis un téléphone basique."],
  ["Guichet unique virtuel (e-Commune)", "Plateforme en ligne centralisant les démarches communales."],
  ["Jugement supplétif", "Décision judiciaire régularisant un acte de naissance hors délai."],
  ["Budget participatif", "Priorisation citoyenne consultative d'une part de l'investissement."],
  ["Comité de veille citoyenne", "Groupe d'habitants observant l'exécution d'un projet communal."]
];

export const ResourcesPage: React.FC = () => {
  const { currentUser, userData } = useAuth();

  // 1. État des documents de téléchargement
  const [downloadingToolbox, setDownloadingToolbox] = useState<boolean>(false);
  const [downloadingGlossary, setDownloadingGlossary] = useState<boolean>(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  // 2. État de la Charte d'Engagement Civique
  const [charterTitle, setCharterTitle] = useState<string>("Charte d'Engagement Civique de Zikisso");
  const [commitments, setCommitments] = useState<string[]>(DEFAULT_CHARTER_COMMITMENTS);
  const [loadingCharter, setLoadingCharter] = useState<boolean>(true);

  // Formulaire de signature
  const [signerNom, setSignerNom] = useState<string>('');
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [existingSignature, setExistingSignature] = useState<CharterSignature | null>(null);
  const [signatureSuccess, setSignatureSuccess] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);

  // 3. Lien vers la plateforme partenaire Klo-Liké (Ambassadeurs)
  const klolikeUrl = import.meta.env.VITE_CJAM_URL || 'https://www.klo-like.com';

  // Pré-remplissage du nom du signataire
  useEffect(() => {
    if (userData?.nom) {
      setSignerNom(userData.nom);
    } else if (currentUser?.displayName) {
      setSignerNom(currentUser.displayName);
    }
  }, [userData, currentUser]);

  // Chargement du texte de la Charte depuis Firestore (toolboxResources/charter)
  useEffect(() => {
    let isMounted = true;
    const fetchCharterData = async () => {
      setLoadingCharter(true);
      if (isFirebaseConfigured) {
        try {
          const docRef = doc(db, 'toolboxResources', 'charter');
          const snap = await getDoc(docRef);
          if (isMounted && snap.exists()) {
            const data = snap.data();
            if (data.title || data.titre) setCharterTitle(data.title || data.titre);
            if (Array.isArray(data.commitments || data.engagements)) {
              setCommitments(data.commitments || data.engagements);
            }
          }
        } catch (e) {
          console.warn('Lecture Firestore toolboxResources/charter:', e);
        }
      }
      if (isMounted) setLoadingCharter(false);
    };

    fetchCharterData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Vérification si l'utilisateur a déjà signé la charte
  useEffect(() => {
    let isMounted = true;
    const checkSignature = async () => {
      if (!currentUser) return;

      if (isFirebaseConfigured) {
        try {
          const q = query(
            collection(db, 'charterSignatures'),
            where('uid', '==', currentUser.uid)
          );
          const snap = await getDocs(q);
          if (isMounted && !snap.empty) {
            const docData = snap.docs[0];
            setExistingSignature({ id: docData.id, ...(docData.data() as any) });
            return;
          }
        } catch (e) {
          console.warn('Vérification signature Firestore:', e);
        }
      } else {
        try {
          const raw = localStorage.getItem(LOCAL_STORAGE_CHARTER_SIGNATURE_KEY);
          if (raw) {
            const list: CharterSignature[] = JSON.parse(raw);
            const found = list.find((s) => s.uid === currentUser.uid);
            if (isMounted && found) {
              setExistingSignature(found);
              return;
            }
          }
        } catch (e) {}
      }
    };

    checkSignature();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Handler de téléchargement de la Boîte à outils (Storage puis fallback générateur PDF)
  const handleDownloadToolbox = async () => {
    setDownloadingToolbox(true);
    setDownloadMessage(null);

    // 1. Tentative depuis Firebase Storage
    if (isFirebaseConfigured) {
      try {
        const fileRef = ref(storage, 'documents/boite-a-outils-zikisso.pdf');
        const url = await getDownloadURL(fileRef);
        window.open(url, '_blank');
        setDownloadMessage("Téléchargement lancé depuis Firebase Storage !");
        setDownloadingToolbox(false);
        return;
      } catch (err: any) {
        console.info("Fichier non trouvé dans Firebase Storage, bascule sur le générateur vectoriel PDF...", err?.code);
      }
    }

    // 2. Génération PDF instantanée côté client
    try {
      const pdf = generateToolboxPDF();
      pdf.save("Boite_a_Outils_MOOC_Zikisso.pdf");
      setDownloadMessage("Boîte à outils (Annexe A) téléchargée au format PDF !");
    } catch (e) {
      console.error("Erreur génération PDF Boîte à Outils", e);
    } finally {
      setDownloadingToolbox(false);
    }
  };

  // Handler de téléchargement du Glossaire (Storage puis fallback générateur PDF)
  const handleDownloadGlossary = async () => {
    setDownloadingGlossary(true);
    setDownloadMessage(null);

    // 1. Tentative depuis Firebase Storage
    if (isFirebaseConfigured) {
      try {
        const fileRef = ref(storage, 'documents/glossaire-zikisso.pdf');
        const url = await getDownloadURL(fileRef);
        window.open(url, '_blank');
        setDownloadMessage("Téléchargement lancé depuis Firebase Storage !");
        setDownloadingGlossary(false);
        return;
      } catch (err: any) {
        console.info("Fichier non trouvé dans Firebase Storage, bascule sur le générateur vectoriel PDF...", err?.code);
      }
    }

    // 2. Génération PDF instantanée côté client
    try {
      const pdf = generateGlossaryPDF(DEFAULT_GLOSSARY_ITEMS);
      pdf.save("Glossaire_MOOC_Zikisso.pdf");
      setDownloadMessage("Glossaire institutionnel (Annexe C) téléchargé au format PDF !");
    } catch (e) {
      console.error("Erreur génération PDF Glossaire", e);
    } finally {
      setDownloadingGlossary(false);
    }
  };

  // Handler de signature de la Charte d'Engagement Civique
  const handleSignCharter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignatureError(null);
    setSignatureSuccess(null);

    if (!isAgreed) {
      setSignatureError("Veuillez cocher la case 'Je m'engage' pour confirmer votre adhésion à la charte.");
      return;
    }

    const cleanNom = signerNom.trim();
    if (!cleanNom) {
      setSignatureError("Veuillez renseigner votre nom complet pour valider la signature.");
      return;
    }

    if (!currentUser) {
      setSignatureError("Vous devez être connecté pour signer la charte.");
      return;
    }

    setIsSigning(true);
    const nowIso = new Date().toISOString();

    const signaturePayload: CharterSignature = {
      uid: currentUser.uid,
      nom: cleanNom,
      dateSignature: nowIso,
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'charterSignatures'), {
          ...signaturePayload,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
        });
        signaturePayload.id = docRef.id;
        setExistingSignature(signaturePayload);
        setSignatureSuccess("Félicitations ! Votre signature de la Charte d'Engagement Civique a été enregistrée.");
      } catch (err: any) {
        console.error("Erreur enregistrement signature Firestore :", err);
        setSignatureError("Une erreur est survenue lors de l'enregistrement de votre signature.");
      } finally {
        setIsSigning(false);
      }
    } else {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_CHARTER_SIGNATURE_KEY);
        let list: CharterSignature[] = raw ? JSON.parse(raw) : [];
        list = list.filter((s) => s.uid !== currentUser.uid);
        list.push(signaturePayload);
        localStorage.setItem(LOCAL_STORAGE_CHARTER_SIGNATURE_KEY, JSON.stringify(list));
        setExistingSignature(signaturePayload);
        setSignatureSuccess("Votre signature a été enregistrée avec succès en mode local.");
      } catch (e) {}
      setIsSigning(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* En-tête institutionnel de la page Ressources */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F5FA] text-[#1F4E79] border border-[#1F4E79]/20 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Centre de Ressources Pédagogiques &amp; Engagements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4E79] tracking-tight">
              Ressources &amp; Charte Civique de Zikisso
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Téléchargez les guides pratiques et modèles méthodologiques (Boîte à outils &amp; Glossaire), signez la Charte d'Engagement Civique de Zikisso et rejoignez le réseau des Ambassadeurs locaux.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#1A6B3C] flex-shrink-0" />
            <span>Documents officiels en accès libre</span>
          </div>
        </div>
      </div>

      {downloadMessage && (
        <div
          role="status"
          className="p-3.5 bg-[#F0F7F2] border border-[#1A6B3C]/30 text-[#14532D] text-xs sm:text-sm rounded-md flex items-center space-x-2 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-[#1A6B3C] flex-shrink-0" />
          <span className="font-semibold">{downloadMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1 : TÉLÉCHARGEMENT BOÎTE À OUTILS (A) & GLOSSAIRE (C) EN PDF */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F4E79] flex items-center space-x-2">
              <FolderDown className="w-5 h-5 text-[#1A6B3C]" />
              <span>Supports &amp; Guides Pratiques à Télécharger (PDF)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Documents hébergés dans Firebase Storage (ou générés en haute définition).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Carte 1 : Boîte à outils (Annexe A) */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-[#1F4E79] transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-[#F0F5FA] text-[#1F4E79] border border-[#1F4E79]/20">
                  Annexe A
                </span>
                <span className="text-[11px] font-medium text-slate-400">PDF • Format A4</span>
              </div>

              <h3 className="text-lg font-bold text-[#1F4E79] mb-2">
                Boîte à Outils du Gestionnaire Communal
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Recueil de modèles opérationnels directement applicables au sein de la Mairie de Zikisso :
              </p>

              <ul className="space-y-1.5 text-xs text-slate-700 mb-6 bg-slate-50 p-3.5 rounded-md border border-slate-200/80">
                <li className="flex items-start space-x-2">
                  <span className="text-[#1A6B3C] font-bold">•</span>
                  <span><strong>A.1 :</strong> Trame de délibération municipale et visas juridiques</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1A6B3C] font-bold">•</span>
                  <span><strong>A.2 :</strong> Grille de suivi budgétaire simplifiée (engagements, dépenses)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1A6B3C] font-bold">•</span>
                  <span><strong>A.3 :</strong> Cahier des charges type d'un projet numérique communal</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleDownloadToolbox}
              disabled={downloadingToolbox}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1F4E79] hover:bg-[#153755] text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition disabled:opacity-50"
            >
              {downloadingToolbox ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Téléchargement en cours...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger la Boîte à Outils (PDF)</span>
                </>
              )}
            </button>
          </div>

          {/* Carte 2 : Glossaire (Annexe C) */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-[#1A6B3C] transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-[#F0F7F2] text-[#14532D] border border-[#1A6B3C]/30">
                  Annexe C
                </span>
                <span className="text-[11px] font-medium text-slate-400">PDF • Format A4</span>
              </div>

              <h3 className="text-lg font-bold text-[#1F4E79] mb-2">
                Glossaire Officiel des Collectivités Locales
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Référentiel des 22 concepts fondamentaux de la décentralisation et du numérique en Côte d'Ivoire :
              </p>

              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200/80 mb-6 text-xs text-slate-700 space-y-1">
                <p>
                  • Décentralisation, libre administration, tutelle administrative, contrôle de légalité.
                </p>
                <p>
                  • Ordonnateur, Receveur municipal, séparation des fonctions, FPCL, patente.
                </p>
                <p>
                  • ONECI, jugement supplétif, e-Commune, télépaiement Mobile Money, USSD.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadGlossary}
              disabled={downloadingGlossary}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition disabled:opacity-50"
            >
              {downloadingGlossary ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Téléchargement en cours...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger le Glossaire (PDF)</span>
                </>
              )}
            </button>
          </div>

        </div>

        <div className="mt-3 text-[11px] text-slate-500 flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-[#1F4E79]" />
          <span>
            Chemins configurés dans Firebase Storage : <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">documents/boite-a-outils-zikisso.pdf</code> et <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">documents/glossaire-zikisso.pdf</code>.
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2 : MODULE DE SIGNATURE DE LA CHARTE D'ENGAGEMENT CIVIQUE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-[#FDF4ED] border-b border-[#C55A11]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-[#C55A11]" />
            <h2 className="text-base sm:text-lg font-bold text-[#A3480C]">
              {charterTitle}
            </h2>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded border border-[#C55A11]/30 text-[#A3480C]">
            Engagement citoyen individuel
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            En tant qu'apprenant(e) du MOOC Zikisso, vous êtes invité(e) à souscrire solennellement à la 
            <strong> Charte d'Engagement Civique</strong>. Cette démarche acte votre engagement à mettre vos 
            compétences au service de la transparence, de la bonne gestion des affaires locales et du bien-être 
            des populations de Zikisso.
          </p>

          {/* Liste des 4 engagements civiques */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
            <span className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider block mb-2">
              Les 4 engagements républicains et communautaires :
            </span>

            {commitments.map((eng, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-800">
                <span className="w-5 h-5 rounded-full bg-[#1A6B3C] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">{eng}</span>
              </div>
            ))}
          </div>

          {/* État : déjà signée */}
          {existingSignature ? (
            <div className="bg-[#F0F7F2] border-2 border-[#1A6B3C] rounded-lg p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-[#1A6B3C] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#14532D] uppercase tracking-wider">
                      Charte Officiellement Signée &amp; Validée
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                      Signataire : {existingSignature.nom}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Votre engagement citoyen est enregistré dans le registre communal Firestore (collection <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#1A6B3C]/30 text-[#14532D]">charterSignatures</code>).
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white px-3 py-2 rounded-md border border-[#1A6B3C]/20 self-start sm:self-auto">
                  <Calendar className="w-4 h-4 text-[#1A6B3C]" />
                  <span>
                    Signé le{' '}
                    {new Date(existingSignature.dateSignature).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Formulaire de signature */
            <form onSubmit={handleSignCharter} className="border border-slate-200 rounded-lg p-6 bg-white space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#1F4E79] uppercase tracking-wider mb-2">
                <PenTool className="w-4 h-4 text-[#1F4E79]" />
                <span>Formulaire de souscription en ligne</span>
              </div>

              {signatureError && (
                <div
                  role="alert"
                  className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{signatureError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="signer-name" className="block text-xs font-bold text-slate-700">
                  Nom et Prénom(s) du signataire <span className="text-red-500">*</span>
                </label>
                <input
                  id="signer-name"
                  type="text"
                  required
                  value={signerNom}
                  onChange={(e) => setSignerNom(e.target.value)}
                  placeholder="Ex : KOUASSI Yao Norbert"
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                  disabled={isSigning}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#1A6B3C] rounded border-slate-300 focus:ring-[#1A6B3C]"
                    disabled={isSigning}
                  />
                  <span className="text-xs sm:text-sm text-slate-700 font-semibold select-none">
                    Je m'engage formellement à respecter et promouvoir les principes de la présente Charte d'Engagement Civique de Zikisso.
                  </span>
                </label>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSigning || !isAgreed}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-semibold rounded-md shadow transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:ring-offset-2"
                >
                  {isSigning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement de la signature...</span>
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4" />
                      <span>Signer la Charte</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3 : ENCART "DEVENIR AMBASSADEUR KLO-LIKÉ" (ALPHABÉTISATION & PETITE ENFANCE) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#1F4E79] to-[#153755] text-white rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Alphabétisation &amp; Petite Enfance</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Devenir Ambassadeur de la plateforme Klo-Liké
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Pour ceux qui souhaitent devenir des <strong>Ambassadeurs de la plateforme Klo-Liké</strong> dédiée à <strong>l'alphabétisation des adultes et de la petite enfance</strong> : relayez localement les initiatives éducatives, facilitez l'apprentissage des savoirs fondamentaux et contribuez à l'éveil des plus jeunes dans les campements, villages et quartiers de Zikisso.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200 pt-1">
              <span>• Alphabétisation et savoirs de base des adultes</span>
              <span>• Éveil et soutien éducatif à la petite enfance</span>
              <span>• Sensibilisation communautaire et inclusion</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <a
              href={klolikeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#C55A11] hover:bg-[#A3480C] text-white text-xs sm:text-sm font-bold rounded-md shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#1F4E79]"
            >
              <Globe className="w-4 h-4" />
              <span>Rejoindre Klo-Liké</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
