import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { api } from '../api/api';

interface DriverUser {
  id: string;
  email: string;
  name: string;
  zone: string;
}

interface DriverContextType {
  isAuthenticated: boolean;
  driver: DriverUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const DriverContext = createContext<DriverContextType>({
  isAuthenticated: false,
  driver: null,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export function DriverProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<DriverUser | null>(null);

  const fetchDriverProfile = useCallback(async (email: string) => {
    try {
      const data = await api.get<any>(`/api/drivers/by-email/${encodeURIComponent(email)}`);
      setDriver({
        id: data.id,
        email: data.email,
        name: `${data.prenom} ${data.nom}`,
        zone: data.zone,
      });
    } catch {
      setDriver(null);
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchDriverProfile(user.email || '');
      } else {
        setDriver(null);
      }
    });
    return unsubscribe;
  }, [fetchDriverProfile]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      if (!auth) return { success: false, error: 'Firebase non initialisé' };
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      const message =
        error.code === 'auth/user-not-found' ? 'Utilisateur non trouvé' :
        error.code === 'auth/wrong-password' ? 'Mot de passe incorrect' :
        error.code === 'auth/invalid-email' ? 'Email invalide' :
        'Erreur de connexion';
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    if (auth) await auth.signOut();
    setDriver(null);
  }, []);

  return (
    <DriverContext.Provider value={{ isAuthenticated: !!driver, driver, login, logout }}>
      {children}
    </DriverContext.Provider>
  );
}

export function useDriver() {
  return useContext(DriverContext);
}
