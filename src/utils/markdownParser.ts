// src/utils/markdownParser.ts
export interface DocumentMetadata {
  title?: string;
  order?: number;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

export interface ParsedMarkdown {
  content: string;
  data: DocumentMetadata;
}

// Parser simples de frontmatter que funciona no navegador
export function parseMarkdown(markdownContent: string): ParsedMarkdown {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdownContent.match(frontmatterRegex);
  
  if (!match) {
    return {
      content: markdownContent,
      data: {}
    };
  }

  const [, frontmatterString, content] = match;
  const data: DocumentMetadata = {};

  // Parse simples do YAML frontmatter
  const lines = frontmatterString.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmedLine.substring(0, colonIndex).trim();
    let value = trimmedLine.substring(colonIndex + 1).trim();
    
    // Remove aspas se existirem
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Parse de arrays simples [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      data[key] = arrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''));
    } 
    // Parse de números
    else if (!isNaN(Number(value))) {
      data[key] = Number(value);
    }
    // Parse de booleans
    else if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
    }
    // String
    else {
      data[key] = value;
    }
  }

  return {
    content: content.trim(),
    data
  };
}