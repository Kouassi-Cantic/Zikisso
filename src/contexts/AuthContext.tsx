import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import type { UserData, UserProfileType } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signup: (
    nom: string,
    email: string,
    motDePasse: string,
    profil: UserProfileType,
    commune?: string,
    region?: string
  ) => Promise<void>;
  login: (email: string, motDePasse: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileTerritory: (commune: string, region: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Stockage local de secours si les variables Firebase ne sont pas encore renseignées dans .env
const LOCAL_STORAGE_USERS_KEY = 'zikisso_local_users';
const LOCAL_STORAGE_SESSION_KEY = 'zikisso_local_session';

// Adresses email bénéficiant automatiquement des privilèges Super Admin
export const SUPER_ADMIN_EMAILS = [
  'teletechnologyci@gmail.com',
  'admin@zikisso.ci',
];

export const isSuperAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Écoute de l'état d'authentification
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          try {
            const userEmail = (user.email || '').toLowerCase();
            const isSuperAdmin = isSuperAdminEmail(userEmail);
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              const data = userSnap.data() as UserData;
              const effectiveRole = isSuperAdmin ? 'admin' : (data.role || 'apprenant');
              setUserData({
                ...data,
                role: effectiveRole,
                commune: data.commune || 'Zikisso',
                region: data.region || 'Lôh-Djiboua',
              });

              // Si super admin et que Firestore avait encore 'apprenant', mise à jour automatique
              if (isSuperAdmin && data.role !== 'admin') {
                setDoc(userDocRef, { role: 'admin' }, { merge: true }).catch(() => {});
              }
            } else {
              // Profil par défaut si le document n'existe pas encore
              const defaultRole = isSuperAdmin ? 'admin' : 'apprenant';
              const newProfile: UserData = {
                uid: user.uid,
                nom: user.displayName || (isSuperAdmin ? 'Super Administrateur' : user.email?.split('@')[0] || 'Apprenant'),
                email: userEmail,
                profil: isSuperAdmin ? 'Conseiller municipal élu' : 'Citoyen engagé',
                role: defaultRole,
                commune: 'Zikisso',
                region: 'Lôh-Djiboua',
              };
              setUserData(newProfile);
              setDoc(userDocRef, { ...newProfile, createdAt: serverTimestamp() }).catch(() => {});
            }
          } catch (err) {
            console.error('Erreur lors de la récupération du profil utilisateur:', err);
          }
        } else {
          setUserData(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Mode local / prévisualisation
      try {
        const savedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setCurrentUser({ uid: parsed.uid, email: parsed.email } as User);
          setUserData({
            ...parsed,
            commune: parsed.commune || 'Zikisso',
            region: parsed.region || 'Lôh-Djiboua',
          });
        }
      } catch (err) {
        console.warn('Session locale introuvable:', err);
      }
      setLoading(false);
    }
  }, []);

  const signup = async (
    nom: string,
    email: string,
    motDePasse: string,
    profil: UserProfileType,
    commune?: string,
    region?: string
  ) => {
    if (!nom.trim()) throw new Error('Le nom complet est obligatoire.');
    if (!email.trim()) throw new Error("L'adresse email est obligatoire.");
    if (motDePasse.length < 6) throw new Error('Le mot de passe doit comporter au moins 6 caractères.');

    const cleanCommune = commune?.trim() || 'Zikisso';
    const cleanRegion = region?.trim() || 'Lôh-Djiboua';

    if (isFirebaseConfigured) {
      // Inscription Firebase réelle
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), motDePasse);
      const user = userCredential.user;
      const userEmail = email.trim().toLowerCase();
      const isSuperAdmin = isSuperAdminEmail(userEmail);

      const newUserData: UserData = {
        uid: user.uid,
        nom: nom.trim(),
        email: userEmail,
        profil: isSuperAdmin ? 'Conseiller municipal élu' : profil,
        role: isSuperAdmin ? 'admin' : 'apprenant',
        commune: cleanCommune,
        region: cleanRegion,
      };

      // Création du document dans la collection "users"
      await setDoc(doc(db, 'users', user.uid), {
        ...newUserData,
        createdAt: serverTimestamp(),
      });

      setUserData(newUserData);
      setCurrentUser(user);
    } else {
      // Mode simulation hors-ligne pour tester l'interface
      const userEmail = email.trim().toLowerCase();
      const isSuperAdmin = isSuperAdminEmail(userEmail);
      const mockUid = isSuperAdmin ? 'admin_zikisso_super' : 'user_' + Date.now();
      const newUserData: UserData = {
        uid: mockUid,
        nom: nom.trim(),
        email: userEmail,
        profil: isSuperAdmin ? 'Conseiller municipal élu' : profil,
        role: isSuperAdmin ? 'admin' : 'apprenant',
        commune: cleanCommune,
        region: cleanRegion,
        createdAt: new Date().toISOString(),
      };

      const existingUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]');
      if (existingUsers.some((u: UserData) => u.email === newUserData.email)) {
        throw new Error('Cette adresse email est déjà utilisée.');
      }
      existingUsers.push({ ...newUserData, motDePasse });
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(existingUsers));
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(newUserData));

      setCurrentUser({ uid: mockUid, email: newUserData.email } as User);
      setUserData(newUserData);
    }
  };

  const login = async (email: string, motDePasse: string) => {
    if (!email.trim() || !motDePasse) {
      throw new Error('Veuillez renseigner votre email et votre mot de passe.');
    }

    if (isFirebaseConfigured) {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), motDePasse);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserData;
        setUserData({
          ...data,
          commune: data.commune || 'Zikisso',
          region: data.region || 'Lôh-Djiboua',
        });
      }
      setCurrentUser(user);
    } else {
      // Connexion mode local
      const existingUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]');
      const userEmail = email.trim().toLowerCase();
      const isSuperAdmin = isSuperAdminEmail(userEmail);
      const found = existingUsers.find(
        (u: any) => u.email === userEmail && (u.motDePasse === motDePasse || isSuperAdmin)
      );
      if (!found && !isSuperAdmin) {
        throw new Error('Identifiants incorrects (email ou mot de passe invalide).');
      }
      const sessionData: UserData = {
        uid: found?.uid || (isSuperAdmin ? 'admin_zikisso_super' : 'user_' + Date.now()),
        nom: found?.nom || (isSuperAdmin ? 'Super Administrateur' : 'Utilisateur'),
        email: userEmail,
        profil: found?.profil || (isSuperAdmin ? 'Conseiller municipal élu' : 'Citoyen engagé'),
        role: isSuperAdmin ? 'admin' : (found?.role || 'apprenant'),
        commune: found?.commune || 'Zikisso',
        region: found?.region || 'Lôh-Djiboua',
      };
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionData));
      setCurrentUser({ uid: sessionData.uid, email: sessionData.email } as User);
      setUserData(sessionData);
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured) {
      const provider = new GoogleAuthProvider();
      // Demande de sélection de compte si plusieurs comptes Google sont connectés
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userEmail = (user.email || '').toLowerCase();
      const isSuperAdmin = isSuperAdminEmail(userEmail);

      // Vérification / création automatique du document profil utilisateur dans Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserData;
        const effectiveRole = isSuperAdmin ? 'admin' : (data.role || 'apprenant');
        setUserData({
          ...data,
          role: effectiveRole,
          commune: data.commune || 'Zikisso',
          region: data.region || 'Lôh-Djiboua',
        });
        if (isSuperAdmin && data.role !== 'admin') {
          setDoc(userDocRef, { role: 'admin' }, { merge: true }).catch(() => {});
        }
      } else {
        // Premier accès via Google : création du profil apprenant par défaut ou super admin
        const newUserData: UserData = {
          uid: user.uid,
          nom: user.displayName || (isSuperAdmin ? 'Super Administrateur' : user.email?.split('@')[0] || 'Apprenant Google'),
          email: userEmail,
          profil: isSuperAdmin ? 'Conseiller municipal élu' : 'Citoyen engagé',
          role: isSuperAdmin ? 'admin' : 'apprenant',
          commune: 'Zikisso',
          region: 'Lôh-Djiboua',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, {
          ...newUserData,
          createdAt: serverTimestamp(),
        });
        setUserData(newUserData);
      }
      setCurrentUser(user);
    } else {
      // Secours en mode simulation local
      const mockUid = 'admin_zikisso_super';
      const mockEmail = 'teletechnologyci@gmail.com';
      const sessionData: UserData = {
        uid: mockUid,
        nom: 'Super Administrateur (Zikisso)',
        email: mockEmail,
        profil: 'Conseiller municipal élu',
        role: 'admin',
        commune: 'Zikisso',
        region: 'Lôh-Djiboua',
      };
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionData));
      setCurrentUser({ uid: mockUid, email: mockEmail } as User);
      setUserData(sessionData);
    }
  };

  const updateProfileTerritory = async (commune: string, region: string) => {
    if (!currentUser || !userData) return;
    const cleanCommune = commune.trim() || 'Zikisso';
    const cleanRegion = region.trim() || 'Lôh-Djiboua';

    const updated: UserData = {
      ...userData,
      commune: cleanCommune,
      region: cleanRegion,
    };

    if (isFirebaseConfigured) {
      try {
        await setDoc(
          doc(db, 'users', currentUser.uid),
          { commune: cleanCommune, region: cleanRegion },
          { merge: true }
        );
      } catch (e) {
        console.error('Erreur mise à jour territoire Firestore:', e);
      }
    } else {
      try {
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updated));
        const existingUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]');
        const idx = existingUsers.findIndex((u: any) => u.uid === currentUser.uid);
        if (idx !== -1) {
          existingUsers[idx] = { ...existingUsers[idx], commune: cleanCommune, region: cleanRegion };
          localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(existingUsers));
        }
      } catch (e) {}
    }
    setUserData(updated);
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    }
    setCurrentUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        loading,
        isFirebaseConfigured,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateProfileTerritory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }
  return context;
};
