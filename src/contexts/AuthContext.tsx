'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, SetStateAction, JSX } from 'react';
import { LoginResponse } from '../models/user';
import { handleLogout } from 'app/[lang]/logout/actions';

interface IAuthContext {
  user: LoginResponse | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  isRedirecting: string | null;
  setRedirection: (currentDirection: string | null) => void;
  setUser: React.Dispatch<SetStateAction<LoginResponse | null>>;
  logout: (langId: string) => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider(props: { children: React.ReactNode }): JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);

  async function logout(langId: string): Promise<void> {
    await handleLogout();
    setUser(null);
    router.push(`/${langId}/login`);
  }

  function setRedirection(currentDirection: string | null) {
    if (isRedirecting !== null) {
      setIsRedirecting(null);
    } else {
      setIsRedirecting(currentDirection as string);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isRedirecting,
        setRedirection,
        setIsLoading,
        setUser,
        logout,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  if (Object.entries(context).length === 0) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
