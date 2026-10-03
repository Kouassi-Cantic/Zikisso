import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import type { NewsletterSubscriber, NewsletterCampaign } from '../types';

export const LOCAL_STORAGE_NEWSLETTER_KEY = 'zikisso_local_newsletter_subscribers';
export const LOCAL_STORAGE_CAMPAIGNS_KEY = 'zikisso_local_newsletter_campaigns';

// Abonnés d'amorce réalistes
export const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'sg.mairie@zikisso.ci',
    dateInscription: '2026-09-15T09:30:00.000Z',
    source: 'Pied de page portail',
    statut: 'actif',
    commune: 'Zikisso',
    region: 'Lôh-Djiboua',
    nom: 'Secrétaire Général Mairie de Zikisso'
  },
  {
    id: 'sub-2',
    email: 'koffi.dgddl@interieur.gouv.ci',
    dateInscription: '2026-09-18T14:15:00.000Z',
    source: 'Console de veille',
    statut: 'actif',
    commune: 'Plateau',
    region: 'District Autonome d\'Abidjan',
    nom: 'Cadre DGDDL'
  },
  {
    id: 'sub-3',
    email: 'contact@cjam-zikisso.org',
    dateInscription: '2026-09-22T11:00:00.000Z',
    source: 'Pied de page portail',
    statut: 'actif',
    commune: 'Zikisso',
    region: 'Lôh-Djiboua',
    nom: 'Coordination Jeunesse Zikisso'
  },
  {
    id: 'sub-4',
    email: 'direction.technique@bouake.ci',
    dateInscription: '2026-09-25T16:40:00.000Z',
    source: 'Pied de page portail',
    statut: 'actif',
    commune: 'Bouaké',
    region: 'Gbêkê',
    nom: 'Direction Services Techniques Bouaké'
  },
  {
    id: 'sub-5',
    email: 'observateur.citoyen@gmail.com',
    dateInscription: '2026-09-29T10:20:00.000Z',
    source: 'Pied de page portail',
    statut: 'actif',
    commune: 'Lakota',
    region: 'Lôh-Djiboua',
    nom: 'Auditeur Veille Citoyenne'
  }
];

// Campagnes d'amorce
export const DEFAULT_CAMPAIGNS: NewsletterCampaign[] = [
  {
    id: 'camp-1',
    sujet: 'Note de Veille #01 : Déploiement des Guichets Uniques et ONECI dans les communes ivoiriennes',
    contenu: 'Chères actrices et chers acteurs communaux, retrouvez notre synthèse hebdomadaire sur l\'accélération de la numérisation des registres d\'état civil et le rôle des receveurs municipaux.',
    cibleCommune: 'toutes',
    destinatairesCount: 5,
    dateEnvoi: '2026-09-26T08:00:00.000Z',
    statut: 'envoyé',
    auteurNom: 'Kouassi Ouréga Goblé'
  }
];

/**
 * Récupère la liste des abonnés newsletter
 */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  if (isFirebaseConfigured) {
    try {
      const q = collection(db, 'newsletterSubscribers');
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NewsletterSubscriber));
      }
    } catch (err) {
      console.warn("Lecture Firestore newsletter, passage en local:", err);
    }
  }

  // Fallback LocalStorage
  const raw = localStorage.getItem(LOCAL_STORAGE_NEWSLETTER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Ignorer
    }
  }

  // Initialisation par défaut
  localStorage.setItem(LOCAL_STORAGE_NEWSLETTER_KEY, JSON.stringify(DEFAULT_SUBSCRIBERS));
  return DEFAULT_SUBSCRIBERS;
}

/**
 * Enregistre un nouvel abonné newsletter
 */
