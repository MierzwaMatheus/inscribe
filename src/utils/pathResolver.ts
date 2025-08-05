// src/utils/pathResolver.ts
export function getMarkdownPath(pathname: string): string {
  console.log('%c[PathResolver] Processando caminho:', 'color: #9C27B0; font-weight: bold', { pathname });
  
  const base = '/docs';
  
  // Decodifica a URL para lidar com caracteres especiais
  const decodedPathname = decodeURIComponent(pathname);
  console.log('%c[PathResolver] Caminho decodificado:', 'color: #9C27B0', { decodedPathname });
  
  // Remove o prefixo /docs do caminho
  const cleanedPath = decodedPathname.replace(/^\/docs/, '');
  console.log('%c[PathResolver] Caminho limpo:', 'color: #9C27B0', { cleanedPath });
  
  const finalPath = `${base}${cleanedPath}.md`;
  console.log('%c[PathResolver] Caminho final:', 'color: #9C27B0', { finalPath });
  
  return finalPath;
}