---
title: Guia de Deploy
order: 2
description: Como fazer deploy da documentação em diferentes plataformas
tags: [deploy, produção, hosting]
---

# Guia de Deploy

Este documento explica como fazer deploy da sua documentação InBot em diferentes plataformas e ambientes.

## Preparação para Deploy

### Build de Produção

Antes do deploy, execute o build de produção:

```bash
# Gera o mapa de documentação e faz build
npm run build

# Ou execute separadamente
npm run generate-docs
npm run build
```

### Verificação Pré-Deploy

Execute estas verificações antes do deploy:

```bash
# 1. Teste o build localmente
npm run preview

# 2. Verifique se todos os links funcionam
npm run test:links

# 3. Valide a estrutura de arquivos
npm run validate:docs
```

## Deploy em Vercel

### Configuração Automática

1. **Conecte seu repositório** no Vercel
2. **Configure as variáveis de ambiente**:

```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev"
}
```

3. **Deploy automático** a cada push:

```yaml
# .github/workflows/vercel.yml
name: Vercel Production Deployment
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches:
      - main
jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Configuração Manual

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Faça login
vercel login

# Configure o projeto
vercel

# Deploy
vercel --prod
```

## Deploy em Netlify

### Deploy via Git

1. **Conecte repositório** no Netlify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Arquivo de configuração**:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/docs/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
    
[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### Deploy via CLI

```bash
# Instale a CLI do Netlify
npm install -g netlify-cli

# Faça login
netlify login

# Build e deploy
npm run build
netlify deploy --prod --dir=dist
```

## Deploy em GitHub Pages

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Generate docs map
      run: npm run generate-docs

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Configuração Manual

```bash
# Instale gh-pages
npm install --save-dev gh-pages

# Adicione script no package.json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# Execute deploy
npm run deploy
```

## Deploy em AWS S3 + CloudFront

### Configuração com AWS CLI

```bash
# Configure AWS CLI
aws configure

# Crie bucket S3
aws s3 mb s3://minha-documentacao

# Configure bucket para hosting
aws s3 website s3://minha-documentacao \
  --index-document index.html \
  --error-document error.html

# Upload dos arquivos
aws s3 sync dist/ s3://minha-documentacao --delete
```

### CloudFormation Template

```yaml
# infrastructure/cloudformation.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Documentação InBot Infrastructure'

Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${AWS::StackName}-docs'
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: error.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket.RegionalDomainName
            Id: S3Origin
            CustomOriginConfig:
              HTTPPort: 80
              HTTPSPort: 443
              OriginProtocolPolicy: http-only
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
        Enabled: true
        DefaultRootObject: index.html
```

## Deploy em Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Configuração Nginx

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuração para SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Headers de segurança
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Build e Deploy Docker

```bash
# Build da imagem
docker build -t docs-inbot .

# Execute localmente
docker run -p 8080:80 docs-inbot

# Push para registry
docker tag docs-inbot registry.exemplo.com/docs-inbot
docker push registry.exemplo.com/docs-inbot
```

## Deploy com Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  docs:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - docs
```

## Monitoramento e Saúde

### Health Checks

```typescript
// src/utils/healthcheck.ts
export const healthEndpoint = () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    checks: {
      docsGenerated: checkDocsMapExists(),
      assetsLoaded: checkAssetsLoaded(),
      routesWorking: checkRoutesWorking(),
    }
  };
};
```

### Monitoring com DataDog

```javascript
// src/utils/monitoring.js
import { datadogLogs } from '@datadog/browser-logs';

datadogLogs.init({
  clientToken: process.env.DATADOG_CLIENT_TOKEN,
  site: 'datadoghq.com',
  forwardErrorsToLogs: true,
  sampleRate: 100
});

export const logPageView = (path) => {
  datadogLogs.logger.info('Page viewed', {
    path,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  });
};
```

## Otimizações de Performance

### Configuração Vite para Produção

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          markdown: ['marked', 'gray-matter', 'highlight.js'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
```

### Otimização de Assets

```bash
# Instale ferramentas de otimização
npm install --save-dev imagemin imagemin-pngquant imagemin-mozjpeg

# Script de otimização
node scripts/optimize-assets.js
```

## Troubleshooting

### Problemas Comuns

**404 em rotas do React Router:**
```nginx
# Adicione no nginx.conf
location / {
    try_files $uri $uri/ /index.html;
}
```

**Assets não carregam:**
```javascript
// Verifique o base URL no vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/docs/' : '/',
});
```

**Build falha:**
```bash
# Limpe cache e reinstale
rm -rf node_modules dist
npm cache clean --force
npm install
```

### Logs de Deploy

Configure logs estruturados:

```bash
# Para debug de builds
npm run build -- --debug

# Para análise de bundle
npm run build -- --analyze
```

## Próximos Passos

Com o deploy configurado:

1. **Configure monitoramento** de performance
2. **Implemente backup** automático
3. **Configure CDN** para melhor performance global
4. **Automatize testes** de integração

---

*Para mais informações sobre performance e otimização, consulte nossa [documentação de configuração](configuracao).*