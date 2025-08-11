'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, SetStateAction, useEffect, JSX } from 'react';
import { localStorageKeys } from '../utils/common/localStorageKeys';
import { LoginResponse } from '../models/user';
import { _login } from '../services';
import { ToastType, showToast } from '@utils/services/toastService';
import { useTranslation } from '@hooks/useTranslation';

interface IAuthContext {
  user: LoginResponse | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  getUserFromLocalStorage: () => LoginResponse | null;
  isAuthenticated: () => boolean;
  isRedirecting: string | null;
  setRedirection: (currentDirection: string | null) => void;
  setUser: React.Dispatch<SetStateAction<LoginResponse | null>>;
  logout: (langId: string) => void;
  login: (email: string, password: string) => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider(props: { children: React.ReactNode }): JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
  const { t } = useTranslation('login');

  function login(email: string, password: string): void {
    setIsLoading(true);

    _login({ email, password })
      .then(res => {
        localStorage.setItem(localStorageKeys.user, JSON.stringify(res));
        localStorage.setItem(localStorageKeys.token, JSON.stringify(res.jwt));
        setUser(res);
        showToast(`${t.welcomeMessage} ${res.name}!`, ToastType.SUCCESS);

        if (isRedirecting) {
          router.push(`${isRedirecting}`);
          setIsRedirecting(null);
        } else {
          router.push('/');
        }
        router.refresh();
      })
      .catch(error => {
        console.error(error);
        showToast(t.loginErrorMessage, ToastType.ERROR);
      })
      .finally(() => setIsLoading(false));
  }

  function logout(langId: string) {
    localStorage.removeItem(localStorageKeys.user);
    localStorage.removeItem(localStorageKeys.token);
    setUser(null);
    router.push(`/${langId}/login`);
  }

  function getUserFromLocalStorage(): LoginResponse {
    return JSON.parse(localStorage.getItem(localStorageKeys.user) ?? '{}');
  }

  function isAuthenticated(): boolean {
    return !!getUserFromLocalStorage();
  }

  function setRedirection(currentDirection: string | null) {
    if (isRedirecting !== null) {
      setIsRedirecting(null);
    } else {
      setIsRedirecting(currentDirection as string);
    }
  }

  useEffect(() => {
    if (!user) {
      setUser(getUserFromLocalStorage());
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isRedirecting,
        setRedirection,
        getUserFromLocalStorage,
        setIsLoading,
        isAuthenticated,
        setUser,
        logout,
        login,
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
