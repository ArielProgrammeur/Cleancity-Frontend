import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AdminUser {
  email: string;
  name: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAuthenticated: false,
  admin: null,
  login: async () => ({ success: false }),
  logout: () => {},
});

const ADMIN_CREDENTIALS = { email: 'admin@gmail.com', password: 'root' };

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setAdmin({ email, name: 'Admin CleanCity' });
      return { success: true };
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }, []);

  const logout = useCallback(() => {
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
