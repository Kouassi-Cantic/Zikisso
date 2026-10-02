import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { generateCertificatePDF } from '../utils/generateCertificatePDF';
import { 
  Award, 
  Download, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  FileCheck, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Calendar 
} from 'lucide-react';

interface CertificateManagerProps {
  noteGlobale: number;
}

interface SavedCertificate {
  id?: string;
  uid: string;
  noteGlobale: number;
  type: 'reussite' | 'participation';
  dateGeneration: string;
  dateGénération?: string;
  certificatId: string;
  nomApprenant: string;
  commune?: string;
  region?: string;
  apprenantProfil?: string;
  photoUrl?: string;
  photoLieuEmblematiqueUrl?: string;
  lieuEmblematiqueNom?: string;
}

const LOCAL_STORAGE_CERTIFICATES_KEY = 'zikisso_local_certificates';

export const CertificateManager: React.FC<CertificateManagerProps> = ({ noteGlobale }) => {
  const { currentUser, userData } = useAuth();

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pastCertificates, setPastCertificates] = useState<SavedCertificate[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  // Détermination de l'éligibilité et du type
  // Note >= 12 : Attestation de Réussite
  // 10 <= Note < 12 : Attestation de Participation
  // Note < 10 : Non éligible pour le moment
  const isEligibleReussite = noteGlobale >= 12;
  const isEligibleParticipation = noteGlobale >= 10 && noteGlobale < 12;
  const isEligible = isEligibleReussite || isEligibleParticipation;
  const certificateType: 'reussite' | 'participation' = isEligibleReussite ? 'reussite' : 'participation';

  // 1. Chargement de l'historique des attestations générées
  const fetchCertificatesHistory = async () => {
    if (!currentUser) return;
    setLoadingHistory(true);

    if (isFirebaseConfigured) {
      try {
        const q = query(collection(db, 'certificates'), where('uid', '==', currentUser.uid));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as SavedCertificate[];
        list.sort((a, b) => new Date(b.dateGeneration).getTime() - new Date(a.dateGeneration).getTime());
        setPastCertificates(list);
      } catch (err) {
        console.warn('Erreur récupération certificats Firestore:', err);
      } finally {
        setLoadingHistory(false);
      }
    } else {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_CERTIFICATES_KEY);
        if (raw) {
          const list: SavedCertificate[] = JSON.parse(raw);
          const userList = list.filter((c) => c.uid === currentUser.uid);
          userList.sort((a, b) => new Date(b.dateGeneration).getTime() - new Date(a.dateGeneration).getTime());
          setPastCertificates(userList);
        }
      } catch (e) {
        console.warn('Erreur lecture certificats locaux:', e);
      } finally {
        setLoadingHistory(false);
      }
    }
  };

  useEffect(() => {
    fetchCertificatesHistory();
  }, [currentUser]);

  // 2. Génération et téléchargement du PDF + Enregistrement Firestore dans 'certificates'
  const handleDownloadCertificate = async () => {
    if (!currentUser || !isEligible) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      const nomApprenant = userData?.nom || currentUser.displayName || currentUser.email || 'Apprenant';
      const userCommune = userData?.commune || 'Zikisso';
      const userRegion = userData?.region || 'Lôh-Djiboua';
      const nowIso = new Date().toISOString();
      const codeType = certificateType === 'reussite' ? 'REU' : 'PAR';
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const certificatId = `ECOMM-${new Date().getFullYear()}-${codeType}-${randomDigits}`;

      // Enregistrement dans Firestore collection "certificates"
      const certRecord: SavedCertificate = {
        uid: currentUser.uid,
        noteGlobale: Math.round(noteGlobale * 10) / 10,
        type: certificateType,
        dateGeneration: nowIso,
        dateGénération: nowIso,
        certificatId,
        nomApprenant,
        commune: userCommune,
        region: userRegion,
        apprenantProfil: userData?.profil,
        photoUrl: userData?.photoUrl,
        photoLieuEmblematiqueUrl: userData?.photoLieuEmblematiqueUrl,
        lieuEmblematiqueNom: userData?.lieuEmblematiqueNom,
      };

      if (isFirebaseConfigured) {
        try {
          const docRef = await addDoc(collection(db, 'certificates'), {
            ...certRecord,
            userId: currentUser.uid,
            titreMooc: 'MOOC e-Communes — Gouvernance Municipale et Transformation Digitale',
            commune: userCommune,
            region: userRegion,
            createdAt: serverTimestamp(),
          });
          certRecord.id = docRef.id;
        } catch (err: any) {
          console.warn('Erreur enregistrement Firestore certificat:', err);
        }
      }

      // Sauvegarde de secours en cache local
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_CERTIFICATES_KEY);
        let list: SavedCertificate[] = raw ? JSON.parse(raw) : [];
        list.push(certRecord);
        localStorage.setItem(LOCAL_STORAGE_CERTIFICATES_KEY, JSON.stringify(list));
      } catch (e) {}

      // Génération effective du PDF côté client avec jsPDF
      const pdf = generateCertificatePDF({
        apprenantNom: nomApprenant,
        noteGlobale,
        type: certificateType,
        dateGeneration: nowIso,
        certificatId,
        apprenantProfil: userData?.profil,
        commune: userCommune,
        region: userRegion,
        photoUrl: userData?.photoUrl,
        photoLieuEmblematiqueUrl: userData?.photoLieuEmblematiqueUrl,
        lieuEmblematiqueNom: userData?.lieuEmblematiqueNom,
      });

      const cleanFileName = `Attestation_${certificateType === 'reussite' ? 'Reussite' : 'Participation'}_eCommunes_${userCommune}_${nomApprenant.replace(/\s+/g, '_')}.pdf`;
      pdf.save(cleanFileName);

      setPastCertificates((prev) => [certRecord, ...prev]);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err: any) {
      console.error('Erreur génération attestation PDF:', err);
      setErrorMessage("Impossible de générer le fichier PDF. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      
      {/* En-tête de section */}
      <div className="p-6 bg-[#F0F5FA] border-b border-[#1F4E79]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-[#C55A11]" />
          <h2 className="text-base font-bold text-[#1F4E79]">
            Certification et Attestation Officielle
          </h2>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded border border-slate-200 text-slate-700">
          Format vectoriel PDF certifié • MOOC e-Communes CI
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Cas 1 : Note >= 12/20 (Attestation de Réussite) */}
        {isEligibleReussite && (
          <div className="bg-[#F0F7F2] border-2 border-[#1A6B3C] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full bg-[#1A6B3C] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="w-7 h-7 text-emerald-200" />
              </div>

              <div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold bg-[#14532D] text-white mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Seuil de réussite atteint (≥ 12/20)</span>
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#14532D]">
                  Félicitations ! Votre Attestation de Réussite est disponible
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
                  Avec une note globale de <strong>{noteGlobale.toFixed(1)} / 20</strong>, vous validez le programme national de formation. Votre diplôme officiel mentionne votre ancrage territorial (<strong>{userData?.commune || 'Zikisso'}</strong>, Région <strong>{userData?.region || 'Lôh-Djiboua'}</strong>).
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadCertificate}
              disabled={isGenerating}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1A6B3C] hover:bg-[#14532D] text-white font-bold text-sm rounded-md shadow-md hover:shadow-lg transition flex-shrink-0 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:ring-offset-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Génération du PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Télécharger l'Attestation de Réussite (PDF)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Cas 2 : 10 <= Note < 12/20 (Attestation de Participation) */}
        {isEligibleParticipation && (
          <div className="bg-[#F0F5FA] border-2 border-[#1F4E79] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full bg-[#1F4E79] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <FileCheck className="w-7 h-7 text-blue-200" />
              </div>

              <div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold bg-[#1F4E79] text-white mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Seuil de participation atteint (10 à 12/20)</span>
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1F4E79]">
                  Votre Attestation de Participation est disponible
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
                  Avec une note globale de <strong>{noteGlobale.toFixed(1)} / 20</strong>, vous recevez l'Attestation officielle de Participation au MOOC e-Communes au titre de la Commune de <strong>{userData?.commune || 'Zikisso'}</strong>. Vous pouvez continuer d'améliorer vos quiz et devoirs pour obtenir l'Attestation de Réussite (seuil : 12/20).
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadCertificate}
              disabled={isGenerating}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1F4E79] hover:bg-[#153755] text-white font-bold text-sm rounded-md shadow-md hover:shadow-lg transition flex-shrink-0 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:ring-offset-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Génération du PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Télécharger l'Attestation de Participation (PDF)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Cas 3 : Note < 10/20 (En cours d'acquisition) */}
        {!isEligible && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-6 h-6 text-[#C55A11] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Attestations en cours de déblocage
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Votre note globale actuelle est de <strong>{noteGlobale.toFixed(1)} / 20</strong>.
                  Complétez vos quiz hebdomadaires et soumettez vos exercices fil rouge pour débloquer votre attestation :
                </p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs">
                  <span className="inline-flex items-center space-x-1 bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-[#1F4E79]" />
                    <span>Attestation de Participation : dès <strong>10 / 20</strong></span>
                  </span>
                  <span className="inline-flex items-center space-x-1 bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-[#1A6B3C]" />
                    <span>Attestation de Réussite : dès <strong>12 / 20</strong></span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs font-semibold px-4 py-2 bg-white rounded border border-slate-300 text-slate-500 flex-shrink-0">
              Score actuel : {noteGlobale.toFixed(1)}/20
            </div>
          </div>
        )}

        {/* Messages de statut */}
        {downloadSuccess && (
          <div
            role="status"
            className="p-3.5 bg-[#F0F7F2] border border-[#1A6B3C]/30 text-[#14532D] text-xs sm:text-sm rounded-md flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#1A6B3C] flex-shrink-0" />
            <span className="font-semibold">
              Votre attestation PDF a été générée et enregistrée avec succès dans le registre officiel !
            </span>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-md"
          >
            {errorMessage}
          </div>
        )}

        {/* Aperçu visuel des spécifications de l'attestation */}
        <div className="border border-slate-200 rounded-lg p-5 bg-white space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1F4E79] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#1A6B3C]" />
            <span>Caractéristiques officielles du document PDF délivré</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Identité certifiée</span>
              <strong className="text-slate-800">{userData?.nom || currentUser?.email}</strong>
            </div>

            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Titre du parcours</span>
              <strong className="text-[#1F4E79]">MOOC Zikisso — Décentralisation</strong>
            </div>

            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Charte graphique</span>
              <strong className="text-[#1A6B3C]">Vert / Marine / Orange</strong>
            </div>

            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Signature et Sceau</span>
              <strong className="text-slate-800">Mairie d'attache • Pilote Zikisso</strong>
            </div>
          </div>
        </div>

        {/* Historique des attestations générées pour cet utilisateur */}
        {pastCertificates.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-[#1F4E79]" />
              <span>Historique de vos attestations officielles</span>
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
              {pastCertificates.map((cert, index) => (
                <div
                  key={cert.id || index}
                  className="p-3.5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cert.type === 'reussite'
                          ? 'bg-[#1A6B3C] text-white'
                          : 'bg-[#1F4E79] text-white'
                      }`}
                    >
                      {cert.type === 'reussite' ? 'Réussite' : 'Participation'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      Réf : {cert.certificatId}
                    </span>
                    {cert.commune && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.5 rounded border border-slate-300">
                        📍 {cert.commune}
                      </span>
                    )}
                    <span className="text-slate-500">
                      • Note : <strong>{cert.noteGlobale} / 20</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-400">
                    <span>
                      Généré le{' '}
                      {new Date(cert.dateGeneration).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <Link
                      to={`/verifier-certificat/${cert.certificatId}`}
                      className="inline-flex items-center space-x-1 text-[#1A6B3C] hover:text-[#14532D] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 transition"
                      title="Vérifier la validité de cette attestation en ligne"
                    >
                      <ShieldCheck className="w-3 h-3 text-[#1A6B3C]" />
                      <span>Vérifier en ligne</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
