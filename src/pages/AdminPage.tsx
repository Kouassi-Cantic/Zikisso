import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import type { SubmissionData, ExerciceFilRouge, NotationCritere } from '../types';
import { DEFAULT_EXERCISES } from '../data/defaultExercises';
import { TerritoryObservatory } from '../components/TerritoryObservatory';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  User, 
  FileText, 
  Award, 
  MessageSquare, 
  Save, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Filter, 
  ChevronRight, 
  BookOpen,
  Building2,
  MapPin
} from 'lucide-react';

const LOCAL_STORAGE_SUBMISSIONS_KEY = 'zikisso_local_submissions';

export const AdminPage: React.FC = () => {
  const { userData, currentUser } = useAuth();

  // Onglet actif : 'corrections' ou 'observatoire'
  const [activeTab, setActiveTab] = useState<'corrections' | 'observatoire'>('corrections');

  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Soumission sélectionnée pour correction
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  // État du formulaire de notation pour la soumission sélectionnée
  const [notesParCritere, setNotesParCritere] = useState<Record<string, number>>({});
  const [commentaire, setCommentaire] = useState<string>('');
  const [isSavingGrade, setIsSavingGrade] = useState<boolean>(false);
  const [gradeSuccessMessage, setGradeSuccessMessage] = useState<string | null>(null);
  const [gradeErrorMessage, setGradeErrorMessage] = useState<string | null>(null);

  // Filtre d'affichage
  const [filterStatus, setFilterStatus] = useState<'en_attente' | 'noté' | 'toutes'>('en_attente');

  // Chargement des soumissions
  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);

    if (isFirebaseConfigured) {
      try {
        const q = query(collection(db, 'submissions'), orderBy('dateEnvoi', 'asc'));
        const snap = await getDocs(q);
        const list: SubmissionData[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setSubmissions(list);

        // Sélectionner par défaut la première soumission en attente si disponible
        const firstPending = list.find((s) => s.statut === 'en_attente') || list[0];
        if (firstPending && !selectedSubId) {
          setSelectedSubId(firstPending.id || null);
        }
      } catch (err: any) {
        console.error('Erreur récupération soumissions Firestore:', err);
        setError('Impossible de charger les soumissions. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    } else {
      // Mode simulation secours local
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
        let list: SubmissionData[] = raw ? JSON.parse(raw) : [];

        // Si la liste locale est vide, générons des données de test institutionnelles pour tester immédiatement
        if (list.length === 0) {
          list = [
            {
              id: 'sub_demo_1',
              uid: 'demo_user_1',
              apprenantNom: 'Kouassi Yao Norbert',
              apprenantEmail: 'norbert.kouassi@zikisso.ci',
              apprenantProfil: 'Agent technique de mairie',
              exerciceId: 'semaine-1',
              exerciceTitre: 'Exercice Fil Rouge — Semaine 1 : Diagnostic institutionnel',
              texte: `Dans le cadre de l'exercice de la semaine 1, voici mon analyse de la gouvernance locale à Zikisso :

1. Délimitation des compétences :
La commune de Zikisso jouit de compétences transférées propres (gestion de l'état civil, voirie locale, salubrité des marchés, écoles primaires). La tutelle administrative du Sous-Préfet intervient a posteriori sous la forme d'un contrôle de légalité des actes pour s'assurer de leur conformité républicaine, sans s'immiscer dans l'opportunité des décisions.

2. Problématique de coordination identifiée :
Nous constatons un chevauchement récurrent lors de l'attribution des parcelles et places du marché central entre les directives de la chefferie coutumière et les arrêtés municipaux d'occupation du domaine public. Ce manque d'alignement engendre des contestations et une déperdition de recettes fiscales.

3. Recommandations opérationnelles :
- Création d'un comité mixte de concertation mensuel (Mairie, Chefferie traditionnelle, Délégués des commerçants).
- Établissement d'un plan parcellaire cartographié numérique partagé consultable au guichet unique de la mairie.
- Campagne conjointe de sensibilisation civique sur l'importance du paiement régulier des droits de place.`,
              statut: 'en_attente',
              dateEnvoi: new Date(Date.now() - 3600000 * 24).toISOString(),
            },
            {
              id: 'sub_demo_2',
              uid: 'demo_user_2',
              apprenantNom: 'Bakayoko Awa',
              apprenantEmail: 'awa.bakayoko@zikisso.ci',
              apprenantProfil: 'Conseiller municipal élu',
              exerciceId: 'semaine-2',
              exerciceTitre: 'Exercice Fil Rouge — Semaine 2 : Stratégie budgétaire',
              texte: `Proposition d'optimisation de la fiscalité locale de la mairie de Zikisso :

Notre priorité doit porter sur la modernisation du recouvrement des taxes foraines. Actuellement, la collecte manuelle sans reçu informatisé entraîne des déperditions. Je propose d'introduire des terminaux mobiles de paiement ou tickets QR-code sécurisés. En retour, la mairie doit afficher à l'entrée du marché les investissements financés par ces taxes (lampadaires solaires, points d'eau).`,
              statut: 'en_attente',
              dateEnvoi: new Date(Date.now() - 3600000 * 5).toISOString(),
            }
          ];
          localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(list));
        }

        list.sort((a, b) => new Date(a.dateEnvoi).getTime() - new Date(b.dateEnvoi).getTime());
        setSubmissions(list);
        if (list.length > 0 && !selectedSubId) {
          setSelectedSubId(list[0].id || null);
        }
      } catch (e) {
        console.warn('Erreur lecture soumissions locales:', e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const selectedSubmission = submissions.find((s) => s.id === selectedSubId) || null;
  const currentExercice: ExerciceFilRouge | null = selectedSubmission
    ? DEFAULT_EXERCISES[selectedSubmission.exerciceId] || null
    : null;

  // Initialisation du formulaire lors de la sélection d'une soumission
  useEffect(() => {
    if (selectedSubmission) {
      setGradeSuccessMessage(null);
      setGradeErrorMessage(null);
      setCommentaire(selectedSubmission.commentaire || '');

      if (selectedSubmission.notesParCritere) {
        setNotesParCritere(selectedSubmission.notesParCritere);
      } else if (currentExercice) {
        // Initialise à zéro pour chaque critère
        const initialNotes: Record<string, number> = {};
        currentExercice.grilleNotation.forEach((c) => {
          initialNotes[c.id] = 0;
        });
        setNotesParCritere(initialNotes);
      }
    }
  }, [selectedSubId, selectedSubmission?.id]);

  // Gestion de la saisie des notes par critère
  const handleScoreChange = (critereId: string, valueStr: string, max: number) => {
    let val = parseFloat(valueStr);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > max) val = max;

    setNotesParCritere((prev) => ({
      ...prev,
      [critereId]: val,
    }));
  };

  // Calcul automatique du total de la note
  const computedTotalNote = currentExercice
    ? currentExercice.grilleNotation.reduce((acc, c) => acc + (notesParCritere[c.id] || 0), 0)
    : 0;

  const totalPointsMax = currentExercice
    ? currentExercice.grilleNotation.reduce((acc, c) => acc + c.pointsMax, 0)
    : 20;

  // Validation de la notation par l'administrateur
  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !selectedSubmission.id) return;

    if (!commentaire.trim()) {
      setGradeErrorMessage("Veuillez saisir un commentaire d'évaluation pour guider l'apprenant.");
      return;
    }

    setIsSavingGrade(true);
    setGradeSuccessMessage(null);
    setGradeErrorMessage(null);

    const nowIso = new Date().toISOString();

    const updatePayload = {
      notesParCritere,
      note: Math.round(computedTotalNote * 10) / 10,
      totalPointsMax,
      commentaire: commentaire.trim(),
      statut: 'noté' as const,
      dateCorrection: nowIso,
      correcteurNom: userData?.nom || currentUser?.email || 'Administrateur',
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, 'submissions', selectedSubmission.id);
        await updateDoc(docRef, {
          ...updatePayload,
          updatedAt: serverTimestamp(),
        });

        // Mise à jour de l'état local
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSubmission.id ? { ...s, ...updatePayload } : s))
        );
        setGradeSuccessMessage("Évaluation enregistrée et statut passé à 'noté' avec succès !");
      } catch (err: any) {
        console.error('Erreur mise à jour note Firestore:', err);
        setGradeErrorMessage("Erreur lors de l'enregistrement sur le serveur.");
      } finally {
        setIsSavingGrade(false);
      }
    } else {
      // Mode simulation secours local
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
        let list: SubmissionData[] = raw ? JSON.parse(raw) : [];
        list = list.map((s) =>
          s.id === selectedSubmission.id ? { ...s, ...updatePayload } : s
        );
        localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(list));
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSubmission.id ? { ...s, ...updatePayload } : s))
        );
        setGradeSuccessMessage("Évaluation locale enregistrée avec succès (statut : noté).");
      } catch (e) {
        console.warn('Erreur mise à jour locale soumission:', e);
      }
      setIsSavingGrade(false);
    }
  };

  // Filtrage des soumissions
  const filteredSubmissions = submissions.filter((s) => {
    if (filterStatus === 'en_attente') return s.statut === 'en_attente';
    if (filterStatus === 'noté') return s.statut === 'noté';
    return true;
  });

  const pendingCount = submissions.filter((s) => s.statut === 'en_attente').length;
  const gradedCount = submissions.filter((s) => s.statut === 'noté').length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* En-tête administration institutionnel */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF4ED] text-[#C55A11] border border-[#C55A11]/30 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#C55A11]" />
              <span>Espace Réservé • Administration Pédagogique &amp; Territoriale</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4E79] tracking-tight">
              Espace Administrateur MOOC e-Communes
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Gestion des évaluations, suivi de l'ancrage territorial et préparation des conventions de parrainage municipal.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchSubmissions}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F4E79] bg-slate-100 hover:bg-slate-200 rounded transition"
              title="Rafraîchir les soumissions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Sélecteur d'onglets principaux */}
        <div className="flex border-b border-slate-200 space-x-3 mt-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('corrections')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'corrections'
                ? 'border-[#1F4E79] text-[#1F4E79]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Correction des Devoirs ({submissions.length})</span>
            {pendingCount > 0 && (
              <span className="bg-[#C55A11] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingCount} en attente
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('observatoire')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'observatoire'
                ? 'border-[#1A6B3C] text-[#1A6B3C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#1A6B3C]" />
            <span>Observatoire Territorial &amp; Parrainage</span>
            <span className="bg-emerald-100 text-[#14532D] text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-300">
              Statistiques Régionales
            </span>
          </button>
        </div>

        {/* Métriques récapitulatives (affichées en mode corrections) */}
        {activeTab === 'corrections' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
            <div className="bg-[#FDF4ED] border border-[#C55A11]/20 rounded-md p-3">
              <span className="text-xs text-[#A3480C] font-semibold block">En attente de notation</span>
              <span className="text-2xl font-extrabold text-[#C55A11]">{pendingCount}</span>
            </div>

            <div className="bg-[#F0F7F2] border border-[#1A6B3C]/20 rounded-md p-3">
              <span className="text-xs text-[#14532D] font-semibold block">Devoirs déjà notés</span>
              <span className="text-2xl font-extrabold text-[#1A6B3C]">{gradedCount}</span>
            </div>

            <div className="bg-[#F0F5FA] border border-[#1F4E79]/20 rounded-md p-3 col-span-2 sm:col-span-1">
              <span className="text-xs text-[#1F4E79] font-semibold block">Total soumissions</span>
              <span className="text-2xl font-extrabold text-[#1F4E79]">{submissions.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Onglet 2 : Observatoire Territorial */}
      {activeTab === 'observatoire' && (
        <TerritoryObservatory />
      )}

      {/* Onglet 1 : Contenu principal des corrections */}
      {activeTab === 'corrections' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Colonne Gauche : Liste des soumissions */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Filtres de tri */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrer les devoirs</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-200 p-0.5 rounded-md text-xs">
              <button
                type="button"
                onClick={() => setFilterStatus('en_attente')}
                className={`py-1 font-semibold rounded transition ${
                  filterStatus === 'en_attente'
                    ? 'bg-white text-[#C55A11] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                En attente ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('noté')}
                className={`py-1 font-semibold rounded transition ${
                  filterStatus === 'noté'
                    ? 'bg-white text-[#1A6B3C] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Notés ({gradedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('toutes')}
                className={`py-1 font-semibold rounded transition ${
                  filterStatus === 'toutes'
                    ? 'bg-white text-[#1F4E79] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous ({submissions.length})
              </button>
            </div>
          </div>

          {/* Liste des éléments */}
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-[#1F4E79] mx-auto mb-2" />
                <span>Chargement des soumissions...</span>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Aucun devoir correspondant à ce filtre.
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const isSelected = sub.id === selectedSubId;
                const isGraded = sub.statut === 'noté';

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubId(sub.id || null)}
                    className={`w-full text-left p-4 transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#F0F5FA] border-l-4 border-[#1F4E79]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {isGraded ? (
                          <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#F0F7F2] text-[#1A6B3C] border border-[#1A6B3C]/30">
                            ✓ {sub.note} pts
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FDF4ED] text-[#C55A11] border border-[#C55A11]/30">
                            En attente
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {sub.exerciceId}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800 truncate">
                        {sub.apprenantNom || 'Apprenant anonyme'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {sub.apprenantProfil || sub.apprenantEmail}
                      </p>

                      <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(sub.dateEnvoi).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-3 ${isSelected ? 'text-[#1F4E79]' : ''}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Colonne Droite : Examen du texte, Énoncé, Grille et Formulaire de notation */}
        <div className="lg:col-span-8">
          {!selectedSubmission ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Aucun devoir sélectionné</p>
              <p className="text-xs text-slate-500 mt-1">
                Sélectionnez une soumission dans la colonne de gauche pour procéder à sa correction.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Carte Récapitulative du Devoir et de l'Apprenant */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F4E79] bg-[#F0F5FA] px-2.5 py-0.5 rounded">
                      Module : {selectedSubmission.exerciceId}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1">
                      {selectedSubmission.exerciceTitre || currentExercice?.titre || 'Exercice Fil Rouge'}
                    </h2>
                  </div>

                  <div className="text-right">
                    {selectedSubmission.statut === 'noté' ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F2] text-[#14532D] border border-[#1A6B3C]/30">
                        <CheckCircle2 className="w-4 h-4 text-[#1A6B3C]" />
                        <span>Statut : Noté ({selectedSubmission.note} / {selectedSubmission.totalPointsMax || totalPointsMax})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF4ED] text-[#C55A11] border border-[#C55A11]/30">
                        <Clock className="w-4 h-4 text-[#C55A11]" />
                        <span>Statut : En attente de notation</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Profil de l'apprenant */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-[#1F4E79]" />
                    <strong className="text-slate-800">{selectedSubmission.apprenantNom}</strong>
                  </div>
                  <span>•</span>
                  <span>{selectedSubmission.apprenantEmail}</span>
                  <span>•</span>
                  <span className="font-medium text-[#1A6B3C]">{selectedSubmission.apprenantProfil}</span>
                  <span>•</span>
                  <span>Envoyé le {new Date(selectedSubmission.dateEnvoi).toLocaleString('fr-FR')}</span>
                </div>
              </div>

              {/* Énoncé de l'exercice */}
              {currentExercice && (
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-[#1F4E79]" />
                    <span>Énoncé officiel de l'exercice</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-md border border-slate-200">
                    {currentExercice.enonce}
                  </p>
                </div>
              )}

              {/* Texte rédigé par l'apprenant */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-[#1A6B3C]" />
                    <span>Texte soumis par l'apprenant</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedSubmission.texte.trim().split(/\s+/).length} mot(s)
                  </span>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line max-h-[400px] overflow-y-auto">
                  {selectedSubmission.texte}
                </div>
              </div>

              {/* Formulaire de Notation par Critères & Commentaire Administrateur */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-[#1F4E79]" />
                    <h3 className="text-base font-bold text-[#1F4E79]">
                      Grille d'Évaluation &amp; Notation
                    </h3>
                  </div>

                  {/* Note globale calculée en direct */}
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xs text-slate-500 font-medium">Total :</span>
                    <span className="text-2xl font-extrabold text-[#1A6B3C]">
                      {Math.round(computedTotalNote * 10) / 10}
                    </span>
                    <span className="text-xs text-slate-400">/ {totalPointsMax} pts</span>
                  </div>
                </div>

                {gradeSuccessMessage && (
                  <div className="mb-4 p-3.5 bg-[#F0F7F2] border border-[#1A6B3C]/30 text-[#14532D] text-xs sm:text-sm rounded-md flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#1A6B3C]" />
                    <span className="font-semibold">{gradeSuccessMessage}</span>
                  </div>
                )}

                {gradeErrorMessage && (
                  <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-md flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                    <span className="font-semibold">{gradeErrorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSaveGrade} className="space-y-6">
                  {/* Saisie par critère de la grille de notation */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Notation par critère :
                    </span>

                    {currentExercice?.grilleNotation.map((critere) => {
                      const currentVal = notesParCritere[critere.id] ?? 0;

                      return (
                        <div
                          key={critere.id}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm font-semibold text-slate-800">
                              {critere.libelle}
                            </p>
                            {critere.description && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {critere.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 self-end sm:self-auto">
                            <label
                              htmlFor={`note-${critere.id}`}
                              className="text-xs font-semibold text-slate-600"
                            >
                              Note :
                            </label>
                            <input
                              id={`note-${critere.id}`}
                              type="number"
                              min={0}
                              max={critere.pointsMax}
                              step={0.5}
                              value={currentVal}
                              onChange={(e) =>
                                handleScoreChange(critere.id, e.target.value, critere.pointsMax)
                              }
                              className="w-18 px-2.5 py-1.5 text-center text-sm font-bold bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                              required
                            />
                            <span className="text-xs font-medium text-slate-500">
                              / {critere.pointsMax} pts
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Commentaire libre du correcteur */}
                  <div>
                    <label
                      htmlFor="commentaire-admin"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Commentaire et observations pédagogiques pour l'apprenant <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="commentaire-admin"
                      rows={4}
                      required
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      placeholder="Indiquez les points forts du devoir et les axes d'amélioration opérationnelle..."
                      className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ce retour sera directement visible par l'apprenant sur sa page de cours.
                    </p>
                  </div>

                  {/* Bouton de validation */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingGrade}
                      className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-semibold rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:ring-offset-2 disabled:opacity-60"
                    >
                      {isSavingGrade ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enregistrement en cours...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Valider la note et passer le statut à "Noté"</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>

            </div>
          )}
        </div>

      </div>
      )}

    </div>
  );
};
