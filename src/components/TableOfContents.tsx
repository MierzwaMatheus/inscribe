import React, { useState, useEffect } from "react";

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
  const [activeId, setActiveId] = useState<string>("");

  console.log(
    "%c[TableOfContents] Iniciando componente TOC",
    "color: #2196F3; font-weight: bold"
  );

  // Extrair títulos do HTML e adicionar IDs aos headings no DOM
  useEffect(() => {
    console.log(
      "%c[TableOfContents] Extraindo títulos do HTML",
      "color: #4CAF50; font-weight: bold"
    );

    if (!htmlContent) {
      console.log(
        "%c[TableOfContents] HTML content vazio",
        "color: #FF9800; font-weight: bold"
      );
      setTocItems([]);
      return;
    }

    // Função para processar os headings
    const processHeadings = () => {
      const headings = document.querySelectorAll(
        ".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6"
      );
      console.log(
        "%c[TableOfContents] Títulos encontrados no DOM:",
        "color: #9C27B0; font-weight: bold",
        headings.length
      );

      if (headings.length === 0) {
        console.warn(
          "%c[TableOfContents] Nenhum título encontrado no DOM. Tentando novamente em 200ms.",
          "color: #FF9800; font-weight: bold"
        );
        return false;
      }

      const items: TocItem[] = [];
      const usedIds = new Set<string>();

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || "";

        // Se o heading não tem ID ou o ID já está sendo usado, vamos criar um
        if (!heading.id || usedIds.has(heading.id)) {
          const slugId = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
          
          // Se o slugId já existe ou está vazio, usar o índice
          heading.id = (slugId && !usedIds.has(slugId)) ? slugId : `heading-${index}`;
        }

        // Registrar o ID usado
        usedIds.add(heading.id);

        items.push({
          id: heading.id,
          text,
          level,
        });

        console.log(
          "%c[TableOfContents] Título processado:",
          "color: #607D8B; font-weight: bold",
          {
            level,
            text,
            id: heading.id,
          }
        );
      });

      setTocItems(items);
      return true;
    };

    // Tentar processar os headings com tentativas múltiplas
    let attempts = 0;
    const maxAttempts = 5;
    const attemptInterval = 200; // ms

    const tryProcessHeadings = () => {
      if (attempts >= maxAttempts) {
        console.error(
          "%c[TableOfContents] Falha ao encontrar títulos após várias tentativas",
          "color: #F44336; font-weight: bold"
        );
        return;
      }

      attempts++;
      console.log(
        "%c[TableOfContents] Tentativa %d de processar títulos",
        "color: #2196F3; font-weight: bold",
        attempts
      );

      if (!processHeadings()) {
        setTimeout(tryProcessHeadings, attemptInterval);
      }
    };

    // Iniciar o processo com um pequeno atraso para garantir que o DOM foi atualizado
    const timer = setTimeout(tryProcessHeadings, 100);

    return () => clearTimeout(timer);
  }, [htmlContent]);

  // Observar scroll para destacar item ativo
  useEffect(() => {
    console.log(
      "%c[TableOfContents] Configurando observer de scroll",
      "color: #3F51B5; font-weight: bold"
    );

    if (tocItems.length === 0) {
      console.log(
        "%c[TableOfContents] Nenhum item para observar",
        "color: #FF9800; font-weight: bold"
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            console.log(
              "%c[TableOfContents] Item ativo:",
              "color: #009688; font-weight: bold",
              entry.target.id
            );
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    // Observar todos os headings
    let observedElements = 0;
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
        observedElements++;
      } else {
        console.warn(
          "%c[TableOfContents] Elemento não encontrado para observar:",
          "color: #FF9800; font-weight: bold",
          item.id
        );
      }
    });

    console.log(
      "%c[TableOfContents] Elementos observados:",
      "color: #4CAF50; font-weight: bold",
      observedElements
    );

    return () => {
      observer.disconnect();
      console.log(
        "%c[TableOfContents] Observer desconectado",
        "color: #F44336; font-weight: bold"
      );
    };
  }, [tocItems]);

  // Função para scroll suave com offset
  const scrollToWithOffset = (id: string, offset = 100) => {
    console.log(
      "%c[TableOfContents] Navegando para:",
      "color: #FF5722; font-weight: bold",
      { id, offset }
    );

    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Atualiza o hash na URL para refletir a navegação
      window.location.hash = id;
      setActiveId(id);
    } else {
      console.error(
        "%c[TableOfContents] Elemento não encontrado:",
        "color: #F44336; font-weight: bold",
        id
      );
    }
  };

  // Função de clique para o heading
  const handleHeadingClick = (id: string) => {
    console.log(
      "%c[TableOfContents] Clique no item do índice:",
      "color: #E91E63; font-weight: bold",
      id
    );

    // Atualizar a URL com o hash da seção e acionar o scroll
    window.location.hash = id;
    
    // Usar setTimeout para garantir que o hash foi atualizado antes de fazer o scroll
    setTimeout(() => {
      scrollToWithOffset(id, 100);
      
      console.log(
        "%c[TableOfContents] URL atualizada com hash:",
        "color: #4CAF50; font-weight: bold",
        `#${id}`
      );
    }, 50);
  };

  if (tocItems.length === 0) {
    console.log(
      "%c[TableOfContents] Nenhum título encontrado",
      "color: #FF9800; font-weight: bold"
    );
    return null;
  }

  return (
    <div className="xl:sticky xl:top-[92px] bg-card dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 xl:max-h-[80vh] xl:overflow-y-auto transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors">
        📋 Índice
      </h3>

      <nav className="space-y-1">
        {tocItems.map((item) => {
          const isActive = activeId === item.id;
          const paddingLeft = `${(item.level - 1) * 0.75}rem`;

          return (
            <button
              key={item.id}
              onClick={() => handleHeadingClick(item.id)}
              className={`
                w-full text-left text-sm py-1.5 px-2 rounded transition-colors duration-200
                hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400
                ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-medium border-l-2 border-blue-500 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                }
              `}
              style={{ paddingLeft }}
              title={item.text}
            >
              <span className="block truncate">{item.text}</span>
            </button>
          );
        })}
      </nav>

      {tocItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 transition-colors">
          {tocItems.length} {tocItems.length === 1 ? "seção" : "seções"}
        </div>
      )}
    </div>
  );
};

export default TableOfContents;
