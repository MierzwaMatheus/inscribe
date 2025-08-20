import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./Sidebar";

interface MobileMenuProps {
  docs: any[];
  type: "public" | "internal";
}

const MobileMenu: React.FC<MobileMenuProps> = ({ docs, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  console.log(
    "%c[MobileMenu] Componente inicializado",
    "color: #9C27B0; font-weight: bold",
    { isMobile, isOpen }
  );

  // Fechar menu quando não estiver em mobile
  useEffect(() => {
    if (!isMobile && isOpen) {
      console.log(
        "%c[MobileMenu] Fechando menu - não está em mobile",
        "color: #FF9800"
      );
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  // Fechar menu ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        console.log("%c[MobileMenu] Fechando menu com ESC", "color: #FF9800");
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Prevenir scroll do body quando menu estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      console.log(
        "%c[MobileMenu] Scroll do body desabilitado",
        "color: #2196F3"
      );
    } else {
      document.body.style.overflow = "unset";
      console.log("%c[MobileMenu] Scroll do body habilitado", "color: #2196F3");
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    console.log(
      "%c[MobileMenu] Alternando estado do menu",
      "color: #4CAF50; font-weight: bold",
      { from: isOpen, to: !isOpen }
    );
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    console.log("%c[MobileMenu] Fechando menu", "color: #FF9800");
    setIsOpen(false);
  };

  // Não renderizar se não estiver em mobile
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Botão do Menu Hambúrguer */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Drawer do Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header do Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Navegação
          </h2>
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Conteúdo do Sidebar */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          <div onClick={closeMenu}>
            <Sidebar docs={docs} type={type} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
