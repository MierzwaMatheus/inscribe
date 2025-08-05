---
title: Configuração do Sistema
order: 1
description: Guia completo de configuração e personalização
tags: [configuração, setup, personalização]
---

# Configuração do Sistema

Este documento detalha como configurar e personalizar o sistema de documentação para suas necessidades específicas.

## Configuração Inicial

### Estrutura de Projeto

Após a instalação, seu projeto deve ter esta estrutura:

```
internal-docs-app/
├── public/
│   └── docs/           # Seus arquivos Markdown
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas da aplicação
│   ├── utils/          # Utilitários
│   └── docsMap.json    # Mapa gerado automaticamente
├── scripts/
│   └── generate-docs-map.js
└── package.json
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Configurações da aplicação
VITE_APP_TITLE="Documentação InBot"
VITE_APP_DESCRIPTION="Sistema de documentação interna"

# URLs base
VITE_DOCS_BASE_URL="/docs"
VITE_API_BASE_URL="https://api.exemplo.com"

# Configurações de tema
VITE_THEME_PRIMARY_COLOR="#2563eb"
VITE_THEME_ACCENT_COLOR="#3b82f6"
```

## Personalização do Tema

### Cores Personalizadas

Edite o arquivo `src/index.css` para personalizar as cores:

```css
:root {
  /* Cores primárias */
  --primary: 221 83% 53%;        /* Azul principal */
  --primary-foreground: 210 40% 98%;
  
  /* Cores secundárias */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;
  
  /* Cores de destaque */
  --accent: 221 83% 53%;
  --accent-foreground: 210 40% 98%;
  
  /* Cores de fundo */
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
}

.dark {
  /* Tema escuro */
  --background: 222 84% 5%;
  --foreground: 210 40% 98%;
  /* ... outras cores para tema escuro */
}
```

### Tipografia

Configure fontes personalizadas:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.markdown-body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}
```

## Configuração do Menu

### Estrutura Automática

O menu é gerado automaticamente baseado na estrutura de pastas:

```
docs/
├── 01-introducao/      → "Introdução"
├── 02-guias/          → "Guias"
└── 03-api/            → "API"
```

### Ordenação Personalizada

Use o campo `order` no frontmatter:

```yaml
---
title: Página Importante
order: 1              # Aparece primeiro
---
```

### Seções Customizadas

Para controlar nomes das seções, use prefixos descritivos:

```
docs/
├── 01-getting-started/    → "Getting Started"
├── 02-user-guides/        → "User Guides"
├── 03-api-reference/      → "API Reference"
└── 99-appendix/           → "Appendix"
```

## Scripts de Build

### Script de Geração

O arquivo `scripts/generate-docs-map.js` pode ser customizado:

```javascript
// Configurações personalizadas
const CONFIG = {
  docsPath: path.join(__dirname, "..", "public", "docs"),
  outputPath: path.join(__dirname, "..", "src", "docsMap.json"),
  
  // Filtros de arquivos
  excludeFiles: ['.DS_Store', 'README.md'],
  excludeDirs: ['drafts', 'templates'],
  
  // Configurações de processamento
  defaultOrder: 999,
  titleTransform: (title) => title.replace(/[-_]/g, ' '),
};
```

### Build Automático

Para executar o script automaticamente durante desenvolvimento:

```json
{
  "scripts": {
    "dev": "npm run generate-docs && vite",
    "build": "npm run generate-docs && vite build",
    "generate-docs": "node scripts/generate-docs-map.js",
    "watch-docs": "nodemon --watch public/docs --exec \"npm run generate-docs\""
  }
}
```

## Configuração Avançada

### Plugins Markdown

Adicione plugins para funcionalidades extras:

```javascript
// src/utils/markdownProcessor.js
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

const renderer = new marked.Renderer();

// Plugin para links externos
renderer.link = (href, title, text) => {
  const isExternal = href.startsWith('http');
  const target = isExternal ? 'target="_blank" rel="noopener"' : '';
  return `<a href="${href}" ${target}>${text}</a>`;
};

// Configuração com plugins
marked.use(markedHighlight({
  highlight(code, lang) {
    // Sua lógica de highlight
  }
}));
```

### Componentes Customizados

Crie componentes React para funcionalidades específicas:

```typescript
// src/components/CustomDocViewer.tsx
import React from 'react';
import { DocViewer } from './DocViewer';

interface CustomDocViewerProps {
  showToc?: boolean;
  showMetadata?: boolean;
  enableComments?: boolean;
}

export const CustomDocViewer: React.FC<CustomDocViewerProps> = ({
  showToc = true,
  showMetadata = true,
  enableComments = false,
}) => {
  return (
    <div className="custom-doc-viewer">
      {showToc && <TableOfContents />}
      <DocViewer />
      {showMetadata && <DocumentMetadata />}
      {enableComments && <CommentsSection />}
    </div>
  );
};
```

### Middleware de Roteamento

Para funcionalidades avançadas de roteamento:

```typescript
// src/utils/routeMiddleware.ts
export const routeMiddleware = (path: string) => {
  // Redirecionamentos
  const redirects = {
    '/old-docs': '/docs/introducao/bem-vindo',
    '/help': '/docs/introducao/como-usar',
  };

  if (redirects[path]) {
    return redirects[path];
  }

  // Validação de acesso
  if (path.includes('/admin/') && !isAuthenticated()) {
    return '/login';
  }

  return path;
};
```

## Integrações

### Analytics

Adicione tracking de páginas:

```typescript
// src/utils/analytics.ts
export const trackPageView = (path: string) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
    });
  }
};
```

### Sistema de Busca

Configure busca com Algolia ou ElasticSearch:

```typescript
// src/utils/search.ts
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'YOUR_APP_ID',
  'YOUR_SEARCH_KEY'
);

export const searchDocs = async (query: string) => {
  const { hits } = await searchClient
    .initIndex('docs')
    .search(query);
    
  return hits;
};
```

## Deployment

### Build de Produção

Configurações para diferentes ambientes:

```javascript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/docs/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
  },
}));
```

### CI/CD Pipeline

Exemplo com GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths: ['public/docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Monitoramento

### Health Checks

Implemente verificações de saúde:

```typescript
// src/utils/healthCheck.ts
export const healthCheck = async () => {
  const checks = {
    docsMap: checkDocsMap(),
    markdownFiles: checkMarkdownFiles(),
    dependencies: checkDependencies(),
  };

  return {
    status: Object.values(checks).every(Boolean) ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
  };
};
```

### Logs e Debugging

Configure logging estruturado:

```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  },
};
```

## Próximos Passos

Com a configuração básica completa, você pode:

1. **Personalizar o design** seguindo o [Tutorial Avançado](../tutoriais/avancado)
2. **Configurar deployment** com o [Guia de Deploy](deploy)
3. **Adicionar funcionalidades** como busca e comentários

---

*Para dúvidas sobre configuração, consulte a [documentação de referência](../api/referencia) ou abra uma issue no repositório.*