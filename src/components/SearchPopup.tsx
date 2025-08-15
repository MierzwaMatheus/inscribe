import React from "react";
import { SearchResult } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";

interface SearchPopupProps {
  searchResults: SearchResult[];
  isLoading: boolean;
  isVisible: boolean;
  onClose: () => void;
  searchTerm: string;
}

const SearchPopup: React.FC<SearchPopupProps> = ({
  searchResults,
  isLoading,
  isVisible,
  onClose,
  searchTerm,
}) => {
  const navigate = useNavigate();

  console.log(
    "%c[SearchPopup] Renderizando popup de busca",
    "color: #673AB7; font-weight: bold",
    {
      isVisible,
      resultsCount: searchResults.length,
      isLoading,
      searchTerm,
    }
  );

  const handleResultClick = (path: string) => {
    console.log(`%c[SearchPopup] Navegando para: ${path}`, "color: #673AB7");
    navigate(path);
    onClose();
  };

  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;

    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded transition-colors"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popup de resultados */}
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto transition-colors">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
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
              <span className="text-gray-600 dark:text-gray-300 transition-colors">
                Buscando...
              </span>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 transition-colors">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-2 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>Nenhum resultado encontrado para "{searchTerm}"</p>
            <p className="text-sm mt-1">
              Tente usar termos diferentes ou mais específicos
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* Cabeçalho com contagem */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors">
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                {searchResults.length} resultado
                {searchResults.length !== 1 ? "s" : ""} encontrado
                {searchResults.length !== 1 ? "s" : ""} para "{searchTerm}"
              </p>
            </div>

            {/* Lista de resultados */}
            <div className="max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.path}-${index}`}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result.path)}
                >
                  {/* Título e seção */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {highlightText(result.title, searchTerm)}
                    </h3>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex-shrink-0 transition-colors">
                      {result.section}
                    </span>
                  </div>

                  {/* Descrição */}
                  {result.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors">
                      {highlightText(result.description, searchTerm)}
                    </p>
                  )}

                  {/* Tags */}
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
                        >
                          {highlightText(tag, searchTerm)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Matches de conteúdo */}
                  {result.contentMatches.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 transition-colors">
                        Trechos encontrados:
                      </h4>
                      <div className="space-y-2">
                        {result.contentMatches.map((match, matchIndex) => (
                          <div
                            key={matchIndex}
                            className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded border-l-2 border-blue-200 dark:border-blue-400 transition-colors"
                          >
                            <span className="text-gray-500 dark:text-gray-400 transition-colors">
                              ...
                            </span>
                            {highlightText(match.context, searchTerm)}
                            <span className="text-gray-500 dark:text-gray-400 transition-colors">
                              ...
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Score de relevância (apenas para debug em desenvolvimento) */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 transition-colors">
                      Score: {result.score}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPopup;
