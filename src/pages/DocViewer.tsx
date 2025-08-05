import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMarkdownPath } from '../utils/pathResolver';
import { parseMarkdown, DocumentMetadata } from '../utils/markdownParser';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Tema GitHub para destaque de código

const DocViewer: React.FC = () => {
  const { '*': docPath } = useParams();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [title, setTitle] = useState<string>('Carregando...');
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<DocumentMetadata>({});

  // Função para processar markdown com highlight
  const processMarkdown = (content: string): string => {
    // Configuração básica do marked
    const html = marked(content) as string;
    
    // Aplicar highlight.js após a conversão
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const codeBlocks = tempDiv.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const element = block as HTMLElement;
      hljs.highlightElement(element);
    });
    
    return tempDiv.innerHTML;
  };

  useEffect(() => {
    const fullPath = getMarkdownPath(`/docs/${docPath}`);
    setError(null); // Limpa erros anteriores
    setTitle('Carregando...');

    fetch(fullPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Não foi possível carregar o documento: ${response.statusText}`);
        }
        return response.text();
      })
      .then(mdContent => {
        const { content, data } = parseMarkdown(mdContent);
        setTitle(data.title || 'Documento sem título');
        setMetadata(data);
        setHtmlContent(processMarkdown(content));
      })
      .catch(err => {
        console.error("Erro ao carregar Markdown:", err);
        setError(`Erro ao carregar o documento: ${err.message}. Verifique se o caminho '${fullPath}' está correto.`);
        setTitle('Erro');
        setHtmlContent('');
      });
  }, [docPath]);

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
              href="/docs/introducao/bem-vindo" 
              className="text-primary hover:text-primary/80 underline"
            >
              Ir para introdução
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <article className="bg-card rounded-lg border p-8">
        {/* Cabeçalho do documento */}
        <header className="mb-8 pb-6 border-b">
          <h1 className="text-4xl font-bold text-card-foreground mb-2">{title}</h1>
          
          {/* Metadados do frontmatter */}
          {(metadata.description || metadata.tags) && (
            <div className="mt-4 space-y-2">
              {metadata.description && (
                <p className="text-lg text-muted-foreground">{metadata.description}</p>
              )}
              
              {metadata.tags && Array.isArray(metadata.tags) && (
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Breadcrumb */}
          <div className="mt-4 text-sm text-muted-foreground">
            <span>📍 /docs/{docPath || '(raiz)'}</span>
          </div>
        </header>

        {/* Conteúdo do documento */}
        <div 
          className="markdown-body prose prose-slate dark:prose-invert max-w-none
                     prose-headings:text-card-foreground 
                     prose-p:text-card-foreground 
                     prose-strong:text-card-foreground
                     prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                     prose-pre:bg-muted prose-pre:border
                     prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary
                     prose-a:text-primary hover:prose-a:text-primary/80
                     prose-table:text-card-foreground
                     prose-th:text-card-foreground prose-td:text-card-foreground"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </article>
    </div>
  );
};

export default DocViewer;