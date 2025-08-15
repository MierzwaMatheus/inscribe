---
title: Como Usar o Sistema
order: 2
description: Este guia explica como navegar e utilizar o sistema de documentação interna de forma eficiente.
tags: [tutorial, básico, guia]
---

## Navegação Básica

### Menu Lateral

O sistema possui um menu lateral dinâmico que é gerado automaticamente a partir da estrutura de pastas:

- **Seções**: Representadas pelas pastas principais
- **Páginas**: Arquivos Markdown dentro das seções
- **Ordenação**: Controlada pelo campo `order` no frontmatter

### Estrutura de URLs

As URLs seguem o padrão da estrutura de arquivos:

```
/docs/secao/pagina
```

**Exemplos:**
- `/docs/introducao/bem-vindo` → `public/docs/introducao/bem-vindo.md`
- `/docs/tutoriais/avancado` → `public/docs/tutoriais/avancado.md`

## Criando Documentação

### 1. Estrutura de Arquivos

Organize seus documentos seguindo esta estrutura:

```
public/docs/
├── 01-introducao/
│   ├── bem-vindo.md
│   └── como-usar.md
├── 02-guias/
│   ├── configuracao.md
│   └── deploy.md
└── 03-api/
    └── referencia.md
```

### 2. Frontmatter

Todo arquivo Markdown deve começar com frontmatter:

```yaml
---
title: Título da Página
order: 1
description: Descrição opcional
tags: [tag1, tag2]
---
```

**Campos obrigatórios:**
- `title`: Nome que aparecerá no menu

**Campos opcionais:**
- `order`: Número para ordenação (padrão: 999)
- `description`: Descrição da página
- `tags`: Array de tags para categorização

### 3. Formatação Markdown

O sistema suporta Markdown completo com extensões:

#### Texto Básico

- **Negrito** com `**texto**`
- *Itálico* com `*texto*`
- `Código inline` com backticks
- ~~Riscado~~ com `~~texto~~`

#### Listas

**Lista com marcadores:**
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

**Lista numerada:**
1. Primeiro passo
2. Segundo passo
3. Terceiro passo

#### Código

```typescript
interface DocumentConfig {
  title: string;
  order?: number;
  description?: string;
}

const config: DocumentConfig = {
  title: "Minha Página",
  order: 1
};
```

#### Tabelas

| Recurso | Status | Prioridade |
|---------|--------|-----------|
| Menu dinâmico | ✅ | Alta |
| Busca | 🚧 | Média |
| Comentários | ⏳ | Baixa |

#### Citações

> **Dica**: Use citações para destacar informações importantes.

> **Aviso**: Cuidado ao modificar arquivos de configuração.

## Funcionalidades Avançadas

### Atualização Automática

O sistema regenera automaticamente o menu quando:

1. Novos arquivos são adicionados
2. Frontmatter é modificado
3. Estrutura de pastas é alterada

### Busca e Navegação

- **Busca**: Em desenvolvimento
- **Navegação**: Use as setas do teclado
- **Breadcrumbs**: Mostra o caminho atual

### Performance

- **Carregamento lazy**: Documentos são carregados sob demanda
- **Cache**: Conteúdo é armazenado em cache local
- **Otimização**: Imagens e assets são otimizados

## Dicas e Melhores Práticas

### Organização

1. **Use prefixos numéricos** nas pastas para controlar ordem
2. **Nomes descritivos** para arquivos e pastas
3. **Frontmatter consistente** em todos os documentos

### Escrita

1. **Títulos claros** e hierárquicos
2. **Parágrafos curtos** para melhor leitura
3. **Exemplos práticos** sempre que possível

### Manutenção

1. **Revise regularmente** a documentação
2. **Mantenha links atualizados**
3. **Remove conteúdo obsoleto**

## Solução de Problemas

### Página não aparece no menu

**Possíveis causas:**
- Arquivo sem extensão `.md`
- Frontmatter inválido
- Arquivo fora da pasta `public/docs/`

**Solução:**
1. Verifique a extensão do arquivo
2. Valide o frontmatter YAML
3. Confirme a localização do arquivo

### Erro de carregamento

**Se uma página não carrega:**
1. Verifique se o arquivo existe
2. Confirme o caminho da URL
3. Verifique o console do navegador

### Menu não atualiza

**Para forçar atualização:**
1. Limpe o cache do navegador
2. Reinicie o servidor de desenvolvimento
3. Verifique se o script de geração foi executado

## Próximos Passos

Agora que você sabe usar o sistema, explore:

- [Tutorial Avançado](../tutoriais/avancado) - Recursos mais complexos
- [Configuração](../guias/configuracao) - Personalização do sistema
- [Deploy](../guias/deploy) - Como publicar a documentação

---

*Precisa de ajuda? Consulte os outros documentos ou entre em contato com a equipe.*