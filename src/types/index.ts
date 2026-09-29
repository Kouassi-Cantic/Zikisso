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
