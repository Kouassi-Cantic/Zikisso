import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FooterConfig, DEFAULT_FOOTER_CONFIG } from '../data/defaultFooterConfig';

export const LOCAL_STORAGE_FOOTER_KEY = 'zikisso_footer_config';
export const FOOTER_CONFIG_UPDATED_EVENT = 'zikisso_footer_config_updated';

/**
 * Charge la configuration du pied de page (Firestore avec repli LocalStorage)
 */
export async function getFooterConfig(): Promise<FooterConfig> {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'siteSettings', 'footerConfig');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<FooterConfig>;
        const merged = { ...DEFAULT_FOOTER_CONFIG, ...data };
        localStorage.setItem(LOCAL_STORAGE_FOOTER_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('Lecture Firestore footerConfig échouée, passage au cache local:', err);
    }
  }

  // Lecture dans le cache LocalStorage
  const cached = localStorage.getItem(LOCAL_STORAGE_FOOTER_KEY);
  if (cached) {
    try {
      return { ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(cached) };
    } catch {
      // Ignorer
    }
  }

  return DEFAULT_FOOTER_CONFIG;
}

/**
 * Sauvegarde la configuration du pied de page
 */
export async function saveFooterConfig(newConfig: FooterConfig): Promise<{ success: boolean; message?: string }> {
  // 1. Sauvegarde locale immédiate
  localStorage.setItem(LOCAL_STORAGE_FOOTER_KEY, JSON.stringify(newConfig));

  // 2. Diffusion de l'événement pour mise à jour instantanée sans rechargement
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(FOOTER_CONFIG_UPDATED_EVENT, { detail: newConfig }));
  }

  // 3. Sauvegarde Firestore si configuré
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'siteSettings', 'footerConfig');
      await setDoc(docRef, {
        ...newConfig,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err: any) {
      console.warn('Sauvegarde Firestore footerConfig échouée (sauvegardé en local):', err);
      return { success: true, message: 'Enregistré localement dans le navigateur (Firestore non joignable).' };
    }
  }

  return { success: true, message: 'Pied de page mis à jour avec succès sur l’ensemble du portail !' };
}

/**
 * Réinitialise aux valeurs officielles par défaut
 */
export async function resetFooterConfig(): Promise<FooterConfig> {
  await saveFooterConfig(DEFAULT_FOOTER_CONFIG);
  return DEFAULT_FOOTER_CONFIG;
}
