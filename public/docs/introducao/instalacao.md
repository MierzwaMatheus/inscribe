---
title: Guia de Instalação
order: 2
---

# Guia de Instalação

Este documento contém as instruções para instalação e configuração inicial do sistema.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Git**

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/internal-docs-app.git
cd internal-docs-app
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto

```bash
npm run dev
# ou
yarn dev
```

## Configuração

### Estrutura de Arquivos

A documentação deve ser organizada na pasta `public/docs/` seguindo esta estrutura:

```
public/docs/
├── introducao/
│   ├── bem-vindo.md
│   └── instalacao.md
├── tutoriais/
│   └── avancado.md
└── api/
    └── referencia.md
```

### Frontmatter

Cada arquivo Markdown pode conter metadados no frontmatter:

```yaml
---
title: Título do Documento
order: 1
description: Descrição opcional
tags: [tutorial, markdown]
---
```

## Solução de Problemas

Se encontrar problemas durante a instalação:

1. Verifique se a versão do Node.js está atualizada
2. Limpe o cache do npm: `npm cache clean --force`
3. Delete `node_modules` e execute `npm install` novamente

## Próximos Passos

Após a instalação, explore o [Tutorial Avançado](../tutoriais/avancado) para descobrir funcionalidades mais complexas.