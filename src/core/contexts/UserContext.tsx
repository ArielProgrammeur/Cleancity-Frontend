import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';
import type { UserProfile, Badge } from '../../domain/entities/Profile';

interface UserContextType {
  userId: string;
  setUserId: (id: string) => void;
  avatarUri: string | undefined;
  setAvatarUri: (uri: string | undefined) => void;
  userName: string;
  setUserName: (name: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
  badges: Badge[];
  setBadges: (b: Badge[]) => void;
  logout: () => void;
  authReady: boolean;
}

const UserContext = createContext<UserContextType>({
  userId: '',
  setUserId: () => {},
  avatarUri: undefined,
  setAvatarUri: () => {},
  userName: '',
  setUserName: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  profile: null,
  setProfile: () => {},
  badges: [],
  setBadges: () => {},
  logout: () => {},
  authReady: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || '');
        setIsLoggedIn(true);
      } else {
        setUserId('');
        setUserName('');
        setIsLoggedIn(false);
        setProfile(null);
        setBadges([]);
      }
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    if (auth) {
      try { await signOut(auth); } catch {}
    }
    setUserId('');
    setAvatarUri(undefined);
    setUserName('');
    setIsLoggedIn(false);
    setProfile(null);
    setBadges([]);
  }, []);

  return (
    <UserContext.Provider value={{
      userId, setUserId,
      avatarUri, setAvatarUri,
      userName, setUserName,
      isLoggedIn, setIsLoggedIn,
      profile, setProfile,
      badges, setBadges,
      logout,
      authReady,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
