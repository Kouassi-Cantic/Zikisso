export type UserProfileType = 
  | 'Conseiller municipal élu'
  | 'Agent technique de mairie'
  | 'Citoyen engagé';

export type UserRole = 'apprenant' | 'admin';

export interface UserData {
  uid: string;
  nom: string;
  email: string;
  profil: UserProfileType;
  role: UserRole;
  commune?: string;
  region?: string;
  photoUrl?: string;
  photoLieuEmblematiqueUrl?: string;
  lieuEmblematiqueNom?: string;
  lieuEmblematiqueDescription?: string;
  createdAt?: string | number | null;
}

export interface Capsule {
  id: string;
  title: string;
  content: string;
}

export interface QuizQuestion {
  id?: string | number;
  question: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2 ou 3
  explanation?: string;
}

export interface QuizAttempt {
  id?: string;
  uid: string;
  userId?: string;
  quizId: string;
  score: number;
  totalQuestions?: number;
  date: string;
  reponses: Record<number, number>; // QuestionIndex -> OptionIndex choisie
  createdAt?: any;
}

export interface NotationCritere {
  id: string;
  libelle: string;
  pointsMax: number;
  description?: string;
}

export interface ExerciceFilRouge {
  id: string;
  titre: string;
  enonce: string;
  consignes?: string[];
  grilleNotation: NotationCritere[];
}

export interface SubmissionData {
  id?: string;
  uid: string;
  userId?: string;
  apprenantNom?: string;
  apprenantEmail?: string;
  apprenantProfil?: UserProfileType;
  apprenantCommune?: string;
  apprenantRegion?: string;
  exerciceId: string;
  exerciceTitre?: string;
  texte: string;
  statut: 'en_attente' | 'noté';
  dateEnvoi: string;
  note?: number;
  totalPointsMax?: number;
  notesParCritere?: Record<string, number>;
  commentaire?: string;
  dateCorrection?: string;
  correcteurNom?: string;
  peerReviewsCount?: number;
  createdAt?: any;
}

export interface PeerReview {
  id?: string;
  submissionId: string;
  exerciceId: string;
  reviewerUid: string;
  reviewerNom: string;
  notesParCritere: Record<string, number>;
  totalNote: number;
  commentaire: string;
  pointsForts?: string;
  axesAmelioration?: string;
  dateEvaluation: string;
  createdAt?: any;
}

export interface WeekData {
  id: string;
  ordre: number;
  titre: string;
  objectifs: string[] | string;
  capsules: Capsule[];
  exercice?: ExerciceFilRouge | any;
  quiz?: QuizQuestion[];
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  dateInscription: string;
  source?: string;
  statut: 'actif' | 'désabonné';
  commune?: string;
  region?: string;
  nom?: string;
  createdAt?: any;
}

export interface NewsletterCampaign {
  id?: string;
  sujet: string;
  contenu: string;
  cibleCommune?: string; // 'toutes' ou nom de commune
  destinatairesCount: number;
  dateEnvoi: string;
  statut: 'envoyé' | 'brouillon';
  auteurNom?: string;
  createdAt?: any;
}
