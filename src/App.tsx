import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import HomePage from "./pages/HomePage";
import DocViewer from "./pages/DocViewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          {/* Header global com trigger sempre visível */}
          <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center border-b bg-background">
            <SidebarTrigger className="ml-2" />
            <div className="flex-1 px-4">
              <h1 className="text-sm font-semibold text-foreground">
                Documentação InBot
              </h1>
            </div>
          </header>

          <div className="flex min-h-screen w-full pt-12">
            <AppSidebar />
            
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/docs/*" element={<DocViewer />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
