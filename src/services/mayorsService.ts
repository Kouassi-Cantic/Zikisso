import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  CUSTOM_MAYORS_MESSAGES, 
  generateDefaultMayorMessage, 
  type MayorMessageData 
} from '../data/mayorsMessages';
import { findTerritoryByCommune } from '../data/territories';

const LOCAL_STORAGE_MAYORS_KEY = 'zikisso_custom_mayors_messages';

/**
 * Récupère le message du Maire pour une commune donnée.
 * 1. Vérifie Firestore collection "mayors_messages" si configuré
 * 2. Vérifie le cache local (localStorage)
 * 3. Vérifie les fiches préconfigurées CUSTOM_MAYORS_MESSAGES
 * 4. Génère dynamiquement le message officiel modèle pour cette commune
 */
export const getMayorMessageForCommune = async (communeName: string): Promise<MayorMessageData> => {
  const territory = findTerritoryByCommune(communeName);
  const region = territory ? territory.region : 'Territoire national';

  // 1. Firestore
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'mayors_messages', communeName);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as MayorMessageData;
      }
    } catch (e) {
      console.warn('Erreur lecture message maire Firestore:', e);
    }
  }

  // 2. Cache local (modifications administrateur hors ligne)
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MAYORS_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Record<string, MayorMessageData>;
      if (stored[communeName]) {
        return stored[communeName];
      }
    }
  } catch (e) {}

  // 3. Fiches prédéfinies
  if (CUSTOM_MAYORS_MESSAGES[communeName]) {
    return CUSTOM_MAYORS_MESSAGES[communeName];
  }

  // 4. Modèle officiel par défaut
  return generateDefaultMayorMessage(communeName, region);
};

/**
 * Sauvegarde ou personnalise le message officiel d'un Maire pour une commune.
 * Utilisable par l'administrateur dans l'espace d'administration ou lors de partenariats municipaux.
 */
export const saveMayorMessage = async (
  communeName: string,
  data: Partial<MayorMessageData>,
  editorEmail?: string
): Promise<MayorMessageData> => {
  const current = await getMayorMessageForCommune(communeName);
  const updated: MayorMessageData = {
    ...current,
    ...data,
    commune: communeName,
    dateMiseAJour: new Date().toISOString(),
    misAJourPar: editorEmail || 'Administrateur',
  };

  // 1. Sauvegarde Firestore
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'mayors_messages', communeName);
      await setDoc(docRef, { ...updated, updatedAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      console.error('Erreur sauvegarde message maire Firestore:', e);
      throw e;
    }
  }

  // 2. Sauvegarde locale
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MAYORS_KEY);
    const stored = raw ? (JSON.parse(raw) as Record<string, MayorMessageData>) : {};
    stored[communeName] = updated;
    localStorage.setItem(LOCAL_STORAGE_MAYORS_KEY, JSON.stringify(stored));
  } catch (e) {
    console.warn('Erreur sauvegarde locale message maire:', e);
  }

  return updated;
};
