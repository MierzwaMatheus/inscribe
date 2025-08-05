import React, { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  htmlContent: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ htmlContent }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  console.log('%c[TableOfContents] Iniciando componente TOC', 'color: #2196F3; font-weight: bold');

  // Extrair títulos do HTML e adicionar IDs aos headings no DOM
  useEffect(() => {
    console.log('%c[TableOfContents] Extraindo títulos do HTML', 'color: #4CAF50; font-weight: bold');
    
    if (!htmlContent) {
      console.log('%c[TableOfContents] HTML content vazio', 'color: #FF9800; font-weight: bold');
      setTocItems([]);
      return;
    }

    // Aguardar um pouco para garantir que o DOM foi atualizado
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6');
      console.log('%c[TableOfContents] Títulos encontrados no DOM:', 'color: #9C27B0; font-weight: bold', headings.length);
      
      const items: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';
        
        // Se o heading não tem ID, vamos criar um
        if (!heading.id) {
          const slugId = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          heading.id = slugId || `heading-${index}`;
        }
        
        items.push({
          id: heading.id,
          text,
          level
        });
        
        console.log('%c[TableOfContents] Título processado:', 'color: #607D8B; font-weight: bold', {
          level,
          text,
          id: heading.id
        });
      });
      
      setTocItems(items);
    }, 100);

    return () => clearTimeout(timer);
  }, [htmlContent]);

  // Observar scroll para destacar item ativo
  useEffect(() => {
    console.log('%c[TableOfContents] Configurando observer de scroll', 'color: #3F51B5; font-weight: bold');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            console.log('%c[TableOfContents] Item ativo:', 'color: #009688; font-weight: bold', entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    );

    // Observar todos os headings
    tocItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      console.log('%c[TableOfContents] Observer desconectado', 'color: #F44336; font-weight: bold');
    };
  }, [tocItems]);

  // Função para scroll suave até o elemento
  const scrollToHeading = (id: string) => {
    console.log('%c[TableOfContents] Navegando para:', 'color: #FF5722; font-weight: bold', id);
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setActiveId(id);
    }
  };

  if (tocItems.length === 0) {
    console.log('%c[TableOfContents] Nenhum título encontrado', 'color: #FF9800; font-weight: bold');
    return null;
  }

  return (
    <div className="xl:sticky xl:top-[92px] bg-card border rounded-lg p-4 xl:max-h-[80vh] xl:overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
        📋 Índice
      </h3>
      
      <nav className="space-y-1">
        {tocItems.map((item) => {
          const isActive = activeId === item.id;
          const paddingLeft = `${(item.level - 1) * 0.75}rem`;
          
          return (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`
                w-full text-left text-sm py-1.5 px-2 rounded transition-colors duration-200
                hover:bg-blue-50 hover:text-blue-700
                ${
                  isActive 
                    ? 'bg-blue-100 text-blue-800 font-medium border-l-2 border-blue-500' 
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
              style={{ paddingLeft }}
              title={item.text}
            >
              <span className="block truncate">
                {item.text}
              </span>
            </button>
          );
        })}
      </nav>
      
      {tocItems.length > 0 && (
        <div className="mt-4 pt-3 border-t text-xs text-gray-500">
          {tocItems.length} {tocItems.length === 1 ? 'seção' : 'seções'}
        </div>
      )}
    </div>
  );
};

export default TableOfContents;