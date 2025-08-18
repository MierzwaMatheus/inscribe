import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Settings, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Bem-vindo à Documentação InBot
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sistema de documentação interna desenvolvido para facilitar o acesso e organização do conhecimento da equipe.
        </p>
      </div>

      {/* Cards de seções principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Documentação Pública
            </CardTitle>
            <CardDescription>
              Acesse os guias e tutoriais disponíveis para todos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="gradient" className="w-full">
              <NavLink to="/public/1_Como Usar o Sistema/index">
                Acessar
              </NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Documentação Interna
            </CardTitle>
            <CardDescription>
              Conteúdo exclusivo para a equipe de desenvolvimento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="gradient" className="w-full">
              <NavLink to="/internal/1_Introdução/bem-vindo">
                Acessar
              </NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recursos principais */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-card-foreground mb-4">
          Recursos Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-card-foreground">Leitura dinâmica de arquivos Markdown</h3>
                <p className="text-sm text-muted-foreground">
                  Carrega e renderiza documentos .md automaticamente
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-card-foreground">Menu lateral gerado automaticamente</h3>
                <p className="text-sm text-muted-foreground">
                  Estrutura baseada na organização de pastas
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-card-foreground">Renderização em tempo real</h3>
                <p className="text-sm text-muted-foreground">
                  Conteúdo processado instantaneamente no navegador
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-card-foreground">Suporte a frontmatter</h3>
                <p className="text-sm text-muted-foreground">
                  Metadados para organização e controle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dica sobre navegação */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Dica:</strong> Use o menu lateral para navegar pela documentação. 
          Clique no ícone de menu no canto superior esquerdo para expandir/contrair a sidebar.
        </p>
      </div>
    </div>
  );
};

export default HomePage;