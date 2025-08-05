import React from 'react';
import { useParams } from 'react-router-dom';

const DocViewer: React.FC = () => {
  const { '*': docPath } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-card rounded-lg border p-6">
          <h1 className="text-3xl font-bold text-card-foreground mb-4">
            Visualizador de Documentos
          </h1>
          
          <div className="bg-muted p-4 rounded-md mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Caminho do documento:</strong>
            </p>
            <code className="text-sm bg-background px-2 py-1 rounded border">
              /docs/{docPath || '(raiz)'}
            </code>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground">
              O conteúdo Markdown será carregado e renderizado aqui nas próximas etapas do desenvolvimento.
            </p>
            
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Próximas Funcionalidades:
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Carregamento dinâmico de arquivos .md</li>
                <li>• Parser de Markdown para HTML</li>
                <li>• Processamento de frontmatter</li>
                <li>• Menu lateral dinâmico</li>
                <li>• Navegação entre documentos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocViewer;