---
title: Componentes
order: 1
description: Documentação dos componentes principais da InBot
keywords: [componentes, frontend, modal, popup, arquivos]
---

# Componentes da InBot

## Estrutura Base da Página

```html
<div class="page">
  <div id="sidebar-container"></div>
  <div class="page-background">
    <div class="page-content">
      <header id="header-container" class="with-title with-help" data-title="Teste" data-help="teste"></header>
      <main class="container-fluid py-4"></main>
    </div>
  </div>
</div>
```

Inclua os arquivos principais:

```html
<script type="module" src="/projetos/inbot/components/components.js"></script>
<link rel="stylesheet" href="../components/components.css">
```

---

## Modal de Vídeo

Exibe um vídeo em um modal flutuante, redimensionável e móvel.

### Uso

```html
<button id="btn-ajuda" data-url="URL_DO_SEU_VIDEO_EMBED">
  Abrir Modal de Ajuda
</button>
```

### Atributos

| Atributo   | Descrição                                                        | Obrigatório |
|------------|------------------------------------------------------------------|-------------|
| id         | O ID do botão deve ser `btn-ajuda` para que o script o reconheça. | Sim         |
| data-url   | A URL no formato 'embed' do vídeo a ser exibido.                 | Sim         |

---

## Modal de Arquivos

### Como usar o arquivos-popup.js

O `arquivos-popup.js` é um componente JavaScript modular que cria um popup para gerenciamento de arquivos/mídias.

### 📋 Funcionalidades Principais
O popup oferece 3 abas principais:

1. 📚 Biblioteca - Visualizar e selecionar mídias já enviadas
2. 📤 Upload - Enviar novos arquivos (drag & drop ou seleção)
3. 🔗 URL Externa - Inserir imagens via URL

### 🚀 Como Usar

#### 1. Importar o Módulo
```js
import { createPopup, openArquivosPopup, closeArquivosPopup } from './components/arquivos-popup/arquivos-popup.js'
```

#### 2. Inicializar o Popup
```js
// Primeiro, criar o HTML do popup no DOM
await createPopup()

// Depois, abrir o popup com um callback
openArquivosPopup((midiaEscolhida) => {
  console.log('Mídia selecionada:', midiaEscolhida)
  // Fazer algo com a mídia escolhida
  // midiaEscolhida pode ser:
  // - Objeto da biblioteca: {id, nome, url, tipo, dimensoes, etc.}
  // - URL externa: {url, nome, tipo: 'url_externa', width, height}
})
```

#### 3. Exemplo Completo
```js
import { createPopup, openArquivosPopup } from './components/arquivos-popup/arquivos-popup.js'

document.addEventListener('DOMContentLoaded', async () => {
  // Criar o popup uma vez
  await createPopup()

  // Configurar botão para abrir popup
  const btnAbrirPopup = document.getElementById('meuBotaoArquivos')
  btnAbrirPopup.addEventListener('click', () => {
    openArquivosPopup((arquivo) => {
      // Callback executado quando usuário seleciona um arquivo
      console.log('Arquivo escolhido:', arquivo)
      // Exemplo: inserir imagem em um editor
      if (arquivo.url) {
        const img = document.createElement('img')
        img.src = arquivo.url
        img.alt = arquivo.nome
        document.getElementById('meuEditor').appendChild(img)
      }
    })
  })
})
```
