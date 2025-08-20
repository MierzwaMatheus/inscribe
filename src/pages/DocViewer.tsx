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
      headerPrefix: "",
    });

    // Configuração básica do marked
    const html = marked(content) as string;

    // Aplicar highlight.js após a conversão
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Garantir que todos os headings tenham IDs únicos
    const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const usedIds = new Set<string>();

    headings.forEach((heading, index) => {
      let headingId = heading.id;
      const text = heading.textContent || "";

      // Se não tem ID ou o ID já está sendo usado, gerar um novo
      if (!headingId || usedIds.has(headingId)) {
        const slugId = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();

        // Se o slugId já existe ou está vazio, usar o índice
        headingId =
          slugId && !usedIds.has(slugId) ? slugId : `heading-${index}`;
        heading.id = headingId;

        console.log(
          "%c[DocViewer] ID gerado para heading:",
          "color: #4CAF50; font-weight: bold",
          { text, id: headingId, wasEmpty: !heading.id }
        );
      }

      // Registrar o ID usado
      usedIds.add(headingId);
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
          console.error(
            "%c[DocViewer] Elemento não encontrado para hash:",
            "color: #FF9800; font-weight: bold",
            hash
          );

          // Tentar encontrar o elemento novamente após um tempo maior
          setTimeout(() => {
            const retryElement = document.getElementById(hash);
            if (retryElement) {
              const elementPosition = retryElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - 100;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });

              console.log(
                "%c[DocViewer] Navegação para hash concluída na segunda tentativa:",
                "color: #4CAF50; font-weight: bold",
                hash
              );
            } else {
              console.error(
                "%c[DocViewer] Elemento não encontrado mesmo após segunda tentativa:",
                "color: #F44336; font-weight: bold",
                hash
              );
            }
          }, 500);
        }
      }, 300);
    }
  }, [htmlContent]);

  if (error) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-destructive mb-4">
            {title}
          </h1>
          <p className="text-destructive mb-4 text-sm sm:text-base">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <a
              href="/"
              className="text-primary hover:text-primary/80 underline text-sm sm:text-base"
            >
              ← Voltar para a página inicial
            </a>
            <a
              href="/public/1_Publicas/bem-vindo"
              className="text-primary hover:text-primary/80 underline text-sm sm:text-base"
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
      <div className="flex flex-col xl:flex-row gap-2 sm:gap-4 xl:gap-8 p-2 sm:p-4 xl:p-6 min-h-full">
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0 order-2 xl:order-1 overflow-x-hidden">
          <article className="p-4 sm:p-6 md:p-8 xl:p-10 w-full max-w-none">
            {/* Cabeçalho do documento */}
            <header className="mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700 transition-colors">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors leading-tight">
                {title}
              </h1>

              {/* Metadados do frontmatter */}
              {(metadata.description || metadata.tags) && (
                <div className="mt-4 sm:mt-6 space-y-3">
                  {metadata.description && (
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 transition-colors leading-relaxed">
                      {metadata.description}
                    </p>
                  )}

                  {metadata.tags && Array.isArray(metadata.tags) && (
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {metadata.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm sm:text-base rounded-lg transition-colors font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Breadcrumb */}
              <div className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-500 dark:text-gray-400 transition-colors">
                <span className="break-all font-medium">
                  📍 /{type}/{docPath || "(raiz)"}
                </span>
              </div>
            </header>

            {/* Conteúdo do documento */}
            <div
              className="markdown-body prose prose-base sm:prose-lg prose-slate max-w-none w-full overflow-x-auto
                         prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:scroll-mt-20
                         prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
                         prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                         prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/30 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:break-all prose-code:text-sm sm:prose-code:text-base
                         prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800 prose-pre:border dark:prose-pre:border-gray-700 prose-pre:overflow-x-auto prose-pre:max-w-full prose-pre:text-sm sm:prose-pre:text-base
                         prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:border-l-blue-500 dark:prose-blockquote:border-l-blue-400 prose-blockquote:text-base sm:prose-blockquote:text-lg prose-blockquote:pl-6 prose-blockquote:py-3
                         prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300 prose-a:break-words
                         prose-table:text-gray-700 dark:prose-table:text-gray-300 prose-table:table-auto prose-table:w-full prose-table:overflow-x-auto prose-table:text-sm sm:prose-table:text-base
                         prose-th:text-gray-900 dark:prose-th:text-gray-100 prose-th:px-4 prose-th:py-3 prose-th:text-sm sm:prose-th:text-base prose-td:text-gray-700 dark:prose-td:text-gray-300 prose-td:px-4 prose-td:py-3 prose-td:text-sm sm:prose-td:text-base
                         prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg
                         prose-ul:space-y-1 prose-ol:space-y-1 prose-ul:text-base sm:prose-ul:text-lg prose-ol:text-base sm:prose-ol:text-lg
                         prose-li:text-base sm:prose-li:text-lg prose-li:leading-relaxed
                         break-words transition-colors"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>
        </div>

        {/* Tabela de conteúdos na lateral direita */}
        <div className="w-full xl:w-80 flex-shrink-0 order-1 xl:order-2 p-2 sm:p-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 sticky top-2 sm:top-4">
            {htmlContent && <TableOfContents htmlContent={htmlContent} />}
          </div>
        </div>
      </div>

      {/* Componente de busca na página */}
      <InPageSearch htmlContent={htmlContent} />
    </div>
  );
};

export default DocViewer;
