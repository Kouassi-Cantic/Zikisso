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
import { generateCourseGuidePDF } from '../utils/generateCourseGuidePDF';
import { AudioReader } from '../components/AudioReader';
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
  Calendar,
  Search,
  Volume2
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
  ["Libre administration", "Principe constitutionnel selon lequel les collectivités territoriales s'administrent librement par des conseils élus, sous le contrôle de légalité de l'État."],
  ["Tutelle administrative", "Contrôle exercé par le représentant de l'État (Préfet de Lakota) sur les actes communaux, limité à un contrôle de légalité a posteriori."],
  ["Contrôle de légalité", "Vérification de la stricte conformité d'une délibération ou d'un acte municipal aux lois et règlements en vigueur."],
  ["DGDDL", "Direction Générale de la Décentralisation et du Développement Local, organe national de coordination des collectivités."],
  ["ONECI", "Office National de l'État Civil et de l'Identification, chargé de la fiabilisation et de la numérisation des registres."],
  ["Ordonnateur", "Autorité exécutive qui prescrit l'exécution des recettes et engage les dépenses (le Maire), sans pouvoir manier les fonds publics."],
  ["Receveur Municipal", "Comptable public assermenté du Trésor, seul habilité à manier les fonds et exécuter les paiements réguliers."],
  ["Séparation ordonnateur/comptable", "Principe républicain fondamental garantissant le contrôle mutuel et prévenant les détournements de deniers publics."],
  ["Plan Triennal", "Document de programmation glissante par lequel la commune planifie ses investissements sur trois exercices successifs."],
  ["Budget Primitif", "Acte de prévision et d'autorisation financière voté par le Conseil Municipal avant le début de l'exercice budgétaire."],
  ["Compte Administratif", "Bilan annuel d'exécution budgétaire présenté par le Maire au Conseil Municipal à la clôture de l'exercice."],
  ["Section de Fonctionnement", "Section du budget consacrée aux charges courantes et salaires, obligatoirement votée en équilibre réel."],
  ["Section d'Investissement", "Section du budget finançant les infrastructures pérennes (écoles, dispensaires, voirie, eau potable)."],
  ["FPCL", "Fonds de Péréquation des Collectivités Locales, mécanisme de solidarité financière redistribué aux communes."],
  ["Patente", "Impôt d'État rétrocédé versé par les entreprises, artisans et commerçants, dont une fraction revient à la commune."],
  ["Taxe communale directe", "Prélèvement institué directement par délibération du Conseil Municipal (droits de place, stationnement, voirie)."],
  ["Mobile Money / télépaiement", "Encaissement électronique sécurisé réduisant la manipulation d'espèces et traçant chaque recette journalière."],
  ["USSD", "Protocole numérique interactif accessible sans forfait data ni connexion Internet depuis n'importe quel téléphone mobile basique."],
  ["Guichet unique virtuel (e-Commune)", "Portail numérique dématérialisant les demandes d'actes d'état civil, certificats et démarches administratives."],
  ["Jugement supplétif", "Décision judiciaire permettant la délivrance d'un acte de naissance lorsque le délai légal de déclaration (3 mois) a expiré."],
  ["Budget participatif", "Processus démocratique invitant les citoyens à prioriser directement une enveloppe d'investissements de leur quartier ou village."],
  ["Comité de veille citoyenne", "Instance consultative de résidents observant la bonne réalisation des travaux communaux et la qualité des services publics."]
];

