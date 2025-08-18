// src/components/Sidebar.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, ChevronRight } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import SearchPopup from "./SearchPopup";

interface Page {
  title: string;
  path: string;
  order?: number;
  description?: string;
  tags?: string[];
}

interface Section {
  section: string;
  path?: string;
  pages: (Page | Section)[]; // Pode conter sub-seções
}

interface SidebarProps {
  docs: (Page | Section)[];
  type: "public" | "internal";
}

// Componente para renderizar uma página
const RenderPage: React.FC<{
  page: Page;
  isItemActive: (path: string) => boolean;
}> = ({ page, isItemActive }) => {
  const isActive = isItemActive(page.path);
  return (
    <li>
      <Link
        to={page.path}
        className={`group flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-400 to-purple-400 dark:bg-gradient-to-r dark:from-[#0171bd] dark:to-[#940078] text-white dark:text-white font-semibold border-l-2 border-blue-500 dark:border-blue-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1"
        }`}
      >
        <FileText size={14} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm">{page.title}</div>
        </div>
        <ChevronRight
          size={12}
          className={`flex-shrink-0 transition-transform ${
            isActive ? "rotate-90" : "group-hover:translate-x-1"
          }`}
        />
      </Link>
    </li>
  );
};

// Componente para renderizar uma seção (e suas sub-páginas/seções)
const RenderSection: React.FC<{
  section: Section;
  isItemActive: (path: string) => boolean;
}> = ({ section, isItemActive }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2 transition-colors">
      {section.section}
    </h3>
    <ul className="space-y-1">
      {section.pages.map((item) =>
        "section" in item ? (
          <RenderSection
            key={item.section}
            section={item as Section}
            isItemActive={isItemActive}
          />
        ) : (
          <RenderPage
            key={item.path}
            page={item as Page}
            isItemActive={isItemActive}
          />
        )
      )}
    </ul>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ docs, type }) => {
  const location = useLocation();
  const { searchTerm, setSearchTerm, searchResults, isLoading, isIndexing } =
    useSearch(type);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fechar popup ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearchVisible(value.trim().length > 0);
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim().length > 0) {
      setIsSearchVisible(true);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
  };

  console.log(
    "%c[Sidebar] Localização atual:",
    "color: #2196F3; font-weight: bold",
    {
      pathname: location.pathname,
      decoded: decodeURIComponent(location.pathname),
    }
  );

  // Função para normalizar paths para comparação
  const normalizePath = (path: string): string => {
    console.log("%c[Sidebar] Normalizando path:", "color: #4CAF50", {
      original: path,
      decoded: decodeURIComponent(path),
    });
    return decodeURIComponent(path);
  };

  // Função para verificar se um item está ativo
  const isItemActive = (itemPath: string): boolean => {
    const normalizedLocation = normalizePath(location.pathname);
    const normalizedItemPath = normalizePath(itemPath);
    const isActive = normalizedLocation === normalizedItemPath;

    console.log("%c[Sidebar] Verificando item ativo:", "color: #FF9800", {
      itemPath,
      normalizedLocation,
      normalizedItemPath,
      isActive,
    });

    return isActive;
  };

  return (
    <nav className="sidebar bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-75px)] sticky top-[75px] flex flex-col justify-between transition-colors">
      {/* Header da Sidebar */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">
          Documentação {type === "internal" ? "Interna" : "Pública"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
          Navegue pelas seções
        </p>
      </div>

      {/* Campo de busca */}
      <div className="mb-6 relative" ref={searchRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isIndexing ? (
              <svg
                className="animate-spin h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
          <input
            type="text"
            placeholder={
              isIndexing
                ? "Indexando documentos..."
                : "Buscar na documentação..."
            }
            disabled={isIndexing}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          />
          <SearchPopup
            searchResults={searchResults}
            isLoading={isLoading}
            isVisible={isSearchVisible}
            onClose={handleCloseSearch}
            searchTerm={searchTerm}
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setIsSearchVisible(false);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {isSearchVisible && (
          <SearchPopup
            searchTerm={searchTerm}
            searchResults={searchResults}
            isLoading={isLoading}
            onClose={handleCloseSearch}
            docType={type}
          />
        )}
      </div>

      {/* Link para Home */}
      <div className="mb-6">
        <Link
          to="/"
          className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
            location.pathname === "/"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          <Home size={16} />
          <span>Início</span>
        </Link>
      </div>

      {/* Seções da Documentação */}
      <div className="space-y-4 h-full overflow-y-scroll scrollbar-hide">
        {docs.map((item) =>
          "section" in item ? (
            <RenderSection
              key={item.section}
              section={item as Section}
              isItemActive={isItemActive}
            />
          ) : (
            <RenderPage
              key={item.path}
              page={item as Page}
              isItemActive={isItemActive}
            />
          )
        )}
      </div>

      {/* Footer da Sidebar */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center transition-colors">
          <div className="font-medium">InBot Docs</div>
          <div>v1.0.0</div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
