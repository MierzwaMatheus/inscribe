import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import HomePage from "./pages/HomePage";
import DocLayout from "./pages/DocLayout"; // Novo layout para docs
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('%c[App] Aplicação inicializada', 'color: #E91E63; font-weight: bold; font-size: 16px');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col w-full min-h-screen">
              <Header />
              <Routes>
                {/* Rota da Página Inicial */}
                <Route path="/" element={<HomePage />} />

                {/* Rotas Públicas */}
                <Route path="/public/*" element={<DocLayout type="public" />} />

                {/* Rotas Internas Protegidas */}
                <Route 
                  path="/internal/*" 
                  element={
                    <ProtectedRoute>
                      <DocLayout type="internal" />
                    </ProtectedRoute>
                  }
                />

                {/* Rota de fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
