import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";

// Plugin para gerar o docsMap.json automaticamente
const generateDocsMapPlugin = () => {
  return {
    name: "generate-docs-map",
    buildStart() {
      try {
        console.log("🔄 Gerando docsMap.json...");
        execSync("node scripts/generate-docs-map.js", { stdio: "inherit" });
      } catch (error) {
        console.warn("⚠️ Erro ao gerar docsMap.json:", error);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    generateDocsMapPlugin(),
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
