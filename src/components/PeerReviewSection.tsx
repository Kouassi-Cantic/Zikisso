import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  doc, 
  updateDoc, 
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import type { ExerciceFilRouge, SubmissionData, PeerReview } from '../types';
import { 
  Users, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  FileText
} from 'lucide-react';

interface PeerReviewSectionProps {
  exercice: ExerciceFilRouge;
  userSubmission: SubmissionData | null;
}

const LOCAL_STORAGE_PEER_REVIEWS_KEY = 'zikisso_local_peer_reviews';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'zikisso_local_submissions';

export const PeerReviewSection: React.FC<PeerReviewSectionProps> = ({ exercice, userSubmission }) => {
  const { currentUser, userData } = useAuth();

  const [submissionsToReview, setSubmissionsToReview] = useState<SubmissionData[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [completedReviews, setCompletedReviews] = useState<PeerReview[]>([]);
  const [reviewsReceived, setReviewsReceived] = useState<PeerReview[]>([]);

  // Formulaire d'évaluation
  const [notes, setNotes] = useState<Record<string, number>>({});
  const [commentaire, setCommentaire] = useState('');
  const [pointsForts, setPointsForts] = useState('');
  const [axesAmelioration, setAxesAmelioration] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialisation des notes par défaut
  useEffect(() => {
    if (exercice.grilleNotation) {
      const initial: Record<string, number> = {};
      exercice.grilleNotation.forEach((c) => {
        initial[c.id] = Math.round(c.pointsMax * 0.8);
      });
      setNotes(initial);
    }
  }, [exercice]);

  // Chargement des données
  const loadPeerReviewData = async () => {
    if (!currentUser) return;
    setLoading(true);

    if (isFirebaseConfigured) {
      try {
        // 1. Avis émis par l'utilisateur connecté pour cet exercice
        const qMyReviews = query(
          collection(db, 'peerReviews'),
          where('reviewerUid', '==', currentUser.uid),
          where('exerciceId', '==', exercice.id)
        );
        const snapMyReviews = await getDocs(qMyReviews);
        const myReviewsList: PeerReview[] = snapMyReviews.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setCompletedReviews(myReviewsList);

        // 2. Avis reçus sur mon propre travail
        if (userSubmission?.id) {
          const qReceived = query(
            collection(db, 'peerReviews'),
            where('submissionId', '==', userSubmission.id)
          );
          const snapReceived = await getDocs(qReceived);
          const receivedList: PeerReview[] = snapReceived.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));
          setReviewsReceived(receivedList);
        }

        // 3. Soumissions disponibles à relire (hors mon propre travail)
        const reviewedSubIds = new Set(myReviewsList.map((r) => r.submissionId));
        const qSubs = query(
          collection(db, 'submissions'),
          where('exerciceId', '==', exercice.id)
        );
        const snapSubs = await getDocs(qSubs);
        const available: SubmissionData[] = [];
        snapSubs.forEach((d) => {
          const sub = { id: d.id, ...(d.data() as any) } as SubmissionData;
          // Ne pas s'évaluer soi-même, et ne pas réévaluer un devoir déjà noté par soi
          if (sub.uid !== currentUser.uid && !reviewedSubIds.has(sub.id!)) {
            available.push(sub);
          }
        });
        setSubmissionsToReview(available);
        if (available.length > 0 && !selectedSubmission) {
          setSelectedSubmission(available[0]);
        }
      } catch (err) {
        console.error('Erreur chargement peer reviews:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Mode simulation local
      try {
        const rawReviews = localStorage.getItem(LOCAL_STORAGE_PEER_REVIEWS_KEY);
        const allReviews: PeerReview[] = rawReviews ? JSON.parse(rawReviews) : [];
        const myReviews = allReviews.filter(
          (r) => r.reviewerUid === currentUser.uid && r.exerciceId === exercice.id
        );
        setCompletedReviews(myReviews);

        if (userSubmission?.id) {
          const received = allReviews.filter((r) => r.submissionId === userSubmission.id);
          setReviewsReceived(received);
        }

        const reviewedSubIds = new Set(myReviews.map((r) => r.submissionId));
        const rawSubs = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
        const allSubs: SubmissionData[] = rawSubs ? JSON.parse(rawSubs) : [];
        const available = allSubs.filter(
          (s) => s.exerciceId === exercice.id && s.uid !== currentUser.uid && !reviewedSubIds.has(s.id!)
        );
        setSubmissionsToReview(available);
        if (available.length > 0 && !selectedSubmission) {
          setSelectedSubmission(available[0]);
        }
      } catch (e) {}
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeerReviewData();
  }, [currentUser, exercice.id, userSubmission?.id]);

  const computedTotal = exercice.grilleNotation.reduce(
    (acc, c) => acc + (notes[c.id] || 0),
    0
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !currentUser) return;
    if (!commentaire.trim()) {
      setErrorMessage("Veuillez rédiger une appréciation constructive pour votre pair.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const reviewPayload: PeerReview = {
        submissionId: selectedSubmission.id!,
        exerciceId: exercice.id,
        reviewerUid: currentUser.uid,
        reviewerNom: userData?.nom || currentUser.displayName || 'Pair évaluateur',
        notesParCritere: notes,
        totalNote: computedTotal,
        commentaire: commentaire.trim(),
        pointsForts: pointsForts.trim(),
        axesAmelioration: axesAmelioration.trim(),
        dateEvaluation: new Date().toISOString(),
      };

      if (isFirebaseConfigured) {
        await addDoc(collection(db, 'peerReviews'), {
          ...reviewPayload,
          createdAt: serverTimestamp(),
        });

        // Incrémentation du compteur de revues sur la soumission
        const subRef = doc(db, 'submissions', selectedSubmission.id!);
        await updateDoc(subRef, {
          peerReviewsCount: increment(1),
          updatedAt: serverTimestamp(),
        });
      } else {
        const raw = localStorage.getItem(LOCAL_STORAGE_PEER_REVIEWS_KEY);
        const list: PeerReview[] = raw ? JSON.parse(raw) : [];
        list.push({ ...reviewPayload, id: 'review_' + Date.now() });
        localStorage.setItem(LOCAL_STORAGE_PEER_REVIEWS_KEY, JSON.stringify(list));
      }

      setSuccessMessage("Votre évaluation par les pairs a été transmise avec succès ! Merci pour votre contribution collaborative.");
      setCommentaire('');
      setPointsForts('');
      setAxesAmelioration('');
      await loadPeerReviewData();
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur lors de l'envoi de votre évaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-1.5">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Apprentissage Collaboratif • Peer Learning</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1F4E79]">
            Évaluation par les Pairs (Notation croisée)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-3xl">
            Lisez anonymement le devoir d’un collègue élu ou agent communal d'une autre localité et attribuez-lui des retours constructifs basés sur la grille officielle.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
            Évaluations données : <strong>{completedReviews.length}</strong>
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
            Avis reçus : <strong>{reviewsReceived.length}</strong>
          </span>
        </div>
      </div>

      {/* Condition préalable : avoir soi-même soumis son travail */}
      {!userSubmission ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3 text-xs sm:text-sm text-blue-900">
          <HelpCircle className="w-5 h-5 text-[#1F4E79] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Condition pédagogique :</span> Pour participer à l’évaluation par les pairs et relire les travaux de vos collègues, veuillez d’abord soumettre votre propre exercice fil rouge ci-dessus.
          </div>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Section 1 : Retours et avis reçus sur mon travail */}
          {reviewsReceived.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#F0F7F2] border border-[#1A6B3C]/30 rounded-lg space-y-3">
              <div className="flex items-center space-x-2 text-[#1A6B3C] font-bold text-sm">
                <ThumbsUp className="w-4 h-4" />
                <h4>Avis et Conseils constructifs reçus de vos pairs ({reviewsReceived.length})</h4>
              </div>
              <div className="space-y-3">
                {reviewsReceived.map((rev, idx) => (
                  <div key={rev.id || idx} className="p-3 bg-white rounded border border-emerald-200 text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Pair évaluateur #{idx + 1}</span>
                      <span className="font-bold text-[#1A6B3C] bg-emerald-50 px-2 py-0.5 rounded">
                        Note attribuée : {rev.totalNote} / 20
                      </span>
                    </div>
                    <p className="text-slate-700 italic">« {rev.commentaire} »</p>
                    {rev.pointsForts && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded">
                        <strong>Points forts remarqués :</strong> {rev.pointsForts}
                      </div>
                    )}
                    {rev.axesAmelioration && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded">
                        <strong>Axe d'amélioration suggéré :</strong> {rev.axesAmelioration}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2 : Devoirs disponibles pour notation */}
          {loading ? (
            <div className="p-6 text-center text-slate-500 text-xs sm:text-sm flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#1F4E79]" />
              <span>Chargement des devoirs disponibles...</span>
            </div>
          ) : submissionsToReview.length === 0 ? (
            <div className="p-5 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <p className="font-semibold text-slate-800">Aucun nouveau devoir en attente de relecture pour le moment.</p>
              <p className="text-xs text-slate-500">
                Vous avez relu tous les devoirs disponibles ou aucun autre apprenant n'a encore transmis sa copie sur cette semaine.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sélectionner un travail d'apprenant à évaluer :
                </label>
                <span className="text-xs text-slate-500">
                  {submissionsToReview.length} copie(s) disponible(s)
                </span>
              </div>

              {/* Sélecteur de copie */}
              <div className="flex flex-wrap gap-2">
                {submissionsToReview.map((sub, idx) => {
                  const isSelected = selectedSubmission?.id === sub.id;
                  return (
                    <button
                      key={sub.id || idx}
                      type="button"
                      onClick={() => setSelectedSubmission(sub)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition flex items-center space-x-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1F4E79] text-white border-[#1F4E79] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Copie Anonyme #{idx + 1}</span>
                      {sub.apprenantProfil && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          ({sub.apprenantProfil})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Affichage de la copie sélectionnée */}
              {selectedSubmission && (
                <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-200 pb-2">
                    <span className="font-bold text-[#1F4E79]">
                      Travail soumis par un collègue apprenant (Anonymisé)
                    </span>
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                        📍 {selectedSubmission.apprenantCommune ? `Commune de ${selectedSubmission.apprenantCommune}` : 'Commune territoriale'}
                        {selectedSubmission.apprenantRegion && ` (${selectedSubmission.apprenantRegion})`}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap font-serif leading-relaxed bg-white p-4 rounded border border-slate-200 max-h-72 overflow-y-auto">
                    {selectedSubmission.texte}
                  </div>

                  {/* Formulaire de notation par critères */}
                  <form onSubmit={handleSubmitReview} className="space-y-4 pt-3 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Grille de notation et Appréciation constructive
                    </h4>

                    {successMessage && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{successMessage}</span>
                      </div>
                    )}

                    {errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {exercice.grilleNotation.map((c) => (
                        <div key={c.id} className="p-3 bg-white rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-xs">
                            <span className="font-semibold text-slate-800">{c.libelle}</span>
                            {c.description && <p className="text-[11px] text-slate-500">{c.description}</p>}
                          </div>
                          <div className="flex items-center space-x-2 self-end sm:self-auto">
                            <input
                              type="number"
                              min={0}
                              max={c.pointsMax}
                              step={0.5}
                              value={notes[c.id] ?? 0}
                              onChange={(e) =>
                                setNotes({
                                  ...notes,
                                  [c.id]: Math.min(c.pointsMax, Math.max(0, parseFloat(e.target.value) || 0)),
                                })
                              }
                              className="w-16 px-2 py-1 text-xs border border-slate-300 rounded text-center font-bold"
                            />
                            <span className="text-xs text-slate-500 font-medium">/ {c.pointsMax} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between bg-blue-50/80 px-3 py-2 rounded text-xs font-bold text-[#1F4E79]">
                      <span>Note globale attribuée :</span>
                      <span className="text-sm font-extrabold text-[#C55A11]">{computedTotal} / 20</span>
                    </div>

                    {/* Commentaires constructifs */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Commentaire d'évaluation bienveillant et constructif <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        placeholder="Expliquez ce qui est réussi et donnez des conseils pour améliorer la mise en œuvre pratique dans sa commune..."
                        className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-emerald-800 mb-1">
                          Points forts du devoir
                        </label>
                        <input
                          type="text"
                          value={pointsForts}
                          onChange={(e) => setPointsForts(e.target.value)}
                          placeholder="Ex. Excellente prise en compte des citoyens..."
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-amber-800 mb-1">
                          Axe d'amélioration prioritaire
                        </label>
                        <input
                          type="text"
                          value={axesAmelioration}
                          onChange={(e) => setAxesAmelioration(e.target.value)}
                          placeholder="Ex. Préciser le budget ou le calendrier d'exécution..."
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-[#1A6B3C] hover:bg-[#14532D] rounded-md shadow-xs transition disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Transmission de la notation...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Valider l'évaluation de mon pair</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
