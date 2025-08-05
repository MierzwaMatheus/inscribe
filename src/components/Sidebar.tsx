// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, ChevronRight } from 'lucide-react';
import docsMap from '../docsMap.json';

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
  pages: Page[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="sidebar bg-gray-50 p-4 border-r border-gray-200 min-h-screen">
      {/* Header da Sidebar */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Documentação InBot</h2>
        <p className="text-sm text-gray-600">Sistema de documentação interna</p>
      </div>

      {/* Link para Home */}
      <div className="mb-6">
        <Link
          to="/"
          className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
            location.pathname === '/' 
              ? 'bg-blue-100 text-blue-700 font-semibold' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
          }`}
        >
          <Home size={16} />
          <span>Início</span>
        </Link>
      </div>

      {/* Seções da Documentação */}
      <div className="space-y-4">
        {docsMap.map((section: Section) => (
          <div key={section.section} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              {section.section}
            </h3>
            
            <ul className="space-y-1">
              {section.pages.map((page: Page) => {
                const isActive = location.pathname === page.path;
                
                return (
                  <li key={page.path}>
                    <Link
                      to={page.path}
                      className={`group flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 font-semibold border-l-2 border-blue-500' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 hover:translate-x-1'
                      }`}
                    >
                      <FileText size={14} className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm">{page.title}</div>
                        {page.description && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {page.description}
                          </div>
                        )}
                      </div>
                      <ChevronRight 
                        size={12} 
                        className={`flex-shrink-0 transition-transform ${
                          isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                        }`} 
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer da Sidebar */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div className="font-medium">InBot Docs</div>
          <div>v1.0.0</div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;