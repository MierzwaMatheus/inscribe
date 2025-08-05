// src/utils/pathResolver.ts
export function getMarkdownPath(pathname: string): string {
  const base = '/docs';
  const cleanedPath = pathname.replace(/^\/docs/, '');
  return `${base}${cleanedPath}.md`;
}