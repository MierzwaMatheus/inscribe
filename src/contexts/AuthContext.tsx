import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('%c[AuthProvider] Inicializando contexto de autenticação', 'color: #4CAF50; font-weight: bold');

  useEffect(() => {
    console.log('%c[AuthProvider] Configurando listener de estado de autenticação', 'color: #2196F3');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('%c[AuthProvider] Estado de autenticação alterado:', 'color: #FF9800', user ? 'Usuário logado' : 'Usuário deslogado');
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('%c[AuthProvider] Removendo listener de autenticação', 'color: #9E9E9E');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('%c[AuthProvider] Tentativa de login para:', 'color: #2196F3', email);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('%c[AuthProvider] Login realizado com sucesso', 'color: #4CAF50; font-weight: bold');
    } catch (error) {
      console.error('%c[AuthProvider] Erro no login:', 'color: #F44336; font-weight: bold', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('%c[AuthProvider] Realizando logout', 'color: #FF9800');
    try {
      await signOut(auth);
      console.log('%c[AuthProvider] Logout realizado com sucesso', 'color: #4CAF50; font-weight: bold');
    } catch (error) {
      console.error('%c[AuthProvider] Erro no logout:', 'color: #F44336; font-weight: bold', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};