import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('%c[ProtectedRoute] Verificando autenticação', 'color: #9C27B0', { user: !!user, loading });

  if (loading) {
    console.log('%c[ProtectedRoute] Carregando estado de autenticação...', 'color: #FF9800');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('%c[ProtectedRoute] Usuário não autenticado, redirecionando para login', 'color: #F44336');
    return <LoginPage />;
  }

  console.log('%c[ProtectedRoute] Usuário autenticado, permitindo acesso', 'color: #4CAF50');
  return <>{children}</>;
};

export default ProtectedRoute;