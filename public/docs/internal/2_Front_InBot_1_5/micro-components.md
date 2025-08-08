---
title: Micro-Componentes
order: 2
description: Documentação dos microcomponentes da InBot
tags: [microcomponentes, frontend, inbot 1.5]
---

# Instalação

Para utilizar os microcomponentes, inclua os seguintes arquivos no seu projeto:

```html
<!-- CSS dos Micro Componentes -->
<link rel="stylesheet" href="/projetos/micro-components/micro-components.css" />

<!-- JS dos Micro Componentes -->
<script type="module" src="/projetos/micro-components/micro-components.js"></script>
```

## 🔎 Botão de Filtro

Um botão de filtro estilizado com suporte a ícones e estado ativo.

### Uso

```html
<div class="filter-btn-container"
    data-text="Filtrar Itens"
    data-icon="filter"
    data-name="demo_filter"
    data-value="1"
    data-checked="false">
</div>
```

### Atributos

| Atributo      | Descrição                                  | Padrão          |
|---------------|--------------------------------------------|-----------------|
| `data-text`   | Texto exibido no botão                     | --              |
| `data-icon`   | Nome do ícone Lucide ou caminho do SVG     | --              |\
| `data-name`   | Nome do input radio (para agrupar botões)  | `filter_option` |
| `data-value`  | Valor do input radio                       | `-1`            |
| `data-checked`| Se o botão começa marcado                  | `false`         |
