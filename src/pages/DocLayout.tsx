// src/pages/DocLayout.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import DocViewer from "./DocViewer";
import docsMapJson from "@/docsMap.json";
import { useIsMobile } from "@/hooks/use-mobile";

interface DocLayoutProps {
  type: "public" | "internal";
}

const DocLayout: React.FC<DocLayoutProps> = ({ type }) => {
  const isMobile = useIsMobile();
  
  console.log(
    `%c[DocLayout] Renderizando layout responsivo para: ${type}`,
    "color: #4CAF50; font-weight: bold",
    { isMobile }
  );

  console.log(
    `%c[DocLayout] Layout responsivo aplicado - Mobile: ${isMobile}`,
    "color: #2196F3; font-weight: bold"
  );

  const docsMap =
    type === "internal" ? docsMapJson.internal : docsMapJson.public;

  // Encontra a primeira página para redirecionamento
  const findFirstPage = (items: any[]): string | null => {
    for (const item of items) {
      if (item.pages && item.pages.length > 0) {
        const firstSubPage = findFirstPage(item.pages);
        if (firstSubPage) return firstSubPage;
      } else if (item.path) {
        return item.path;
      }
    }
    return null;
  };

  const firstPagePath = findFirstPage(docsMap);

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 h-screen overflow-hidden">
      {/* Menu Mobile */}
      <MobileMenu docs={docsMap} type={type} />
      
      <div className={`flex gap-4 lg:gap-6 p-4 lg:p-6 h-full ${
        isMobile ? 'flex-col' : 'flex-col lg:flex-row'
      }`}>
        {/* Container do Sidebar - Oculto em mobile */}
        {!isMobile && (
          <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-64 lg:h-[calc(100vh-3rem)] transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
              <div className="h-full overflow-y-auto">
                <Sidebar docs={docsMap} type={type} />
              </div>
            </div>
          </div>
        )}

        {/* Container do Conteúdo Principal */}
        <div className={`flex-1 min-w-0 ${
          isMobile ? 'order-1' : 'order-1 lg:order-2'
        }`}>
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl backdrop-blur-sm ${
            isMobile 
              ? 'h-[calc(100vh-8rem)] mt-16' // Espaço para o botão hambúrguer
              : 'h-[calc(100vh-20rem)] lg:h-[calc(100vh-3rem)]'
          }`}>
            <main className="h-full overflow-y-auto">
              <Routes>
                <Route path="/*" element={<DocViewer type={type} />} />
                {firstPagePath && (
                  <Route
                    index
                    element={<Navigate to={firstPagePath} replace />}
                  />
                )}
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocLayout;
