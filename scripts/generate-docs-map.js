// scripts/generate-docs-map.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsPath = path.join(__dirname, "..", "public", "docs");
const outputPath = path.join(__dirname, "..", "src", "docsMap.json");

function readDirectory(dir, basePath = "") {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];

  files.forEach((file) => {
    const fullPath = path.join(dir, file.name);
    const relativePath = basePath ? `${basePath}/${file.name}` : file.name;
    
    if (file.isDirectory()) {
      // É um diretório (seção)
      const orderMatch = file.name.match(/^(\d+)[-_]/);
      const order = orderMatch ? parseInt(orderMatch[1], 10) : 999;

      const sectionName = file.name
        .replace(/^\d+[-_]/, "") // Remove prefixos numéricos como "01-", "02_"
        .replace(/[-_]/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
        
      const sectionData = {
        section: sectionName,
        order: order,
        path: `/docs/${relativePath}`,
        pages: readDirectory(fullPath, relativePath),
      };
      
      // Só adiciona a seção se tiver páginas
      if (sectionData.pages.length > 0) {
        result.push(sectionData);
      }
    } else if (file.isFile() && file.name.endsWith(".md")) {
      // É um arquivo Markdown (página)
      try {
        const fileContent = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(fileContent);
        const fileName = path.parse(file.name).name;
        const orderMatch = fileName.match(/^(\d+)[-_]/);
        const order = orderMatch ? parseInt(orderMatch[1], 10) : 999;

        const pagePath = `/docs/${relativePath.replace(".md", "")}`;

        const pageData = {
          title: data.title || fileName
            .replace(/^\d+[-_]/, "") // Remove prefixos numéricos
            .replace(/[-_]/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          path: pagePath,
          order: data.order || order,
          description: data.description || null,
          tags: data.tags || null,
        };

        result.push(pageData);
      } catch (error) {
        console.warn(`Erro ao processar ${fullPath}:`, error.message);
      }
    }
  });

  // Ordena as páginas e seções com base na propriedade 'order'
  result.sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 999;
    const orderB = b.order !== undefined ? b.order : 999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Se a ordem for a mesma, ordena alfabeticamente pelo título ou nome da seção
    const titleA = a.title || a.section || "";
    const titleB = b.title || b.section || "";
    return titleA.localeCompare(titleB);
  });

  return result;
}

// Verifica se a pasta docs existe
if (!fs.existsSync(docsPath)) {
  console.error(`Pasta de documentação não encontrada: ${docsPath}`);
  process.exit(1);
}

try {
  const docsMap = readDirectory(docsPath);
  
  // Cria o diretório src se não existir
  const srcDir = path.dirname(outputPath);
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(docsMap, null, 2), "utf-8");
  console.log(`✅ docsMap.json gerado com sucesso em: ${outputPath}`);
  console.log(`📊 Total de itens processados: ${JSON.stringify(docsMap, null, 2).split('\n').length} linhas`);
  
  // Log da estrutura gerada
  console.log('\n📁 Estrutura gerada:');
  docsMap.forEach(item => {
    if (item.pages) {
      console.log(`  📂 ${item.section} (${item.pages.length} páginas)`);
      item.pages.forEach(page => {
        console.log(`    📄 ${page.title}`);
      });
    } else {
      console.log(`  📄 ${item.title}`);
    }
  });
  
} catch (error) {
  console.error("❌ Erro ao gerar docsMap.json:", error);
  process.exit(1);
}