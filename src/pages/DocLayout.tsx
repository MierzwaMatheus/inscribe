// src/pages/DocLayout.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import DocViewer from "./DocViewer";
import docsMapJson from "@/docsMap.json";

interface DocLayoutProps {
  type: "public" | "internal";
}

const DocLayout: React.FC<DocLayoutProps> = ({ type }) => {
  console.log(
    `%c[DocLayout] Renderizando layout para: ${type}`,
    "color: #4CAF50; font-weight: bold"
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
    <div className="flex flex-1">
      <Sidebar docs={docsMap} type={type} />
      <main className="content-area flex-grow bg-white dark:bg-gray-900 transition-colors">
        <Routes>
          <Route path="/*" element={<DocViewer type={type} />} />
          {firstPagePath && (
            <Route index element={<Navigate to={firstPagePath} replace />} />
          )}
        </Routes>
      </main>
    </div>
  );
};

export default DocLayout;
