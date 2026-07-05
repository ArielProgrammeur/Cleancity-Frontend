import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface UserContextType {
  avatarUri: string | undefined;
  setAvatarUri: (uri: string | undefined) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextType>({
  avatarUri: undefined,
  setAvatarUri: () => {},
  userName: '',
  setUserName: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState('');

  const handleSetAvatar = useCallback((uri: string | undefined) => {
    setAvatarUri(uri);
  }, []);

  const handleSetName = useCallback((name: string) => {
    setUserName(name);
  }, []);

  return (
    <UserContext.Provider value={{ avatarUri, setAvatarUri: handleSetAvatar, userName, setUserName: handleSetName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
