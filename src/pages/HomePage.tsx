import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Settings, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
          Bem-vindo à Documentação InBot
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
          Sistema de documentação interna desenvolvido para facilitar o acesso e organização do conhecimento da equipe.
        </p>
      </div>

      {/* Cards de seções principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="leading-tight">Documentação Pública</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Acesse os guias e tutoriais disponíveis para todos.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="gradient" className="w-full text-sm sm:text-base py-2 sm:py-3">
              <NavLink to="/public/1_Como Usar o Sistema/index">
                Acessar
              </NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="leading-tight">Documentação Interna</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Conteúdo exclusivo para a equipe de desenvolvimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="gradient" className="w-full text-sm sm:text-base py-2 sm:py-3">
              <NavLink to="/internal/1_Introdução/bem-vindo">
                Acessar
              </NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recursos principais */}
      <div className="bg-card border rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground mb-3 sm:mb-4">
          Recursos Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div className="min-w-0">
                <h3 className="font-medium text-card-foreground text-sm sm:text-base leading-tight">
                  Leitura dinâmica de arquivos Markdown
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Carrega e renderiza documentos .md automaticamente
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div className="min-w-0">
                <h3 className="font-medium text-card-foreground text-sm sm:text-base leading-tight">
                  Menu lateral gerado automaticamente
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Estrutura baseada na organização de pastas
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div className="min-w-0">
                <h3 className="font-medium text-card-foreground text-sm sm:text-base leading-tight">
                  Renderização em tempo real
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Conteúdo processado instantaneamente no navegador
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div className="min-w-0">
                <h3 className="font-medium text-card-foreground text-sm sm:text-base leading-tight">
                  Suporte a frontmatter
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Metadados para organização e controle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dica sobre navegação */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          💡 <strong>Dica:</strong> Use o menu lateral para navegar pela documentação. 
          <span className="block sm:inline mt-1 sm:mt-0">
            Em dispositivos móveis, clique no ícone de menu no canto superior esquerdo.
          </span>
        </p>
      </div>
    </div>
  );
};

export default HomePage;