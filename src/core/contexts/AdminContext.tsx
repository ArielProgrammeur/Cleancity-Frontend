import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

interface AdminUser {
  uid: string;
  email: string;
  name: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  isAuthenticated: false,
  admin: null,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const checkAdminRole = useCallback(async (user: any) => {
    try {
      const tokenResult = await user.getIdTokenResult();
      if (tokenResult.claims.role === 'admin') {
        setAdmin({
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || 'Admin',
        });
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkAdminRole(user);
      } else {
        setAdmin(null);
      }
    });
    return unsubscribe;
  }, [checkAdminRole]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      if (!auth) return { success: false, error: 'Firebase non initialisé' };
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const tokenResult = await userCredential.user.getIdTokenResult();

      if (tokenResult.claims.role !== 'admin') {
        await auth.signOut();
        return { success: false, error: 'Vous n\'avez pas les droits administrateur.' };
      }

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
    setAdmin(null);
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated: !!admin, admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
