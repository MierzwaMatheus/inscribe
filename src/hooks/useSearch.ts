import { useState, useEffect, useMemo } from 'react';
import docsMap from '../docsMap.json';
import { getMarkdownPath } from '../utils/pathResolver';
import { parseMarkdown } from '../utils/markdownParser';

export interface SearchResult {
  title: string;
  path: string;
  section: string;
  description?: string;
  tags?: string[];
  contentMatches: ContentMatch[];
  score: number;
}

export interface ContentMatch {
  text: string;
  context: string;
  position: number;
}

export interface DocumentContent {
  path: string;
  title: string;
  section: string;
  content: string;
  description?: string;
  tags?: string[];
}

export const useSearch = (type?: 'public' | 'internal') => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documentsContent, setDocumentsContent] = useState<DocumentContent[]>([]);
  const [isIndexing, setIsIndexing] = useState(false);

  console.log('%c[useSearch] Hook inicializado', 'color: #9C27B0; font-weight: bold');

  // Indexar todos os documentos na inicialização
  useEffect(() => {
    const indexDocuments = async () => {
      console.log('%c[useSearch] Iniciando indexação de documentos', 'color: #9C27B0');
      setIsIndexing(true);
      
      const allDocuments: DocumentContent[] = [];
      
      try {
        const processSection = async (section: any) => {
          console.log(`%c[useSearch] Indexando seção: ${section.section}`, 'color: #9C27B0');
          for (const page of section.pages) {
            try {
              const fullPath = getMarkdownPath(page.path);
              console.log(`%c[useSearch] Carregando documento: ${page.title}`, 'color: #9C27B0');
              
              const response = await fetch(fullPath);
              if (response.ok) {
                const markdownContent = await response.text();
                const parsed = parseMarkdown(markdownContent);
                
                allDocuments.push({
                  path: page.path,
                  title: page.title,
                  section: section.section,
                  content: parsed.content,
                  description: page.description || parsed.data.description,
                  tags: page.tags || parsed.data.tags
                });
                
                console.log(`%c[useSearch] Documento indexado: ${page.title}`, 'color: #4CAF50');
              } else {
                console.warn(`%c[useSearch] Falha ao carregar: ${page.title}`, 'color: #FF9800');
              }
            } catch (error) {
              console.error(`%c[useSearch] Erro ao indexar ${page.title}:`, 'color: #F44336', error);
            }
          }
        };

        // Se um tipo for especificado, indexe apenas essa seção. Caso contrário, indexe tudo.
        let sectionsToIndex = [];
        if (type) {
          sectionsToIndex = docsMap[type] || [];
        } else {
          sectionsToIndex = [...(docsMap.internal || []), ...(docsMap.public || [])];
        }

        for (const section of sectionsToIndex) {
          await processSection(section);
        }
        
        setDocumentsContent(allDocuments);
        console.log(`%c[useSearch] Indexação concluída: ${allDocuments.length} documentos`, 'color: #4CAF50; font-weight: bold');
      } catch (error) {
        console.error('%c[useSearch] Erro na indexação:', 'color: #F44336; font-weight: bold', error);
      } finally {
        setIsIndexing(false);
      }
    };

    indexDocuments();
  }, [type]);

  // Função para encontrar matches no conteúdo
  const findContentMatches = (content: string, term: string): ContentMatch[] => {
    const matches: ContentMatch[] = [];
    const lowerContent = content.toLowerCase();
    const lowerTerm = term.toLowerCase();
    
    let index = 0;
    while (index < lowerContent.length) {
      const matchIndex = lowerContent.indexOf(lowerTerm, index);
      if (matchIndex === -1) break;
      
      // Extrair contexto ao redor do match (50 caracteres antes e depois)
      const contextStart = Math.max(0, matchIndex - 50);
      const contextEnd = Math.min(content.length, matchIndex + term.length + 50);
      const context = content.substring(contextStart, contextEnd);
      
      // Texto exato do match
      const matchText = content.substring(matchIndex, matchIndex + term.length);
      
      matches.push({
        text: matchText,
        context: context,
        position: matchIndex
      });
      
      index = matchIndex + 1;
    }
    
    return matches.slice(0, 3); // Limitar a 3 matches por documento
  };

  // Função para calcular score de relevância
  const calculateScore = (doc: DocumentContent, term: string): number => {
    const lowerTerm = term.toLowerCase();
    let score = 0;
    
    // Score por título (peso 10)
    if (doc.title.toLowerCase().includes(lowerTerm)) {
      score += 10;
    }
    
    // Score por descrição (peso 5)
    if (doc.description && doc.description.toLowerCase().includes(lowerTerm)) {
      score += 5;
    }
    
    // Score por tags (peso 3)
    if (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(lowerTerm))) {
      score += 3;
    }
    
    // Score por conteúdo (peso 1 por match)
    const contentMatches = findContentMatches(doc.content, term);
    score += contentMatches.length;
    
    return score;
  };

  // Resultados da busca usando useMemo para otimização
  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || documentsContent.length === 0) {
      return [];
    }
    
    console.log(`%c[useSearch] Realizando busca por: "${searchTerm}"`, 'color: #9C27B0; font-weight: bold');
    setIsLoading(true);
    
    const results: SearchResult[] = [];
    
    for (const doc of documentsContent) {
      const score = calculateScore(doc, searchTerm);
      
      if (score > 0) {
        const contentMatches = findContentMatches(doc.content, searchTerm);
        
        results.push({
          title: doc.title,
          path: doc.path,
          section: doc.section,
          description: doc.description,
          tags: doc.tags,
          contentMatches,
          score
        });
      }
    }
    
    // Ordenar por score (maior primeiro)
    const sortedResults = results.sort((a, b) => b.score - a.score);
    
    console.log(`%c[useSearch] Busca concluída: ${sortedResults.length} resultados`, 'color: #4CAF50; font-weight: bold');
    setIsLoading(false);
    
    return sortedResults;
  }, [searchTerm, documentsContent]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    isIndexing,
    documentsCount: documentsContent.length
  };
};