export const ResourcesPage: React.FC = () => {
  const { currentUser, userData } = useAuth();

  // 1. État des documents de téléchargement
  const [downloadingToolbox, setDownloadingToolbox] = useState<boolean>(false);
  const [downloadingGlossary, setDownloadingGlossary] = useState<boolean>(false);
  const [downloadingCourseGuide, setDownloadingCourseGuide] = useState<boolean>(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  // 2. État de la Charte d'engagement
  const [charterTitle, setCharterTitle] = useState<string>("Charte d'Engagement Civique de Zikisso");
  const [commitments, setCommitments] = useState<string[]>(DEFAULT_CHARTER_COMMITMENTS);
  const [loadingCharter, setLoadingCharter] = useState<boolean>(true);
  const [signerNom, setSignerNom] = useState<string>('');
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [existingSignature, setExistingSignature] = useState<CharterSignature | null>(null);
  const [signatureSuccess, setSignatureSuccess] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);

  // 3. Recherche dans le glossaire interactif
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  // 4. Lien vers la plateforme partenaire Klo-Liké (Ambassadeurs)
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
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && isMounted) {
            const data = docSnap.data();
            if (data.title) setCharterTitle(data.title);
            if (Array.isArray(data.commitments) && data.commitments.length > 0) {
              setCommitments(data.commitments);
            }
          }
        } catch (err) {
          console.warn("Utilisation de la charte locale:", err);
        }
      }
      if (isMounted) setLoadingCharter(false);
    };

    fetchCharterData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Vérification de signature existante (Firestore ou local)
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
          if (!snap.empty && isMounted) {
            const docData = snap.docs[0].data() as CharterSignature;
            setExistingSignature({ id: snap.docs[0].id, ...docData });
            return;
          }
        } catch (err) {
          console.warn("Vérification signature locale:", err);
        }
      }

      // Secours local
      try {
        const raw = localStorage.getItem(`${LOCAL_STORAGE_CHARTER_SIGNATURE_KEY}_${currentUser.uid}`);
        if (raw && isMounted) {
          setExistingSignature(JSON.parse(raw));
        }
      } catch (e) {}
    };

    checkSignature();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Téléchargement Fascicule Complet
  const handleDownloadCourseGuide = () => {
    try {
      setDownloadingCourseGuide(true);
      const pdf = generateCourseGuidePDF();
      pdf.save("Fascicule_Pedagogique_Integral_MOOC_Zikisso.pdf");
      setDownloadMessage("Le Fascicule complet du cours (4 semaines + module bonus) a été généré avec succès.");
      setTimeout(() => setDownloadMessage(null), 5000);
    } catch (err) {
      console.error("Erreur téléchargement fascicule:", err);
    } finally {
      setDownloadingCourseGuide(false);
    }
  };

  // Téléchargement Boîte à outils
  const handleDownloadToolbox = async () => {
    setDownloadingToolbox(true);
    setDownloadMessage(null);

    if (isFirebaseConfigured) {
      try {
        const fileRef = ref(storage, 'documents/boite-a-outils-zikisso.pdf');
        const url = await getDownloadURL(fileRef);
        window.open(url, '_blank');
        setDownloadMessage("Téléchargement de la Boîte à outils lancé depuis le serveur.");
        setDownloadingToolbox(false);
        setTimeout(() => setDownloadMessage(null), 5000);
        return;
      } catch (err) {
        console.warn("Génération locale du PDF Boîte à Outils...");
      }
    }

    try {
      const pdf = generateToolboxPDF();
      pdf.save('Boite_a_Outils_Gestionnaire_Communal_Zikisso.pdf');
      setDownloadMessage("La Boîte à Outils a été générée avec succès en PDF haute définition.");
    } catch (err) {
      console.error("Erreur génération PDF Boîte à Outils:", err);
    } finally {
      setDownloadingToolbox(false);
      setTimeout(() => setDownloadMessage(null), 5000);
    }
  };

  // Téléchargement Glossaire
  const handleDownloadGlossary = async () => {
    setDownloadingGlossary(true);
    setDownloadMessage(null);

    if (isFirebaseConfigured) {
      try {
        const fileRef = ref(storage, 'documents/glossaire-zikisso.pdf');
        const url = await getDownloadURL(fileRef);
        window.open(url, '_blank');
        setDownloadMessage("Téléchargement du Glossaire officiel lancé depuis le serveur.");
        setDownloadingGlossary(false);
        setTimeout(() => setDownloadMessage(null), 5000);
        return;
      } catch (err) {
        console.warn("Génération locale du PDF Glossaire...");
      }
    }

    try {
      const pdf = generateGlossaryPDF(DEFAULT_GLOSSARY_ITEMS);
      pdf.save('Glossaire_Officiel_Collectivites_Locales_Zikisso.pdf');
      setDownloadMessage("Le Glossaire Officiel a été généré avec succès en PDF haute définition.");
    } catch (err) {
      console.error("Erreur génération PDF Glossaire:", err);
    } finally {
      setDownloadingGlossary(false);
      setTimeout(() => setDownloadMessage(null), 5000);
    }
  };

  // Soumission de la signature de la Charte
  const handleSignCharter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!signerNom.trim()) {
      setSignatureError("Veuillez renseigner votre nom complet pour signer la charte.");
      return;
    }
    if (!isAgreed) {
      setSignatureError("Vous devez cocher la case d'engagement pour valider votre signature.");
      return;
    }

    setIsSigning(true);
    setSignatureError(null);
    setSignatureSuccess(null);

    const nowIso = new Date().toISOString();
    const signatureRecord: CharterSignature = {
      uid: currentUser.uid,
      nom: signerNom.trim(),
      dateSignature: nowIso,
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'charterSignatures'), {
          ...signatureRecord,
          userId: currentUser.uid,
          userEmail: currentUser.email || '',
          charterTitle,
          createdAt: serverTimestamp(),
        });
        signatureRecord.id = docRef.id;
      } catch (err: any) {
        console.warn("Erreur sauvegarde Firestore signature:", err);
      }
    }

    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_CHARTER_SIGNATURE_KEY}_${currentUser.uid}`,
        JSON.stringify(signatureRecord)
      );
    } catch (e) {}

    setExistingSignature(signatureRecord);
    setSignatureSuccess("Félicitations ! Votre signature de la Charte d'Engagement Civique a été officiellement enregistrée.");
    setIsSigning(false);
  };

  // Filtrage du glossaire
  const filteredGlossary = DEFAULT_GLOSSARY_ITEMS.filter(([terme, def]) =>
    terme.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-16">
      
      {/* En-tête de la page */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F5FA] text-[#1F4E79] border border-[#1F4E79]/20 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Centre de Ressources Pédagogiques &amp; Engagements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F4E79] tracking-tight">
              Ressources, Guides &amp; Charte Civique
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Téléchargez les supports de cours complets pour l'étude hors-ligne, consultez le glossaire interactif sonorisé et signez la Charte d'Engagement Civique de Zikisso.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center space-x-2 self-start md:self-auto">
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
      {/* SECTION 1 : TÉLÉCHARGEMENTS DES DOCUMENTS PDF OFFICIELS (3 GUIDES) */}
      {/* ========================================================================= */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#1F4E79] flex items-center space-x-2">
            <FolderDown className="w-5 h-5 text-[#1A6B3C]" />
            <span>Guides Pratiques &amp; Fascicule Complet (PDF)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Téléchargeables pour consultation hors-ligne ou impression sur le terrain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Carte 1 : Fascicule Complet (Nouveau) */}
          <div className="bg-white rounded-xl border-2 border-emerald-500/30 p-6 shadow-sm flex flex-col justify-between hover:border-[#1A6B3C] transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-[#1A6B3C] border border-emerald-200">
                  Cours Intégral
                </span>
                <span className="text-[11px] font-medium text-slate-400">PDF • 4 Semaines</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#1F4E79] mb-2">
                Fascicule Pédagogique Complet du MOOC
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                L'ensemble du cours réuni en un document unique structuré :
              </p>

              <ul className="space-y-1 text-[11px] text-slate-700 mb-6 bg-slate-50 p-3 rounded-md border border-slate-200">
                <li>• Les 4 semaines de formation + module bonus</li>
                <li>• Toutes les capsules théoriques et focus digitaux</li>
                <li>• Les énoncés et corrigés indicatifs des exercices</li>
              </ul>
            </div>

            <button
              onClick={handleDownloadCourseGuide}
              disabled={downloadingCourseGuide}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {downloadingCourseGuide ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Génération du PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger le Fascicule (PDF)</span>
                </>
              )}
            </button>
          </div>

          {/* Carte 2 : Boîte à outils (Annexe A) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-[#1F4E79] transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-[#F0F5FA] text-[#1F4E79] border border-[#1F4E79]/20">
                  Annexe A
                </span>
                <span className="text-[11px] font-medium text-slate-400">PDF • Modèles</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#1F4E79] mb-2">
                Boîte à Outils du Gestionnaire Communal
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Modèles opérationnels directement applicables à la Mairie de Zikisso :
              </p>

              <ul className="space-y-1 text-[11px] text-slate-700 mb-6 bg-slate-50 p-3 rounded-md border border-slate-200">
                <li>• A.1 : Trame de délibération municipale et visas</li>
                <li>• A.2 : Grille de suivi budgétaire simplifiée</li>
                <li>• A.3 : Cahier des charges projet numérique communal</li>
              </ul>
            </div>

            <button
              onClick={handleDownloadToolbox}
              disabled={downloadingToolbox}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1F4E79] hover:bg-[#153755] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {downloadingToolbox ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Téléchargement...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger la Boîte à Outils</span>
                </>
              )}
            </button>
          </div>

          {/* Carte 3 : Glossaire (Annexe C) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-400 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-[#FDF4ED] text-[#A3480C] border border-[#C55A11]/30">
                  Annexe C
                </span>
                <span className="text-[11px] font-medium text-slate-400">PDF • 22 Termes</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#1F4E79] mb-2">
                Glossaire Officiel des Collectivités
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Référentiel des 22 concepts fondamentaux de la décentralisation ivoirienne :
              </p>

              <ul className="space-y-1 text-[11px] text-slate-700 mb-6 bg-slate-50 p-3 rounded-md border border-slate-200">
                <li>• Libre administration, contrôle de légalité, tutelle</li>
                <li>• Séparation ordonnateur/comptable, FPCL, patente</li>
                <li>• ONECI, jugement supplétif, USSD, e-Commune</li>
              </ul>
            </div>

            <button
              onClick={handleDownloadGlossary}
              disabled={downloadingGlossary}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {downloadingGlossary ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Téléchargement...</span>
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
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2 : MODULE DE SIGNATURE DE LA CHARTE D'ENGAGEMENT CIVIQUE AVEC AUDIO */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-[#FDF4ED] border-b border-[#C55A11]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-[#C55A11]" />
            <h2 className="text-base sm:text-lg font-bold text-[#A3480C]">
              {charterTitle}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* Synthèse vocale de la Charte */}
            <AudioReader
              text={`Charte d'engagement civique de Zikisso. ${commitments.map((c, i) => `Engagement ${i + 1} : ${c}`).join('. ')}`}
              title="Lecture vocale de la Charte"
              variant="button"
            />
            <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded border border-[#C55A11]/30 text-[#A3480C]">
              Engagement citoyen individuel
            </span>
          </div>
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

              {signatureSuccess && (
                <div
                  role="status"
                  className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{signatureSuccess}</span>
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
      {/* SECTION 3 : GLOSSAIRE INTERACTIF SONORISÉ (AVEC LECTURE VOCALE NATIVE) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1F4E79] flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#1F4E79]" />
              <span>Glossaire Interactif Sonorisé (22 Notions Clés)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recherchez une notion et écoutez sa définition officielle d'un clic.
            </p>
          </div>

          {/* Recherche dans le glossaire */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Filtrer une notion..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map(([terme, definition], idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 hover:bg-white rounded-lg border border-slate-200 p-4 transition-all hover:shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-[#1F4E79]">
                    {terme}
                  </h3>
                  {/* Synthèse vocale de la définition */}
                  <AudioReader
                    text={`${terme}. ${definition}`}
                    variant="compact"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {definition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4 : ENCART "DEVENIR AMBASSADEUR KLO-LIKÉ" (ALPHABÉTISATION & PETITE ENFANCE) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#1F4E79] to-[#153755] text-white rounded-xl p-6 sm:p-8 shadow-sm">
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
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#C55A11] hover:bg-[#A3480C] text-white text-xs sm:text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#1F4E79]"
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
