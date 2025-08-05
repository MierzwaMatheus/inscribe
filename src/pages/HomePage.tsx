import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Bem-vindo à Documentação InBot
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Sistema de documentação interna desenvolvido para facilitar o acesso e organização do conhecimento da equipe.
        </p>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-card-foreground mb-3">
            Recursos Principais:
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Leitura dinâmica de arquivos Markdown</li>
            <li>Menu lateral gerado automaticamente da estrutura de pastas</li>
            <li>Renderização em tempo real do conteúdo</li>
            <li>Suporte a frontmatter para metadados</li>
          </ul>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Navegue pela documentação usando o menu lateral (a ser implementado).
        </p>
      </div>
    </div>
  );
};

export default HomePage;