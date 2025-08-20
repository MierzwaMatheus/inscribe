import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./Sidebar";

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log("%c[Header] Estado do menu mobile:", "color: #2196F3; font-weight: bold", {
    isMobile,
    isMobileMenuOpen
  });

  const isHomePage = location.pathname === "/";
  const isPublicRoute = location.pathname.startsWith("/public");

  const handleLogout = async () => {
    console.log("%c[Header] Iniciando logout...", "color: #FF5722; font-weight: bold");
    try {
      await logout();
      navigate("/");
      console.log("%c[Header] Logout realizado com sucesso", "color: #4CAF50; font-weight: bold");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("%c[Header] Erro ao fazer logout:", "color: #F44336; font-weight: bold", error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const toggleMobileMenu = () => {
    console.log("%c[Header] Alternando menu mobile:", "color: #9C27B0; font-weight: bold", !isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    console.log("%c[Header] Fechando menu mobile", "color: #9C27B0; font-weight: bold");
    setIsMobileMenuOpen(false);
  };

  // Fechar menu quando não estiver em mobile
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      console.log("%c[Header] Fechando menu mobile - mudança para desktop", "color: #9C27B0; font-weight: bold");
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  // Fechar menu com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        console.log("%c[Header] Fechando menu mobile com ESC", "color: #9C27B0; font-weight: bold");
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Controlar scroll do body
  useEffect(() => {
    if (isMobileMenuOpen) {
      console.log("%c[Header] Bloqueando scroll do body", "color: #9C27B0; font-weight: bold");
      document.body.style.overflow = "hidden";
    } else {
      console.log("%c[Header] Liberando scroll do body", "color: #9C27B0; font-weight: bold");
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="bg-gradient-to-r from-blue-400 to-purple-400 dark:bg-gradient-to-r dark:from-[#0171bd] dark:to-[#940078] border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 h-[65px] sm:h-[75px] transition-colors">
        <div className="flex items-center justify-between">
          {/* Menu hambúrguer - apenas mobile */}
          {isMobile && !isHomePage && (
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors mr-2 flex-shrink-0"
              aria-label="Abrir menu de navegação"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-4 hover:opacity-80 transition-opacity min-w-0"
          >
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-white/30 dark:bg-white/20 rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm flex-shrink-0">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-white dark:text-white transition-colors drop-shadow-sm truncate">
              InBot Docs
            </h1>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {/* Botão de alternância de tema sempre visível */}
            <ThemeToggle />

            {!isHomePage && !isPublicRoute && user && (
              <>
                {/* Informação do usuário - oculta em telas muito pequenas */}
                <div className="hidden sm:block text-xs sm:text-sm text-white/90 dark:text-white/90 transition-colors drop-shadow-sm truncate max-w-[120px] md:max-w-none">
                  Olá, <span className="font-medium">{user?.email}</span>
                </div>

                {/* Botão de logout responsivo */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-white/30 dark:border-white/30 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-white dark:text-white bg-white/20 dark:bg-white/20 hover:bg-white/30 dark:hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 dark:focus:ring-white/50 transition-colors backdrop-blur-sm flex-shrink-0"
                  title="Sair"
                >
                  <svg
                    className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Menu mobile drawer */}
      {isMobile && isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMobileMenu}
          />
          
          {/* Drawer */}
          <div className="fixed top-[65px] left-0 w-80 h-[calc(100vh-65px)] bg-white dark:bg-gray-900 shadow-xl z-40 overflow-y-auto">
            <div className="p-4">
              <Sidebar onNavigate={closeMobileMenu} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
