import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  limit 
} from 'firebase/firestore';
import type { ExerciceFilRouge, SubmissionData } from '../types';
import { PeerReviewSection } from './PeerReviewSection';
import { 
  FileEdit, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Award, 
  MessageSquare, 
  Save, 
  Edit3, 
  CheckSquare2, 
  HelpCircle 
} from 'lucide-react';

interface SubmissionFormProps {
  exercice: ExerciceFilRouge;
}

const LOCAL_STORAGE_SUBMISSIONS_KEY = 'zikisso_local_submissions';

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ exercice }) => {
  const { currentUser, userData } = useAuth();
  const draftKey = `zikisso_draft_${exercice.id}_${currentUser?.uid || 'guest'}`;

  const [texte, setTexte] = useState<string>('');
  const [existingSubmission, setExistingSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  // Chargement de la soumission existante ou du brouillon
  useEffect(() => {
    let isMounted = true;
    const loadSubmission = async () => {
      if (!currentUser || !exercice.id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 1. Recherche dans Firestore si configuré
      if (isFirebaseConfigured) {
        try {
          const q = query(
            collection(db, 'submissions'),
            where('uid', '==', currentUser.uid),
            where('exerciceId', '==', exercice.id),
            limit(1)
          );
          const snap = await getDocs(q);
          if (isMounted && !snap.empty) {
            const docData = snap.docs[0];
            const data = { id: docData.id, ...(docData.data() as any) } as SubmissionData;
            setExistingSubmission(data);
            setTexte(data.texte);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Erreur récupération soumission Firestore:', err);
        }
      } else {
        // Mode secours local
        try {
          const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
          if (raw) {
            const list: SubmissionData[] = JSON.parse(raw);
            const found = list.find(
              (s) => s.uid === currentUser.uid && s.exerciceId === exercice.id
            );
            if (isMounted && found) {
              setExistingSubmission(found);
              setTexte(found.texte);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Erreur lecture soumission locale:', e);
        }
      }

      // Si aucune soumission enregistrée, vérifier s'il existe un brouillon local non envoyé
      try {
        const savedDraft = localStorage.getItem(draftKey);
        if (isMounted && savedDraft) {
          setTexte(savedDraft);
        }
      } catch (e) {
        // Silencieux
      }

      if (isMounted) setLoading(false);
    };

    loadSubmission();
    return () => {
      isMounted = false;
    };
  }, [currentUser, exercice.id, draftKey]);

  // Sauvegarde automatique du brouillon lors de la frappe pour éviter toute perte de données
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTexte(val);
    try {
      localStorage.setItem(draftKey, val);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    } catch (err) {
      console.warn('Erreur sauvegarde brouillon local:', err);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanText = texte.trim();
    if (!cleanText) {
      setErrorMessage('Le texte de votre devoir ne peut pas être vide.');
      return;
    }
    if (cleanText.length < 50) {
      setErrorMessage('Veuillez développer votre réflexion (au moins 50 caractères requis pour l’évaluation).');
      return;
    }

    if (!currentUser) {
      setErrorMessage('Veuillez vous reconnecter pour soumettre votre devoir.');
      return;
    }

    setIsSubmitting(true);

    const nowIso = new Date().toISOString();

    const submissionPayload: SubmissionData = {
      uid: currentUser.uid,
      userId: currentUser.uid,
      apprenantNom: userData?.nom || currentUser.displayName || currentUser.email || 'Apprenant',
      apprenantEmail: currentUser.email || '',
      apprenantProfil: userData?.profil,
      exerciceId: exercice.id,
      exerciceTitre: exercice.titre,
      texte: cleanText,
      statut: 'en_attente',
      dateEnvoi: nowIso,
    };

    if (isFirebaseConfigured) {
      try {
        if (existingSubmission && existingSubmission.id) {
          // Mise à jour de la soumission existante
          const docRef = doc(db, 'submissions', existingSubmission.id);
          await updateDoc(docRef, {
            texte: cleanText,
            statut: 'en_attente',
            dateEnvoi: nowIso,
            updatedAt: serverTimestamp(),
          });
          setExistingSubmission({
            ...existingSubmission,
            texte: cleanText,
            statut: 'en_attente',
            dateEnvoi: nowIso,
          });
        } else {
          // Nouvelle soumission
          const docRef = await addDoc(collection(db, 'submissions'), {
            ...submissionPayload,
            createdAt: serverTimestamp(),
          });
          setExistingSubmission({
            ...submissionPayload,
            id: docRef.id,
          });
        }

        // Nettoyage du brouillon local
        localStorage.removeItem(draftKey);
        setSuccessMessage('Votre devoir a été transmis avec succès à l’équipe pédagogique !');
        setIsEditing(false);
      } catch (err: any) {
        console.error('Erreur enregistrement soumission Firestore:', err);
        let msg = 'Une erreur est survenue lors de l’enregistrement sur le serveur.';
        if (err?.code === 'permission-denied') {
          msg = 'Accès non autorisé ou session expirée. Veuillez vous reconnecter.';
        } else if (err?.code === 'unavailable') {
          msg = 'Réseau momentanément indisponible. Votre saisie reste conservée dans ce formulaire.';
        }
        setErrorMessage(msg);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Mode simulation secours local
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
        let list: SubmissionData[] = raw ? JSON.parse(raw) : [];
        const newRecord: SubmissionData = {
          ...submissionPayload,
          id: existingSubmission?.id || 'sub_' + Date.now(),
        };
        list = list.filter(
          (s) => !(s.uid === currentUser.uid && s.exerciceId === exercice.id)
        );
        list.push(newRecord);
        localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(list));
        localStorage.removeItem(draftKey);
        setExistingSubmission(newRecord);
        setSuccessMessage('Votre devoir a été enregistré avec succès en mode local !');
        setIsEditing(false);
      } catch (e) {
        console.warn('Erreur stockage local soumission:', e);
      }
      setIsSubmitting(false);
    }
  };

  const wordCount = texte.trim() ? texte.trim().split(/\s+/).length : 0;
  const totalPointsMax = exercice.grilleNotation.reduce((acc, c) => acc + c.pointsMax, 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      
      {/* En-tête de l'exercice */}
      <div className="bg-[#F0F5FA] border-b border-[#1F4E79]/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold bg-[#1F4E79] text-white">
            <FileEdit className="w-3.5 h-3.5" />
            <span>Exercice Fil Rouge</span>
          </span>

          {/* Statut de la soumission de l'apprenant */}
          {existingSubmission && (
            <div className="flex items-center space-x-2">
              {existingSubmission.statut === 'noté' ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F2] text-[#14532D] border border-[#1A6B3C]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#1A6B3C]" />
                  <span>Noté : {existingSubmission.note} / {existingSubmission.totalPointsMax || totalPointsMax}</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF4ED] text-[#C55A11] border border-[#C55A11]/30">
                  <Clock className="w-4 h-4 text-[#C55A11]" />
                  <span>En attente de correction</span>
                </span>
              )}
            </div>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#1F4E79]">
          {exercice.titre}
        </h3>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Énoncé complet de l'exercice */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-[#1F4E79]" />
            <span>Énoncé officiel du travail à rendre</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
            {exercice.enonce}
          </p>

          {exercice.consignes && exercice.consignes.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Consignes méthodologiques :
              </span>
              <ul className="space-y-1">
                {exercice.consignes.map((c, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start space-x-2">
                    <span className="text-[#1A6B3C] font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Grille de notation officielle associée */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider flex items-center space-x-1.5">
              <CheckSquare2 className="w-4 h-4 text-[#1A6B3C]" />
              <span>Grille de notation et barème (Total : {totalPointsMax} points)</span>
            </h4>
          </div>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {exercice.grilleNotation.map((critere) => (
              <div key={critere.id} className="py-2.5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{critere.libelle}</p>
                  {critere.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{critere.description}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-block px-2 py-0.5 bg-[#F0F5FA] text-[#1F4E79] font-bold text-xs rounded border border-[#1F4E79]/20">
                    Max : {critere.pointsMax} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retour de correction de l'administrateur si le devoir est déjà noté */}
        {existingSubmission?.statut === 'noté' && (
          <div className="bg-[#F0F7F2] border-2 border-[#1A6B3C] rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-[#14532D] font-bold text-base mb-3">
              <Award className="w-5 h-5 text-[#1A6B3C]" />
              <h4>Évaluation et commentaires du correcteur</h4>
            </div>

            <div className="mb-4 p-4 bg-white rounded-md border border-[#1A6B3C]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Note finale attribuée
                </span>
                <span className="text-3xl font-extrabold text-[#1A6B3C]">
                  {existingSubmission.note}
                </span>{' '}
                <span className="text-slate-500 text-lg">/ {existingSubmission.totalPointsMax || totalPointsMax}</span>
              </div>

              {existingSubmission.dateCorrection && (
                <div className="text-xs text-slate-500 sm:text-right">
                  Évalué le{' '}
                  {new Date(existingSubmission.dateCorrection).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              )}
            </div>

            {/* Détail par critère */}
            {existingSubmission.notesParCritere && (
              <div className="mb-4 bg-white/80 rounded-md p-3.5 border border-[#1A6B3C]/20 text-xs">
                <span className="font-bold text-[#14532D] block mb-2">Détail des points par critère :</span>
                <div className="space-y-1.5">
                  {exercice.grilleNotation.map((c) => {
                    const noteObtenue = existingSubmission.notesParCritere?.[c.id] ?? 0;
                    return (
                      <div key={c.id} className="flex justify-between items-center text-slate-700">
                        <span>{c.libelle}</span>
                        <strong className="text-[#1A6B3C]">{noteObtenue} / {c.pointsMax} pts</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Commentaire de l'administrateur */}
            {existingSubmission.commentaire && (
              <div className="bg-white rounded-md p-4 border border-[#1A6B3C]/30">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1F4E79] uppercase tracking-wider mb-1.5">
                  <MessageSquare className="w-4 h-4 text-[#1F4E79]" />
                  <span>Observations &amp; Recommandations personnalisées</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed italic">
                  « {existingSubmission.commentaire} »
                </p>
              </div>
            )}
          </div>
        )}

        {/* Message d'erreur ou succès */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-md flex items-start space-x-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="p-3.5 bg-[#F0F7F2] border border-[#1A6B3C]/30 text-[#14532D] text-xs sm:text-sm rounded-md flex items-start space-x-2"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#1A6B3C] mt-0.5" />
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* Zone de saisie / Consultation du texte soumis */}
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#1F4E79] mx-auto mb-2" />
            <span className="text-xs text-slate-500">Chargement de votre devoir...</span>
          </div>
        ) : existingSubmission && !isEditing ? (
          /* Affichage du devoir soumis en lecture seule */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Votre texte soumis ({wordCount} mots)
              </span>
              <span className="text-xs text-slate-500">
                Envoyé le{' '}
                {new Date(existingSubmission.dateEnvoi).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {existingSubmission.texte}
            </div>

            {existingSubmission.statut === 'en_attente' && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-500">
                  Votre devoir est en attente d'évaluation par l'administrateur.
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F4E79] hover:text-white border border-[#1F4E79] hover:bg-[#1F4E79] rounded transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modifier mon texte</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Formulaire actif de rédaction */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`textarea-${exercice.id}`}
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                Espace de rédaction de votre devoir <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center space-x-2 text-xs text-slate-500">
                {draftSaved && (
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <Save className="w-3.5 h-3.5" />
                    <span>Brouillon sauvegardé</span>
                  </span>
                )}
                <span>{wordCount} mot(s)</span>
              </div>
            </div>

            <textarea
              id={`textarea-${exercice.id}`}
              rows={12}
              required
              value={texte}
              onChange={handleTextChange}
              placeholder="Rédigez ici votre réflexion argumentée en répondant aux consignes..."
              className="w-full p-4 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:border-transparent transition leading-relaxed"
              disabled={isSubmitting}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-slate-500">
                Vos saisies sont automatiquement mémorisées localement en cas d'interruption réseau.
              </p>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setTexte(existingSubmission?.texte || '');
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded border border-slate-300 hover:bg-slate-50 transition"
                  >
                    Annuler
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1A6B3C] hover:bg-[#14532D] text-white text-xs sm:text-sm font-semibold rounded-md shadow transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] focus:ring-offset-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi en cours vers Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{existingSubmission ? 'Mettre à jour ma soumission' : 'Soumettre mon devoir'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

      </div>

      {/* Section Évaluation par les Pairs (Peer-Reviewing pédagogique collaboratif) */}
      <PeerReviewSection
        exercice={exercice}
        userSubmission={existingSubmission}
      />
    </div>
  );
};
