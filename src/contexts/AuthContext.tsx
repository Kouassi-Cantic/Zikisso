import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  signup: (nom: string, email: string, motDePasse: string, profil: UserProfileType) => Promise<void>;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Stockage local de secours si les variables Firebase ne sont pas encore renseignées dans .env
const LOCAL_STORAGE_USERS_KEY = 'zikisso_local_users';
const LOCAL_STORAGE_SESSION_KEY = 'zikisso_local_session';

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
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              setUserData(userSnap.data() as UserData);
            } else {
              // Profil par défaut si le document n'existe pas encore
              setUserData({
                uid: user.uid,
                nom: user.displayName || user.email?.split('@')[0] || 'Apprenant',
                email: user.email || '',
                profil: 'Citoyen engagé',
                role: 'apprenant',
              });
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
          setUserData(parsed);
        }
      } catch (err) {
        console.warn('Session locale introuvable:', err);
      }
      setLoading(false);
    }
  }, []);

  const signup = async (nom: string, email: string, motDePasse: string, profil: UserProfileType) => {
    if (!nom.trim()) throw new Error('Le nom complet est obligatoire.');
    if (!email.trim()) throw new Error("L'adresse email est obligatoire.");
    if (motDePasse.length < 6) throw new Error('Le mot de passe doit comporter au moins 6 caractères.');

    if (isFirebaseConfigured) {
      // Inscription Firebase réelle
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), motDePasse);
      const user = userCredential.user;

      const newUserData: UserData = {
        uid: user.uid,
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        profil,
        role: 'apprenant', // Rôle fixé par défaut selon les spécifications
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
      const mockUid = 'user_' + Date.now();
      const newUserData: UserData = {
        uid: mockUid,
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        profil,
        role: 'apprenant',
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
        setUserData(userSnap.data() as UserData);
      }
      setCurrentUser(user);
    } else {
      // Connexion mode local
      const existingUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]');
      const found = existingUsers.find(
        (u: any) => u.email === email.trim().toLowerCase() && u.motDePasse === motDePasse
      );
      if (!found) {
        throw new Error('Identifiants incorrects (email ou mot de passe invalide).');
      }
      const sessionData: UserData = {
        uid: found.uid,
        nom: found.nom,
        email: found.email,
        profil: found.profil,
        role: found.role || 'apprenant',
      };
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionData));
      setCurrentUser({ uid: found.uid, email: found.email } as User);
      setUserData(sessionData);
    }
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
        logout,
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
