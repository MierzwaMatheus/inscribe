import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSearch } from '@/hooks/useSearch';
import SearchPopup from './SearchPopup';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const docType = location.pathname.startsWith('/internal') 
    ? 'internal' 
    : location.pathname.startsWith('/public') 
    ? 'public' 
    : undefined;

  const { searchTerm, setSearchTerm, searchResults, isLoading, isIndexing } = useSearch(docType);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === '/';
  const isPublicRoute = location.pathname.startsWith('/public');

  console.log('%c[Header] Componente de cabeçalho renderizado', 'color: #795548; font-weight: bold', { 
    user: user?.email, 
    isIndexing, 
    searchResultsCount: searchResults.length 
  });

  // Fechar popup ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`%c[Header] Termo de busca alterado: "${value}"`, 'color: #795548');
    setSearchTerm(value);
    setIsSearchVisible(value.trim().length > 0);
  };

  const handleSearchFocus = () => {
    console.log('%c[Header] Campo de busca focado', 'color: #795548');
    if (searchTerm.trim().length > 0) {
      setIsSearchVisible(true);
    }
  };

  const handleCloseSearch = () => {
    console.log('%c[Header] Fechando popup de busca', 'color: #795548');
    setIsSearchVisible(false);
  };

  const handleLogout = async () => {
    console.log('%c[Header] Iniciando processo de logout', 'color: #FF9800');
    try {
      await logout();
      console.log('%c[Header] Logout realizado com sucesso', 'color: #4CAF50; font-weight: bold');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('%c[Header] Erro no logout:', 'color: #F44336; font-weight: bold', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 h-[75px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">InBot Docs</h1>
        </div>

        {/* Campo de busca centralizado */}
        {!isHomePage && (
          <div className="flex-1 max-w-lg mx-8 relative" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isIndexing ? (
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
            <input
              type="text"
              placeholder={isIndexing ? "Indexando documentos..." : "Buscar na documentação..."}
              disabled={isIndexing}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setIsSearchVisible(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Popup de resultados */}
          <SearchPopup
            searchResults={searchResults}
            isLoading={isLoading}
            isVisible={isSearchVisible}
            onClose={handleCloseSearch}
            searchTerm={searchTerm}
          />
        </div>
        )}

        {!isHomePage && !isPublicRoute && user && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Olá, <span className="font-medium">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;