export async function subscribeToNewsletter(email: string, meta?: { commune?: string; region?: string; nom?: string; source?: string }): Promise<{ success: boolean; message: string; isNew: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, message: 'Veuillez saisir une adresse email valide.', isNew: false };
  }

  // Vérifier doublon en ligne ou local
  const currentSubscribers = await getNewsletterSubscribers();
  const exists = currentSubscribers.find((s) => s.email.toLowerCase() === cleanEmail);

  if (exists) {
    if (exists.statut === 'désabonné') {
      // Réactiver
      await updateSubscriberStatus(exists.id || '', 'actif');
      return { success: true, message: 'Votre réabonnement à la lettre d\'information a bien été pris en compte !', isNew: false };
    }
    return { success: true, message: 'Vous êtes déjà inscrit(e) à la veille et lettre d\'information du MOOC e-Communes.', isNew: false };
  }

  const newSub: NewsletterSubscriber = {
    email: cleanEmail,
    dateInscription: new Date().toISOString(),
    source: meta?.source || 'Pied de page portail',
    statut: 'actif',
    commune: meta?.commune || 'Non renseignée',
    region: meta?.region || 'Côte d’Ivoire',
    nom: meta?.nom || ''
  };

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'newsletterSubscribers'), {
        ...newSub,
        createdAt: serverTimestamp()
      });
      newSub.id = docRef.id;
    } catch (err) {
      console.warn("Enregistrement Firestore newsletter échoué, stockage local:", err);
      newSub.id = 'sub-' + Date.now();
    }
  } else {
    newSub.id = 'sub-' + Date.now();
  }

  // Mettre à jour cache local
  const updated = [newSub, ...currentSubscribers];
  localStorage.setItem(LOCAL_STORAGE_NEWSLETTER_KEY, JSON.stringify(updated));

  return { 
    success: true, 
    message: 'Merci ! Votre inscription à la veille stratégique du MOOC e-Communes est confirmée.', 
    isNew: true 
  };
}

/**
 * Met à jour le statut d'un abonné (actif / désabonné)
 */
export async function updateSubscriberStatus(id: string, statut: 'actif' | 'désabonné'): Promise<boolean> {
  if (isFirebaseConfigured && id && !id.startsWith('sub-')) {
    try {
      await updateDoc(doc(db, 'newsletterSubscribers', id), { statut });
    } catch (err) {
      console.warn("Erreur mise à jour statut Firestore:", err);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_NEWSLETTER_KEY);
  if (raw) {
    try {
      const list: NewsletterSubscriber[] = JSON.parse(raw);
      const updated = list.map((s) => s.id === id ? { ...s, statut } : s);
      localStorage.setItem(LOCAL_STORAGE_NEWSLETTER_KEY, JSON.stringify(updated));
    } catch {
      // Ignorer
    }
  }
  return true;
}

/**
 * Supprime un abonné
 */
export async function deleteSubscriber(id: string): Promise<boolean> {
  if (isFirebaseConfigured && id && !id.startsWith('sub-')) {
    try {
      await deleteDoc(doc(db, 'newsletterSubscribers', id));
    } catch (err) {
      console.warn("Erreur suppression Firestore:", err);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_NEWSLETTER_KEY);
  if (raw) {
    try {
      const list: NewsletterSubscriber[] = JSON.parse(raw);
      const updated = list.filter((s) => s.id !== id);
      localStorage.setItem(LOCAL_STORAGE_NEWSLETTER_KEY, JSON.stringify(updated));
    } catch {
      // Ignorer
    }
  }
  return true;
}

/**
 * Récupère les campagnes envoyées
 */
export async function getNewsletterCampaigns(): Promise<NewsletterCampaign[]> {
  if (isFirebaseConfigured) {
    try {
      const q = collection(db, 'newsletterCampaigns');
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NewsletterCampaign));
      }
    } catch (err) {
      console.warn("Lecture Firestore campagnes:", err);
    }
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_CAMPAIGNS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Ignorer
    }
  }

  localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(DEFAULT_CAMPAIGNS));
  return DEFAULT_CAMPAIGNS;
}

/**
 * Enregistre une campagne diffusée
 */
export async function sendNewsletterCampaign(campaign: Omit<NewsletterCampaign, 'id' | 'dateEnvoi'>): Promise<NewsletterCampaign> {
  const newCamp: NewsletterCampaign = {
    ...campaign,
    id: 'camp-' + Date.now(),
    dateEnvoi: new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'newsletterCampaigns'), {
        ...newCamp,
        createdAt: serverTimestamp()
      });
      newCamp.id = docRef.id;
    } catch (err) {
      console.warn("Enregistrement Firestore campagne échoué:", err);
    }
  }

  const list = await getNewsletterCampaigns();
  const updated = [newCamp, ...list];
  localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updated));

  return newCamp;
}
