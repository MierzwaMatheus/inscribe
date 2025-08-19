import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMarkdownPath } from "../utils/pathResolver";
import { parseMarkdown, DocumentMetadata } from "../utils/markdownParser";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Tema GitHub para destaque de código
import "../styles/highlight-theme.css"; // Tema customizado com suporte ao modo escuro
import TableOfContents from "../components/TableOfContents";
import InPageSearch from "../components/InPageSearch";

interface DocViewerProps {
  type: "public" | "internal";
}

const DocViewer: React.FC<DocViewerProps> = ({ type }) => {
  const { "*": docPath } = useParams();
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [title, setTitle] = useState<string>("Carregando...");
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<DocumentMetadata>({});

  console.log(
    "%c[DocViewer] Parâmetros recebidos:",
    "color: #E91E63; font-weight: bold",
    {
      docPath,
      decodedDocPath: docPath ? decodeURIComponent(docPath) : null,
    }
  );

  // Função para processar markdown com highlight
  const processMarkdown = (content: string): string => {
    console.log(
      "%c[DocViewer] Processando markdown...",
      "color: #FF9800; font-weight: bold"
    );

    // Configuração do marked com geração automática de IDs para headings
    marked.setOptions({
      headerIds: true,
      headerPrefix: '',
    });

    // Configuração básica do marked
    const html = marked(content) as string;

    // Aplicar highlight.js após a conversão
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Garantir que todos os headings tenham IDs únicos
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent || '';
        const slugId = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        heading.id = slugId || `heading-${index}`;
        
        console.log(
          "%c[DocViewer] ID gerado para heading:",
          "color: #4CAF50; font-weight: bold",
          { text, id: heading.id }
        );
      }
    });

    // Corrigir caminhos das imagens
    const images = tempDiv.querySelectorAll("img");
    images.forEach((img) => {
      const src = img.getAttribute("src");
      console.log("%c[DocViewer] Imagem encontrada:", "color: #FF9800", {
        originalSrc: src,
      });

      if (src && !src.startsWith("http") && !src.startsWith("/")) {
        // Caminho relativo - precisa ser corrigido
        const basePath = `/docs/${type}/${docPath}`;
        const pathParts = basePath.split("/");
        pathParts.pop(); // Remove o nome do arquivo .md
        const imagePath = `${pathParts.join("/")}/${src}`;

        console.log(
          "%c[DocViewer] Corrigindo caminho da imagem:",
          "color: #FF9800",
          {
            from: src,
            to: imagePath,
            basePath,
            docPath,
          }
        );

        img.setAttribute("src", imagePath);
      }
    });

    // Aplicar highlight.js nos blocos de código
    const codeBlocks = tempDiv.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      const element = block as HTMLElement;
      hljs.highlightElement(element);
    });

    return tempDiv.innerHTML;
  };

  useEffect(() => {
    if (!docPath) return;

    // Constrói o caminho para o arquivo .md na pasta /public/docs/
    const fullPath = getMarkdownPath(`/docs/${type}/${docPath}`);
    setError(null); // Limpa erros anteriores
    setTitle("Carregando...");

    fetch(fullPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Não foi possível carregar o documento: ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((mdContent) => {
        const { content, data } = parseMarkdown(mdContent);
        setTitle(data.title || "Documento sem título");
        setMetadata(data);
        setHtmlContent(processMarkdown(content));
      })
      .catch((err) => {
        console.error("Erro ao carregar Markdown:", err);
        setError(
          `Erro ao carregar o documento: ${err.message}. Verifique se o caminho '${fullPath}' está correto.`
        );
        setTitle("Erro");
        setHtmlContent("");
      });
  }, [docPath, type]);

  // Efeito para navegar para seção específica via hash na URL
  useEffect(() => {
    if (htmlContent && window.location.hash) {
      const hash = window.location.hash.substring(1);
      console.log(
        "%c[DocViewer] Navegando para hash da URL:",
        "color: #9C27B0; font-weight: bold",
        hash
      );
      
      // Aguardar um pouco para garantir que o DOM foi renderizado
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 100;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          
          console.log(
            "%c[DocViewer] Navegação para hash concluída:",
            "color: #4CAF50; font-weight: bold",
            hash
          );
        } else {
          console.warn(
            "%c[DocViewer] Elemento não encontrado para hash:",
            "color: #FF9800; font-weight: bold",
            hash
          );
        }
      }, 300);
    }
  }, [htmlContent]);

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-destructive mb-4">{title}</h1>
          <p className="text-destructive mb-4">{error}</p>
          <div className="space-x-4">
            <a
              href="/"
              className="text-primary hover:text-primary/80 underline"
            >
              ← Voltar para a página inicial
            </a>
            <a
              href="/public/1_Publicas/bem-vindo"
              className="text-primary hover:text-primary/80 underline"
            >
              Ir para a documentação pública
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 p-4 xl:p-6 min-h-full">
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0 order-2 xl:order-1 overflow-x-hidden">
          <article className="p-4 md:p-6 xl:p-8 w-full max-w-none">
            {/* Cabeçalho do documento */}
            <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 transition-colors">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                {title}
              </h1>

              {/* Metadados do frontmatter */}
              {(metadata.description || metadata.tags) && (
                <div className="mt-4 space-y-2">
                  {metadata.description && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors">
                      {metadata.description}
                    </p>
                  )}

                  {metadata.tags && Array.isArray(metadata.tags) && (
                    <div className="flex flex-wrap gap-2">
                      {metadata.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm rounded-md transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Breadcrumb */}
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                <span>
                  📍 /{type}/{docPath || "(raiz)"}
                </span>
              </div>
            </header>

            {/* Conteúdo do documento */}
            <div
              className="markdown-body prose prose-slate max-w-none w-full overflow-x-auto
                         prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                         prose-p:text-gray-700 dark:prose-p:text-gray-300
                         prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                         prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:break-all
                         prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800 prose-pre:border dark:prose-pre:border-gray-700 prose-pre:overflow-x-auto prose-pre:max-w-full
                         prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:border-l-blue-500 dark:prose-blockquote:border-l-blue-400
                         prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300 prose-a:break-all
                         prose-table:text-gray-700 dark:prose-table:text-gray-300 prose-table:table-auto prose-table:w-full prose-table:overflow-x-auto
                         prose-th:text-gray-900 dark:prose-th:text-gray-100 prose-td:text-gray-700 dark:prose-td:text-gray-300
                         prose-img:max-w-full prose-img:h-auto
                         break-words transition-colors"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>
        </div>

        {/* Tabela de conteúdos na lateral direita */}
        <div className="w-full xl:w-80 flex-shrink-0 order-1 xl:order-2 p-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sticky top-4">
            <TableOfContents htmlContent={htmlContent} />
          </div>
        </div>
      </div>

      {/* Componente de busca na página */}
      <InPageSearch htmlContent={htmlContent} />
    </div>
  );
};

export default DocViewer;
