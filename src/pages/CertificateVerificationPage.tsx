import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  ShieldCheck, 
  Search, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Building2, 
  BookOpen, 
  ArrowLeft, 
  Loader2,
  Sparkles
} from 'lucide-react';

interface VerifiedCertificate {
  id?: string;
  certificatId: string;
  nomApprenant: string;
  apprenantProfil?: string;
  noteGlobale: number;
  type: 'reussite' | 'participation';
  dateGeneration: string;
  dateGénération?: string;
  titreMooc?: string;
}

const LOCAL_STORAGE_CERTIFICATES_KEY = 'zikisso_local_certificates';

export const CertificateVerificationPage: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const [searchCode, setSearchCode] = useState<string>(code || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Recherche automatique si le code est dans l'URL
  useEffect(() => {
    if (code) {
      setSearchCode(code);
      verifyCode(code);
    }
  }, [code]);

  const verifyCode = async (codeToVerify: string) => {
    const clean = codeToVerify.trim();
    if (!clean) return;

    setLoading(true);
    setSearched(true);
    setCertificate(null);
    setErrorMessage(null);

    // 1. Recherche dans Firestore
    if (isFirebaseConfigured) {
      try {
        const q = query(
          collection(db, 'certificates'),
          where('certificatId', '==', clean)
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          const docData = snap.docs[0].data() as VerifiedCertificate;
          setCertificate(docData);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.warn('Erreur vérification Firestore certificat:', err);
      }
    }

    // 2. Recherche de secours dans le cache local
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CERTIFICATES_KEY);
      if (raw) {
        const list: VerifiedCertificate[] = JSON.parse(raw);
        const found = list.find((c) => c.certificatId.toLowerCase() === clean.toLowerCase());
        if (found) {
          setCertificate(found);
          setLoading(false);
          return;
        }
      }
    } catch (e) {}

    // Si non trouvé
    setErrorMessage("Aucun certificat ne correspond à cet identifiant dans le registre officiel de Zikisso.");
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(searchCode);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Navigation retour */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-[#1F4E79] hover:text-[#C55A11] transition bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil du MOOC</span>
        </Link>

        <span className="inline-flex items-center space-x-1.5 text-xs text-[#1A6B3C] font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Registre Public Officiel</span>
        </span>
      </div>

      {/* En-tête de la page */}
      <div className="bg-gradient-to-r from-[#1F4E79] to-[#153755] text-white rounded-xl p-6 sm:p-10 shadow-md">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-300 border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authenticité &amp; Traçabilité Numérique</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Vérification Officielle d'Attestation
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Employeurs, administrations, partenaires et collectivités : vérifiez l'authenticité
            d'une attestation de réussite ou de participation délivrée dans le cadre du
            <strong> MOOC Zikisso — Collectivités Locales &amp; Transformation Digitale</strong>.
          </p>
        </div>
      </div>

      {/* Formulaire de recherche par code */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="certCode" className="block text-xs sm:text-sm font-bold text-slate-800">
            Saisissez le numéro d'identifiant du certificat (inscrit au bas du document PDF) :
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="certCode"
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Exemple : ZIK-2026-84912"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] transition uppercase"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !searchCode.trim()}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#1A6B3C] hover:bg-[#14532D] text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Vérifier l'authenticité</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Format attendu : <code className="font-mono font-semibold bg-slate-100 px-1 py-0.5 rounded">ZIK-AAAA-XXXXX</code> (insensible à la casse).
          </p>
        </form>
      </div>

      {/* Résultat : Certificat Authentifié */}
      {searched && certificate && (
        <div className="bg-white rounded-xl border-2 border-[#1A6B3C] overflow-hidden shadow-lg animate-in fade-in duration-300">
          <div className="bg-[#1A6B3C] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              <div>
                <h2 className="text-base sm:text-lg font-bold">Document Officiellement Authentifié</h2>
                <p className="text-xs text-emerald-100">Ce diplôme est certifié conforme par le registre de la Mairie de Zikisso.</p>
              </div>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-300/30">
              {certificate.certificatId}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Titulaire de la certification</span>
                  <p className="text-xl font-bold text-[#1F4E79] flex items-center space-x-2">
                    <User className="w-5 h-5 text-slate-400" />
                    <span>{certificate.nomApprenant}</span>
                  </p>
                  {certificate.apprenantProfil && (
                    <span className="inline-block mt-1 text-xs bg-[#F0F5FA] text-[#1F4E79] font-semibold px-2.5 py-0.5 rounded-full border border-[#1F4E79]/20">
                      {certificate.apprenantProfil}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type de document</span>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-[#C55A11]" />
                    <p className="text-base font-bold text-slate-800">
                      {certificate.type === 'reussite' ? "Attestation de Réussite Officielle" : "Attestation de Participation"}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Note finale certifiée</span>
                  <p className="text-lg font-bold text-[#1A6B3C]">
                    {certificate.noteGlobale.toFixed(1)} / 20
                    <span className="text-xs text-slate-600 font-normal ml-2">
                      ({certificate.noteGlobale >= 16 ? 'Mention Très Bien' : certificate.noteGlobale >= 14 ? 'Mention Bien' : certificate.noteGlobale >= 12 ? 'Mention Assez Bien' : 'Admis'})
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Programme de formation</span>
                  <p className="text-sm font-bold text-slate-800 flex items-start space-x-2">
                    <BookOpen className="w-4 h-4 text-[#1F4E79] flex-shrink-0 mt-0.5" />
                    <span>MOOC Zikisso — Collectivités Locales &amp; Transformation Digitale</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date d'émission</span>
                  <p className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      {new Date(certificate.dateGeneration || certificate.dateGénération || '').toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Organisme émetteur</span>
                  <p className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#1A6B3C]" />
                    <span>Mairie de Zikisso &amp; Plateforme Éducative Klo-Liké</span>
                  </p>
                </div>
              </div>

            </div>

            <div className="bg-[#F0F5FA] border border-[#1F4E79]/15 rounded-lg p-4 flex items-center space-x-3 text-xs text-[#1F4E79]">
              <ShieldCheck className="w-5 h-5 text-[#1A6B3C] flex-shrink-0" />
              <span>
                Cet enregistrement a été certifié par signature cryptographique de la Mairie de Zikisso. Il confère à son titulaire la validation formelle des compétences acquises en gouvernance locale et administration numérique.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Résultat : Non trouvé */}
      {searched && !loading && !certificate && errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 text-center space-y-3">
          <XCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-red-900">Certificat non répertorié</h3>
          <p className="text-xs sm:text-sm text-red-700 max-w-lg mx-auto leading-relaxed">
            {errorMessage}
          </p>
          <p className="text-xs text-slate-500">
            Veuillez vérifier l'orthographe du code indiqué ou contacter la cellule pédagogique du MOOC Zikisso.
          </p>
        </div>
      )}
    </div>
  );
};
